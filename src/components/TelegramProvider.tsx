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
    console.log('TelegramProvider: Initializing...');
    
    // Try to initialize from Telegram WebApp
    if (typeof window !== 'undefined') {
      try {
        console.log('Checking for Telegram WebApp...');
        const app = window.Telegram?.WebApp;
        console.log('WebApp object:', app);
        
        if (app) {
          console.log('WebApp found, initializing...');
          // Cast to TelegramWebApp type since we know it's the correct shape
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
          
          // Try to get user data from URL if not available in WebApp
          if (!webAppInstance.initDataUnsafe?.user) {
            try {
              const params = new URLSearchParams(window.location.search);
              const tgWebAppData = params.get('tgWebAppData');
              if (tgWebAppData) {
                console.log('Found tgWebAppData in URL');
                const parsedData = JSON.parse(atob(tgWebAppData));
                console.log('Parsed user data:', parsedData);
                webAppInstance.initDataUnsafe = {
                  ...webAppInstance.initDataUnsafe,
                  user: parsedData
                };
              }
            } catch (error) {
              console.error('Failed to parse URL data:', error);
            }
          }
          
          console.log('WebApp initialization complete');
          console.log('User data:', webAppInstance.initDataUnsafe?.user);
          setReady(true);
          setError(null);
        } else {
          const errorMsg = 'Telegram WebApp is not available';
          console.warn(errorMsg);
          setError(errorMsg);
          
          // If we're not in Telegram, we might want to show a message or redirect
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
    error
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