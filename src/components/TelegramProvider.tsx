'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface TelegramWebApp {
  ready: () => boolean;
  expand: () => void;
  close: () => void;
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    theme_params?: {
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
    };
  };
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  sendData: (data: unknown) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  openTelegramLink: (url: string) => void;
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  ready: boolean;
  error: string | null;
}

// Extend the Window interface
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const app = (window as any).Telegram?.WebApp;
        if (app) {
          setWebApp(app);
          app.ready();
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