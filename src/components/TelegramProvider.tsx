'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramWebAppUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  platform?: string;
  version?: string;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  ready: () => void;
  expand: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  setViewportHeight?: (height: number) => void;
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  ready: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  user: TelegramWebAppUser | null;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null,
  isAuthenticated: false,
  user: null,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TelegramWebAppUser | null>(null);

  const authenticate = useCallback(async (initData: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        if (webApp?.initDataUnsafe?.user) {
          setUser(webApp.initDataUnsafe.user);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err : new Error('Ошибка аутентификации'));
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [webApp]);

  useEffect(() => {
    try {
      // Wait for Telegram WebApp script to load
      if (typeof window !== 'undefined' && 'Telegram' in window) {
        const telegram = window.Telegram?.WebApp;
        
        if (!telegram) {
          throw new Error('Telegram WebApp is not available');
        }

        // Initialize WebApp
        setWebApp(telegram);
        telegram.ready();
        telegram.expand();

        // Set ready state
        setReady(true);

        // Authenticate if we have initData
        if (telegram.initData) {
          authenticate(telegram.initData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Telegram WebApp'));
      setReady(false);
    }
  }, [authenticate]);

  return (
    <TelegramContext.Provider value={{ webApp, ready, error, isAuthenticated, user }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
} 