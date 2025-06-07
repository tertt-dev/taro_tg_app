import { useEffect, useState } from 'react';
import type { TelegramWebApp } from '@/types/telegram';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const telegram = window?.Telegram?.WebApp;
      if (telegram && typeof telegram.ready === 'function') {
        setWebApp(telegram);
        telegram.ready();
        setReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Telegram WebApp'));
    }
  }, []);

  return { webApp, ready, error };
}; 