'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  ready: () => void;
  close: () => void;
  expand: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    enable: () => void;
    disable: () => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  openTelegramLink: (url: string) => void;
}

interface TelegramContext {
  webApp: TelegramWebApp | null;
  ready: boolean;
}

const TelegramContext = createContext<TelegramContext>({
  webApp: null,
  ready: false,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const webApp = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      setReady(true);
    }
  }, [webApp]);

  return (
    <TelegramContext.Provider value={{ webApp, ready }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramWebApp() {
  return useContext(TelegramContext);
} 