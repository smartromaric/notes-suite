import api from './api';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async logout(): Promise<void> {
    // Clear tokens from secure storage
    const SecureStore = require('expo-secure-store');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }
}

export const authService = new AuthService();
