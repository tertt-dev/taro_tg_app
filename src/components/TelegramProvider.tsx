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
        console.log('Initializing Telegram WebApp...');
        const app = window.Telegram?.WebApp;
        console.log('WebApp object:', app);
        
        if (app) {
          // Ensure we have the initData
          if (!app.initDataUnsafe || !app.initDataUnsafe.user) {
            console.warn('WebApp initialized but no user data available:', app.initDataUnsafe);
            // Try to parse hash parameters for testing
            try {
              const hashParams = new URLSearchParams(window.location.hash.slice(1));
              const tgWebAppData = hashParams.get('tgWebAppData');
              if (tgWebAppData) {
                console.log('Found tgWebAppData in URL:', tgWebAppData);
                const parsedData = JSON.parse(decodeURIComponent(tgWebAppData));
                if (parsedData.user) {
                  app.initDataUnsafe = {
                    ...app.initDataUnsafe,
                    user: parsedData.user
                  };
                  console.log('Successfully parsed user data from URL');
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse tgWebAppData:', parseError);
            }
          }

          setWebApp(app as unknown as TelegramWebApp);
          if (typeof app.ready === 'function') {
            console.log('Calling WebApp.ready()');
            app.ready();
          }
          console.log('WebApp initialized successfully, initData:', app.initDataUnsafe);
          setReady(true);
          setError(null);
        } else {
          console.warn('Telegram WebApp is not available');
          setError('Telegram WebApp is not available');
        }
      } catch (err) {
        console.error('Failed to initialize Telegram WebApp:', err);
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