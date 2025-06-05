import { useEffect, useState } from 'react';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        setWebApp(tg);

        return () => {
          if (tg.MainButton) {
            tg.MainButton.hide();
          }
        };
      }
    }
  }, []);

  return webApp;
}; 