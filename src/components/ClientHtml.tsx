'use client';

import { useEffect, useState } from 'react';

export const ClientHtml = ({ 
  children,
  lang,
  className 
}: { 
  children: React.ReactNode;
  lang: string;
  className?: string;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // На сервере или до монтирования возвращаем базовую разметку
  if (!mounted) {
    return (
      <html lang={lang} className={className}>
        {children}
      </html>
    );
  }

  // После монтирования на клиенте позволяем Telegram Web App установить свои стили
  return (
    <html 
      lang={lang}
      className={className}
      style={{
        '--tg-viewport-height': '100vh',
        '--tg-viewport-stable-height': '100vh'
      } as React.CSSProperties}
    >
      {children}
    </html>
  );
}; 