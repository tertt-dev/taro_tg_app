'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { TelegramWebApp } from '@/types/telegram';

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  ready: boolean;
  error: string | null;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const app = window.Telegram?.WebApp;
        if (app) {
          setWebApp(app as unknown as TelegramWebApp);
          if (typeof app.ready === 'function') {
            app.ready();
          }
          setReady(true);
          setError(null);
        } else {
          setError('Telegram WebApp is not available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Telegram WebApp');
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, ready, error }}>
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