'use client';

import './globals.css';
import { TelegramProvider } from '@/components/TelegramProvider';
import RootLayoutClient from '@/components/RootLayoutClient';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full">
      <body className="h-full">
        <TelegramProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </TelegramProvider>
      </body>
    </html>
  );
}
