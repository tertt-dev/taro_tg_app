import { useState } from 'react';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SignInResponse {
  success: boolean;
  error?: string;
}

interface CheckResponse {
  isValid: boolean;
  error?: string;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const authenticate = async (initData: string) => {
    console.log('useAuth: Starting authentication...');
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('useAuth: Sending authentication request...');
      const { data } = await axios.post<SignInResponse>('/api/auth/signin', { initData }, {
        withCredentials: true
      });
      console.log('useAuth: Authentication response:', data);

      if (!data.success) {
        const errorMsg = data.error || 'Authentication failed';
        console.error('useAuth: Authentication failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('useAuth: Authentication successful');
      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return true;
    } catch (error) {
      console.error('useAuth: Authentication error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
      console.error('useAuth: Error message:', errorMsg);
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMsg
      });
      return false;
    }
  };

  const checkAuthStatus = async () => {
    console.log('useAuth: Checking auth status...');
    try {
      const { data } = await axios.get<CheckResponse>('/api/auth/check', {
        withCredentials: true
      });
      console.log('useAuth: Auth check response:', data);
      
      if (!data.isValid) {
        const errorMsg = data.error || 'Session expired';
        console.error('useAuth: Auth check failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('useAuth: Auth check successful');
      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('useAuth: Auth check error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Session expired';
      console.error('useAuth: Error message:', errorMsg);
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMsg
      });
    }
  };

  return {
    ...state,
    authenticate,
    checkAuthStatus
  };
}; 