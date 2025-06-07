'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { WebApp } from '@/types/telegram-webapp';

interface TelegramContextType {
  webApp: WebApp | null;
  ready: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  ready: false,
  error: null,
  isAuthenticated: false,
});

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}

export const useTelegramWebApp = () => useContext(TelegramContext);

const createMockWebApp = (initData: string): WebApp => {
  const urlParams = new URLSearchParams(initData);
  const userStr = urlParams.get('user');
  const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
  const auth_date = urlParams.get('auth_date');
  const query_id = urlParams.get('query_id');
  const hash = urlParams.get('hash');

  console.log('Creating mock WebApp with:', {
    user,
    auth_date,
    query_id,
    hash
  });

  return {
    initData,
    initDataUnsafe: {
      query_id: query_id || '',
      user: user || {
        id: 0,
        first_name: 'Unknown',
        last_name: '',
        username: '',
        language_code: 'en'
      },
      auth_date: auth_date ? parseInt(auth_date) : Math.floor(Date.now() / 1000),
      hash: hash || '',
    },
    platform: 'mock',
    version: '6.9',
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    viewportStableHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isExpanded: true,
    onEvent: () => {},
    offEvent: () => {},
    ready: () => {},
    expand: () => {},
    close: () => {},
    MainButton: {
      text: '',
      color: '#000000',
      textColor: '#ffffff',
      isVisible: false,
      isActive: true,
      isProgressVisible: false,
      show: () => {},
      hide: () => {},
      enable: () => {},
      disable: () => {},
      showProgress: () => {},
      hideProgress: () => {},
      setText: () => {},
      onClick: () => {},
      offClick: () => {},
    },
    BackButton: {
      isVisible: false,
      show: () => {},
      hide: () => {},
      onClick: () => {},
      offClick: () => {},
    },
    openTelegramLink: (url: string) => { window.open(url, '_blank'); },
  };
};

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initWebApp = async () => {
      try {
        if (typeof window !== 'undefined') {
          if (window.Telegram?.WebApp) {
            setWebApp(window.Telegram.WebApp);
            window.Telegram.WebApp.ready();
            setReady(true);
          } else {
            const urlParams = new URLSearchParams(window.location.search);
            const initData = urlParams.get('initData');
            
            if (initData) {
              const mockWebApp = createMockWebApp(initData);
              setWebApp(mockWebApp);
              setReady(true);
            } else {
              setError('WebApp not available and no test initData provided');
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize WebApp:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize WebApp');
      }
    };

    initWebApp();
  }, []);

  useEffect(() => {
    const authenticate = async () => {
      if (!webApp?.initData) return;

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: webApp.initData }),
        });

        if (!response.ok) {
          throw new Error(`Authentication failed: ${response.statusText}`);
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsAuthenticated(false);
      }
    };

    if (ready && webApp) {
      authenticate();
    }
  }, [ready, webApp]);

  const value = {
    webApp,
    ready,
    error: error || null,
    isAuthenticated
  };

  // Return a loading state during SSR or before hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-purple-500 mb-4">Таро Бот</h1>
          <p className="text-lg mb-4">Инициализация приложения</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: Нет</p>
            <p>Готов к работе: Нет</p>
            <p>Аутентифицирован: Нет</p>
          </div>
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