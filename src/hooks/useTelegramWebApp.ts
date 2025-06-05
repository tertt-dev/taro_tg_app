import { useEffect, useState } from 'react';
import type { TelegramWebApp } from '@/types/telegram-webapp';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setWebApp(tg);

      return () => {
        if (tg.MainButton) {
          tg.MainButton.hide();
        }
      };
    }
  }, []);

  return webApp;
}; 