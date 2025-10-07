import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, Note, CreateNoteRequest, UpdateNoteRequest, ShareNoteRequest, PublicNote, ApiResponse, SearchParams } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// Notes API
export const notesApi = {
  getNotes: async (params?: SearchParams): Promise<Note[]> => {
    const response = await api.get('/notes', { params });
    const data: ApiResponse<Note> = response.data;
    return data.content || data as any;
  },

  getNote: async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  updateNote: async (noteData: UpdateNoteRequest): Promise<Note> => {
    const { id, ...updateData } = noteData;
    const response = await api.put(`/notes/${id}`, updateData);
    return response.data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  shareNote: async (shareData: ShareNoteRequest): Promise<any> => {
    const response = await api.post(`/notes/${shareData.noteId}/share/user?email=${shareData.email}`);
    return response.data;
  },

  shareNotePublic: async (noteId: number): Promise<string> => {
    const response = await api.post(`/notes/${noteId}/share/public`);
    return response.data;
  },

  getPublicNote: async (token: string): Promise<PublicNote> => {
    const response = await api.get(`/p/${token}`);
    return response.data;
  },
};

export default api;
