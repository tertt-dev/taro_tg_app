import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { TelegramProvider } from '@/components/TelegramProvider';
import AuthStatus from '@/components/AuthStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Таро Бот',
  description: 'Telegram Mini App для гадания на картах Таро',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <TelegramProvider>
          <AuthStatus />
          {children}
        </TelegramProvider>
      </body>
    </html>
  );
}
