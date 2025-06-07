'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { TelegramWebApp, TelegramWebAppUser } from '@/types/telegram';

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

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Wait for Telegram WebApp script to load
      const telegram = window?.Telegram?.WebApp;
      if (telegram && typeof telegram.ready === 'function') {
        setWebApp(telegram);
        telegram.ready();
        setReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Telegram WebApp'));
    }
  }, []);

  const isAuthenticated = Boolean(webApp?.initDataUnsafe?.user);
  const user = webApp?.initDataUnsafe?.user || null;

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

export function useTelegram() {
  return useContext(TelegramContext);
} 