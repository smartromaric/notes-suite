import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import type { RootState, AppDispatch } from '../store';
import { loginUser, registerUser, logout, clearError } from '../store/auth/authSlice';
import type { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      toast.success('Connexion réussie !');
      return result;
    } catch (error: any) {
      toast.error(error || 'Erreur de connexion');
      throw error;
    }
  }, [dispatch]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      toast.success('Inscription réussie !');
      return result;
    } catch (error: any) {
      toast.error(error || 'Erreur d\'inscription');
      throw error;
    }
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
    toast.info('Déconnexion réussie');
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
