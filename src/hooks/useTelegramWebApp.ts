import { useEffect, useState } from 'react';
import type { WebApp } from '@/types/telegram-webapp';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const app = window.Telegram?.WebApp;
        if (app) {
          setWebApp(app);
          app.ready?.();
          app.expand?.();
          setReady(true);
        } else {
          setError('Telegram WebApp is not available');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize Telegram WebApp';
        setError(errorMsg);
        }
    }
  }, []);

  return { webApp, ready, error };
}; 