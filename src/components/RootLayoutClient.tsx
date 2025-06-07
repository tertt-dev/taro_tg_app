'use client';

import { useEffect, useRef } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { webApp, ready, error } = useTelegram();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!webApp || !containerRef.current) {
      return;
    }

    function updateHeight() {
      if (containerRef.current && webApp && webApp.setViewportHeight) {
        const height = containerRef.current.scrollHeight;
        webApp.setViewportHeight(height);
      }
    }

    // Initial height update
    updateHeight();

    // Set up resize observer
    const observer = new ResizeObserver(updateHeight);
    observer.observe(containerRef.current);

    // Set up viewport change handler
    webApp.onEvent('viewportChanged', updateHeight);

    return () => {
      webApp.offEvent('viewportChanged', updateHeight);
      observer.disconnect();
    };
  }, [webApp]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
          <p className="text-lg mb-4">{error.message}</p>
          <div className="text-sm text-gray-400">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ready || !webApp) {
    return <LoadingScreen />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
} 