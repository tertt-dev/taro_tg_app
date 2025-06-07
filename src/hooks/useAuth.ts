import { useState, useCallback } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (initData: string) => {
    console.log('useAuth: Starting authentication process');
    console.log('useAuth: InitData present:', !!initData);
    
    try {
      console.log('useAuth: Sending authentication request to /api/auth/signin');
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
        credentials: 'include', // Important for cookies
      });

      console.log('useAuth: Response status:', response.status);
      const data = await response.json();
      console.log('useAuth: Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      console.log('useAuth: Authentication successful');
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate';
      console.error('useAuth: Authentication error:', errorMessage);
      setError(errorMessage);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    console.log('useAuth: Checking authentication status');
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      console.log('useAuth: Check auth response status:', response.status);
      const data = await response.json();
      console.log('useAuth: Check auth response data:', data);

      setIsAuthenticated(response.ok);
      setError(null);
      return response.ok;
    } catch (err) {
      console.error('useAuth: Check auth error:', err);
      setIsAuthenticated(false);
      setError('Failed to check authentication status');
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    authenticate,
    checkAuth,
    error,
  };
} 