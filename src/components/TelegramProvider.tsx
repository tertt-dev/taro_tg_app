'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Инициализация Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      // Установка viewport высоты
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);

      return () => {
        window.removeEventListener('resize', setViewportHeight);
      };
    }
  }, []);

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}; 