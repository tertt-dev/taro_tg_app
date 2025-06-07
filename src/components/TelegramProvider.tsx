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

  // Initialize WebApp
  useEffect(() => {
    const initWebApp = () => {
      try {
        // Check if we're in development mode and have initData in URL
        const urlParams = new URLSearchParams(window.location.search);
        const initData = urlParams.get('initData');
        
        if (window.Telegram?.WebApp) {
          console.log('Found Telegram WebApp:', window.Telegram.WebApp);
          setWebApp(window.Telegram.WebApp);
          window.Telegram.WebApp.ready();
          setReady(true);
        } else if (initData) {
          console.log('Using mock WebApp with initData:', initData);
          const mockWebApp = createMockWebApp(initData);
          setWebApp(mockWebApp);
          setReady(true);
        } else if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: creating mock WebApp');
          const mockInitData = `user={"id":12345,"first_name":"Test","username":"test_user"}&auth_date=${Math.floor(Date.now() / 1000)}&hash=test_hash`;
          const mockWebApp = createMockWebApp(mockInitData);
          setWebApp(mockWebApp);
          setReady(true);
        } else {
          setError('WebApp не доступен. Пожалуйста, откройте приложение через Telegram.');
        }
      } catch (err) {
        console.error('Failed to initialize WebApp:', err);
        setError(err instanceof Error ? err.message : 'Ошибка инициализации WebApp');
      }
    };

    // Wait for the script to load
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        initWebApp();
      } else {
        window.addEventListener('load', initWebApp);
        return () => window.removeEventListener('load', initWebApp);
      }
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
        // Get initData from URL if available
        const url = new URL(window.location.href);
        const hash = url.hash;
        let initData = webApp.initData;

        // If we're in development and there's no initData, use mock data
        if (process.env.NODE_ENV === 'development' && !initData && hash) {
          const hashParams = new URLSearchParams(hash.slice(1));
          const tgWebAppData = hashParams.get('tgWebAppData');
          if (tgWebAppData) {
            initData = tgWebAppData;
          }
        }

        console.log('Authenticating with initData:', initData);
        
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка аутентификации');
        }

        setIsAuthenticated(true);
        setError(null);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Ошибка аутентификации');
        setIsAuthenticated(false);
      }
    };

    if (ready && webApp) {
      authenticate();
    }
  }, [ready, webApp]);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

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
          <p className="text-lg mb-4">Загрузка приложения...</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: Нет</p>
            <p>Готов к работе: Нет</p>
            <p>Аутентифицирован: Нет</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
          <p className="text-lg mb-4">{error}</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
            <p>Аутентифицирован: {isAuthenticated ? 'Да' : 'Нет'}</p>
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