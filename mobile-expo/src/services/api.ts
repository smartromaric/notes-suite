import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Récupérer l'URL depuis les variables d'environnement ou utiliser les valeurs par défaut
const API_BASE_URL = 
  Constants.expoConfig?.extra?.apiUrl ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:9090'  // Android émulateur
    : 'http://192.168.104.27:9090'); // iOS/Téléphone physique

console.log('API_BASE_URL', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT et logger la requête
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    console.log('[REQ]', config.method?.toUpperCase(), (config.baseURL ?? '') + (config.url ?? ''), config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses, logger et le refresh token
api.interceptors.response.use(
  (response) => {
    console.log('[RES]', response.status, (response.config.baseURL ?? '') + (response.config.url ?? ''));
    return response;
  },
  async (error) => {
    console.log('[ERR]', error.response?.status, (error.config?.baseURL ?? '') + (error.config?.url ?? ''), error.response?.data);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const { accessToken } = response.data;
          await SecureStore.setItemAsync('accessToken', accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // You might want to dispatch a logout action here
      }
    }

    return Promise.reject(error);
  }
);

export default api;
