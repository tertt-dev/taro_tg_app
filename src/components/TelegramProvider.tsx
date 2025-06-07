'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { WebApp } from '@/types/telegram-webapp';

interface TelegramContextType {
  webApp: WebApp | null;
  ready: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null,
  isAuthenticated: false,
});

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, authenticate } = useAuth();

  const initializeWebApp = useCallback(async () => {
    console.log('TelegramProvider: Initializing...');
    
    if (typeof window !== 'undefined') {
      try {
        // Try to get initData from URL first (for development)
        const urlParams = new URLSearchParams(window.location.search);
        const initDataFromUrl = urlParams.get('initData');
        
        console.log('TelegramProvider: Checking for initData in URL:', !!initDataFromUrl);

        if (initDataFromUrl) {
          console.log('TelegramProvider: Using initData from URL');
          const success = await authenticate(initDataFromUrl);
          if (success) {
            console.log('TelegramProvider: Authentication successful with URL initData');
            setReady(true);
            setError(null);
            return;
          }
        }

        // If no URL initData or authentication failed, try Telegram WebApp
        console.log('Checking for Telegram WebApp...');
        const app = window.Telegram?.WebApp;
        console.log('WebApp object:', app);
        
        if (app && app.initData) {
          console.log('WebApp found with initData, initializing...');
          setWebApp(app);
          
          app.ready?.();
          console.log('Called WebApp.ready()');
          
          app.expand?.();
          console.log('Called WebApp.expand()');
          
          // Authenticate using initData
          console.log('Attempting authentication with WebApp initData...');
          const success = await authenticate(app.initData);
          console.log('Authentication result:', success);
          
          if (success) {
            console.log('Authentication successful');
            setReady(true);
            setError(null);
          } else {
            console.error('Authentication failed');
            setError('Authentication failed');
          }
        } else {
          const errorMsg = app ? 'No initData available from WebApp' : 'Telegram WebApp is not available';
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
  }, [authenticate]);

  useEffect(() => {
    initializeWebApp();
  }, [initializeWebApp]);

  const value = {
    webApp,
    ready,
    error: error || null,
    isAuthenticated
  };

  console.log('TelegramProvider state:', value);

  // Show a special message when accessed directly via browser
  if (!webApp && typeof window !== 'undefined' && !window.Telegram?.WebApp) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-purple-500 mb-4">Таро Бот</h1>
          <p className="text-lg mb-4">
            Это приложение доступно только через Telegram
          </p>
          <p className="text-muted-foreground mb-6">
            Для тестирования добавьте параметр initData в URL
          </p>
          <div className="text-sm text-gray-400 mt-4">
            <p>Текущий URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
            <p>WebApp доступен: {typeof window !== 'undefined' && !!window.Telegram?.WebApp ? 'Да' : 'Нет'}</p>
            <p>Ошибка: {error || 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramWebApp() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegramWebApp must be used within a TelegramProvider');
  }
  return context;
} 