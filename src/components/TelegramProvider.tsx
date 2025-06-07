'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

interface TelegramContextType {
  webApp: WebApp | null;
  ready: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null,
  isAuthenticated: false,
  user: null,
});

export const useTelegram = () => useContext(TelegramContext);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const app = window.Telegram.WebApp;
      setWebApp(app);
      setReady(true);
      console.log('Found Telegram WebApp:', app);
    } else {
      setError('WebApp не доступен');
    }
  }, []);

  // Handle authentication
  useEffect(() => {
    const authenticate = async () => {
      if (!webApp?.initData) {
        setError('Ошибка: отсутствуют данные инициализации');
        return;
      }

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: webApp.initData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка аутентификации');
        }

        setIsAuthenticated(true);
        setUser(data.user);
        setError(null);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Ошибка аутентификации');
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    if (ready && webApp) {
      authenticate();
    }
  }, [ready, webApp]);

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        ready,
        error,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
} 