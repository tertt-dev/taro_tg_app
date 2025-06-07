'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user: TelegramWebAppUser;
  };
  platform: string;
  version: string;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
}

function isTelegramWebAppUser(obj: unknown): obj is TelegramWebAppUser {
  if (!obj || typeof obj !== 'object') return false;
  const candidate = obj as Record<string, unknown>;
  return (
    'id' in candidate &&
    'first_name' in candidate &&
    typeof candidate.id === 'number' &&
    typeof candidate.first_name === 'string'
  );
}

function isTelegramWebApp(obj: unknown): obj is TelegramWebApp {
  if (!obj || typeof obj !== 'object') return false;
  const candidate = obj as Record<string, unknown>;
  return (
    'initData' in candidate &&
    'initDataUnsafe' in candidate &&
    'platform' in candidate &&
    'version' in candidate &&
    'viewportHeight' in candidate &&
    'viewportStableHeight' in candidate &&
    'isExpanded' in candidate &&
    'onEvent' in candidate &&
    'offEvent' in candidate &&
    typeof candidate.initData === 'string' &&
    typeof candidate.initDataUnsafe === 'object' &&
    typeof candidate.platform === 'string' &&
    typeof candidate.version === 'string' &&
    typeof candidate.viewportHeight === 'number' &&
    typeof candidate.viewportStableHeight === 'number' &&
    typeof candidate.isExpanded === 'boolean' &&
    typeof candidate.onEvent === 'function' &&
    typeof candidate.offEvent === 'function' &&
    candidate.initDataUnsafe !== null &&
    'user' in (candidate.initDataUnsafe as Record<string, unknown>) &&
    isTelegramWebAppUser((candidate.initDataUnsafe as Record<string, unknown>).user)
  );
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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TelegramWebAppUser | null>(null);

  async function authenticate(initData: string) {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const userCookie = getCookie('user');
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err : new Error('Ошибка аутентификации'));
      setIsAuthenticated(false);
      setUser(null);
    }
  }

  useEffect(() => {
    try {
      const telegram = window.Telegram?.WebApp;
      if (!telegram) {
        throw new Error('Telegram WebApp is not available');
      }

      if (!isTelegramWebApp(telegram)) {
        throw new Error('Invalid Telegram WebApp object');
      }

      setWebApp(telegram);
      setReady(true);

      // Check for existing authentication
      const userCookie = getCookie('user');
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // If no valid cookie found, authenticate with the server
        authenticate(telegram.initData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Telegram WebApp'));
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, ready, error, isAuthenticated, user }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
} 