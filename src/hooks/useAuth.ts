import { useState } from 'react';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
      
      await axios.post('/api/auth/signin', { initData }, {
        withCredentials: true // Important for handling cookies
      });

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
      await axios.get('/api/auth/check', {
        withCredentials: true
      });
      
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