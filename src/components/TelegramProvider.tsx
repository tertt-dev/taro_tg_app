'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const { isAuthenticated, authenticate, error: authError } = useAuth();

  const initializeWebApp = useCallback(async () => {
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
          
          // Get initData from WebApp
          const initData = webAppInstance.initData;
          console.log('InitData:', initData);
          
          if (!initData) {
            console.error('No initData available');
            setError('No authentication data available');
            return;
          }
          
          // Authenticate using initData
          console.log('Attempting authentication...');
          const success = await authenticate(initData);
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
  }, [authenticate]);

  useEffect(() => {
    initializeWebApp();
  }, [initializeWebApp]);

  const value = {
    webApp,
    ready,
    error: error || authError,
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
            Пожалуйста, откройте бота в Telegram и используйте кнопку для запуска приложения
          </p>
          <a
            href="https://t.me/your_bot_username"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Открыть бота в Telegram
          </a>
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
  if (context === undefined) {
    throw new Error('useTelegramWebApp must be used within a TelegramProvider');
  }
  return context;
} 