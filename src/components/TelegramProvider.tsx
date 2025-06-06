'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { TelegramWebApp } from '@/types/telegram';
import { useAuth } from '@/hooks/useAuth';

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  ready: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null,
  isAuthenticated: false
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, authenticate, isLoading, error: authError } = useAuth();

  useEffect(() => {
    console.log('TelegramProvider: Initializing...');
    
    if (typeof window !== 'undefined') {
      try {
        console.log('Checking for Telegram WebApp...');
        const app = window.Telegram?.WebApp;
        console.log('WebApp object:', app);
        
        if (app) {
          console.log('WebApp found, initializing...');
          const webAppInstance = app as unknown as TelegramWebApp;
          setWebApp(webAppInstance);
          
          if (typeof webAppInstance.ready === 'function') {
            console.log('Calling WebApp.ready()');
            webAppInstance.ready();
          }
          
          if (typeof webAppInstance.expand === 'function') {
            console.log('Expanding WebApp view');
            webAppInstance.expand();
          }
          
          // Authenticate using initData
          authenticate(webAppInstance.initData || '')
            .then(success => {
              if (success) {
                console.log('Authentication successful');
                setReady(true);
                setError(null);
              } else {
                setError('Authentication failed');
              }
            })
            .catch(err => {
              console.error('Authentication error:', err);
              setError('Authentication failed');
            });
          
        } else {
          const errorMsg = 'Telegram WebApp is not available';
          console.warn(errorMsg);
          setError(errorMsg);
          
          if (!window.Telegram) {
            console.log('Not running in Telegram WebApp environment');
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize Telegram WebApp';
        console.error('Initialization error:', errorMsg);
        setError(errorMsg);
      }
    }
  }, []);

  const value = {
    webApp,
    ready,
    error: error || authError,
    isAuthenticated
  };

  console.log('TelegramProvider state:', value);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramWebApp() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegramWebApp must be used within a TelegramProvider');
  }
  return context;
} 