'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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

// Создаем функцию для получения высоты окна
const getWindowHeight = () => {
  if (typeof window === 'undefined') return 800;
  return window.innerHeight;
};

// Мок для тестового режима
const createMockWebApp = (): TelegramWebApp => ({
  ready: () => {},
  expand: () => {},
  close: () => {},
  isExpanded: true,
  viewportHeight: getWindowHeight(),
  viewportStableHeight: getWindowHeight(),
  initDataUnsafe: {
    user: {
      id: 12345,
      first_name: "Test",
      last_name: "User",
      username: "testuser",
      language_code: "ru",
    },
    query_id: "test_query_id",
    auth_date: Math.floor(Date.now() / 1000),
    hash: "test_hash",
  },
  onEvent: () => {},
  offEvent: () => {},
  sendData: () => {},
  MainButton: {
    text: "",
    color: "",
    textColor: "",
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
  platform: "web",
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();
  const isTestMode = pathname?.startsWith('/test');

  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout | null = null;

    const cleanup = () => {
      mounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };

    const initWebApp = () => {
      // Don't initialize if component is unmounted
      if (!mounted) return;

      try {
        // For test mode, use mock data
        if (isTestMode) {
          setWebApp(createMockWebApp());
          setReady(true);
          setError(null);
          return;
        }

        // For production mode, check for Telegram WebApp
        const telegram = window?.Telegram?.WebApp;
        if (telegram && typeof telegram.ready === 'function') {
          telegram.ready();
          setWebApp(telegram);
          setReady(true);
          setError(null);
          if (checkInterval) {
            clearInterval(checkInterval);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Не удалось инициализировать Telegram WebApp'));
          setReady(true);
        }
      }
    };

    // Initial attempt to initialize
    initWebApp();

    // If not in test mode and WebApp is not available, start checking
    if (!isTestMode && !window?.Telegram?.WebApp) {
      // Set timeout for initial availability check
      const initTimeout = setTimeout(() => {
        if (mounted && !window?.Telegram?.WebApp) {
          setError(new Error('Telegram WebApp не доступен. Пожалуйста, откройте приложение через Telegram.'));
          setReady(true);
        }
      }, 3000);

      // Set up interval to check for WebApp
      checkInterval = setInterval(() => {
        if (window?.Telegram?.WebApp) {
          initWebApp();
        }
      }, 1000);

      // Cleanup timeout on unmount
      return () => {
        clearTimeout(initTimeout);
        cleanup();
      };
    }

    return cleanup;
  }, [isTestMode]); // Only depend on isTestMode

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

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}; 