'use client';

import { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import Head from 'next/head';
import { GlobalStyles } from "@/components/GlobalStyles";
import { TelegramProvider, useTelegramWebApp } from "@/components/TelegramProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Загрузка приложения...</p>
    </div>
  </div>
);

const ErrorScreen = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <div className="text-center max-w-md">
      <h1 className="text-xl font-bold mb-2">Ошибка инициализации</h1>
      <p className="text-gray-400 mb-4">{error.message}</p>
      <p className="text-sm text-gray-500">
        Пожалуйста, убедитесь, что вы открыли приложение через Telegram.
      </p>
    </div>
  </div>
);

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { webApp, ready, error } = useTelegramWebApp();
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [stableViewportHeight, setStableViewportHeight] = useState('100vh');

  useEffect(() => {
    if (!ready || !webApp) return;

    const updateViewport = () => {
      setViewportHeight(`${webApp.viewportHeight}px`);
      setStableViewportHeight(`${webApp.viewportStableHeight}px`);
    };

    updateViewport();
    webApp.onEvent('viewportChanged', updateViewport);

    return () => {
      webApp.offEvent('viewportChanged', updateViewport);
    };
  }, [ready, webApp]);

  const styles = {
    height: stableViewportHeight,
    minHeight: viewportHeight,
    overflow: 'hidden'
  };

  return (
    <html lang="ru">
      <Head>
        <link rel="preconnect" href="https://api.dicebear.com" />
      </Head>
      <body 
        className={`${inter.className} antialiased`}
        style={styles}
      >
        <GlobalStyles />
        <div style={styles}>
          {error ? (
            <ErrorScreen error={error} />
          ) : !ready ? (
            <LoadingScreen />
          ) : (
            children
          )}
        </div>
      </body>
    </html>
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