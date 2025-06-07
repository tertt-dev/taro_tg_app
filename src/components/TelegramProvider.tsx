'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  auth_date: string;
  hash: string;
}

interface MainButton {
  text: string;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive: boolean) => void;
  hideProgress: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  setText: (text: string) => void;
}

interface BackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
}

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
    Telegram: {
      WebApp: TelegramWebApp;
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
    auth_date: "1234567890",
    hash: "test_hash",
  } as TelegramWebAppInitData,
  initData: "",
  platform: "web",
  colorScheme: "dark",
  themeParams: {},
  isClosingConfirmationEnabled: false,
  headerColor: "#000000",
  backgroundColor: "#000000",
  setHeaderColor: () => {},
  setBackgroundColor: () => {},
  enableClosingConfirmation: () => {},
  onEvent: () => {},
  offEvent: () => {},
  sendData: () => {},
  setViewportHeight: () => {},
  MainButton: {
    text: "",
    show: () => {},
    hide: () => {},
    enable: () => {},
    disable: () => {},
    showProgress: () => {},
    hideProgress: () => {},
    onClick: () => {},
    offClick: () => {},
    setText: () => {},
  } as MainButton,
  BackButton: {
    isVisible: false,
    show: () => {},
    hide: () => {},
    onClick: () => {},
    offClick: () => {},
  } as BackButton,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();
  const isTestMode = pathname?.startsWith('/debug');

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
      if (!mounted) return;

      try {
        // For test mode, use mock data
        if (isTestMode) {
          const mockApp = createMockWebApp();
          setWebApp(mockApp);
          setReady(true);
          setError(null);
          return;
        }

        // Check if we're running inside Telegram WebApp
        const telegram = window?.Telegram?.WebApp;
        if (!telegram) {
          setError(new Error('Telegram WebApp не доступен. Пожалуйста, откройте приложение через Telegram.'));
          setReady(true);
          return;
        }

        // Initialize WebApp
        telegram.ready();
        telegram.expand();
        
        // Set theme colors
        telegram.setHeaderColor('#000000');
        telegram.setBackgroundColor('#000000');
        
        setWebApp(telegram);
        setReady(true);
        setError(null);
        
        if (checkInterval) {
          clearInterval(checkInterval);
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
      checkInterval = setInterval(() => {
        if (window?.Telegram?.WebApp) {
          initWebApp();
        }
      }, 1000);

      // Set timeout for initial availability check
      setTimeout(() => {
        if (mounted && !window?.Telegram?.WebApp) {
          setError(new Error('Telegram WebApp не доступен. Пожалуйста, откройте приложение через Telegram.'));
          setReady(true);
        }
      }, 2000);
    }

    return cleanup;
  }, [isTestMode]);

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