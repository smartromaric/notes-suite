import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../../services/authService';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      await SecureStore.setItemAsync('accessToken', response.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(name, email, password);
      await SecureStore.setItemAsync('accessToken', response.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authService.refreshToken(refreshToken);
      await SecureStore.setItemAsync('accessToken', response.accessToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
      }
      
      throw new Error('No stored tokens');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load user from storage');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      SecureStore.deleteItemAsync('accessToken');
      SecureStore.deleteItemAsync('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        SecureStore.deleteItemAsync('accessToken');
        SecureStore.deleteItemAsync('refreshToken');
      })
      // Load user from storage
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;
export default authSlice;
