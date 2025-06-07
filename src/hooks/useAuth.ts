import { useState } from 'react';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SignInResponse {
  success: boolean;
}

interface CheckResponse {
  isValid: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const authenticate = async (initData: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data } = await axios.post<SignInResponse>('/api/auth/signin', { initData }, {
        withCredentials: true // Important for handling cookies
      });

      if (!data.success) {
        throw new Error('Authentication failed');
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return true;
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
      return false;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get<CheckResponse>('/api/auth/check', {
        withCredentials: true
      });
      
      if (!data.isValid) {
        throw new Error('Session expired');
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Session expired'
      });
    }
  };

  return {
    ...state,
    authenticate,
    checkAuthStatus
  };
}; 