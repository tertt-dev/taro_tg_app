'use client';

import './globals.css';
import Script from 'next/script';
import { TelegramProvider } from '@/components/TelegramProvider';
import RootLayoutClient from '@/components/RootLayoutClient';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="h-full">
        <TelegramProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </TelegramProvider>
      </body>
    </html>
  );
}
