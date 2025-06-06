'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Inter } from "next/font/google";
import Head from 'next/head';
import { TelegramProvider, useTelegramWebApp } from "@/components/TelegramProvider";
import type { TelegramWebApp } from '@/types/telegram';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black flex items-center justify-center">
    <div className="text-white text-center">
      <div className="mb-4">
        <svg
          className="animate-spin h-10 w-10 text-purple-500 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p className="text-lg">Загрузка...</p>
    </div>
  </div>
);

const ErrorScreen = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-black flex items-center justify-center">
    <div className="text-white text-center p-4">
      <div className="mb-4 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { webApp, ready, error } = useTelegramWebApp();
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    if (webApp) {
      const app = webApp as Required<Pick<TelegramWebApp, 'viewportHeight' | 'onEvent' | 'offEvent'>>;
      const updateHeight = () => {
        setViewportHeight(`${app.viewportHeight}px`);
      };

      updateHeight();
      app.onEvent('viewportChanged', updateHeight);

      return () => {
        app.offEvent('viewportChanged', updateHeight);
      };
    }
  }, [webApp]);

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: viewportHeight }}
      className="bg-black text-white"
    >
      {children}
    </motion.div>
  );
};

export const RootLayoutClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="ru">
        <Head>
          <link rel="preconnect" href="https://api.dicebear.com" />
        </Head>
        <body className={inter.className}>
          <LoadingScreen />
        </body>
      </html>
    );
  }

  return (
    <TelegramProvider>
      <LayoutContent>{children}</LayoutContent>
    </TelegramProvider>
  );
}; 