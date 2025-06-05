'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

type WebApp = NonNullable<typeof window.Telegram>['WebApp'];

interface TelegramContextType {
  webApp: WebApp | null;
  ready: boolean;
  error: Error | null;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null,
});

export const useTelegramWebApp = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegramWebApp must be used within TelegramProvider');
  }
  return context;
};

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<TelegramContextType>({
    webApp: null,
    ready: false,
    error: null,
  });

  const handleLoad = () => {
    try {
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        webApp.expand();
        setState({ webApp, ready: true, error: null });
      } else {
        setState(prev => ({
          ...prev,
          error: new Error('Telegram WebApp not found. Please open this app in Telegram.')
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to initialize Telegram WebApp')
      }));
    }
  };

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={handleLoad}
        onError={() => {
          setState(prev => ({
            ...prev,
            error: new Error('Failed to load Telegram WebApp script')
          }));
        }}
      />
      <TelegramContext.Provider value={state}>
        {children}
      </TelegramContext.Provider>
    </>
  );
}; 