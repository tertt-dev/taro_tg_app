'use client';

import { useEffect, useRef } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { webApp, ready, error } = useTelegram();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!webApp || !containerRef.current) {
      return;
    }

    function updateHeight() {
      if (containerRef.current && webApp) {
        const height = containerRef.current.scrollHeight;
        webApp.viewportHeight = height;
      }
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(containerRef.current);
    updateHeight();

    if (webApp.onEvent) {
      webApp.onEvent('viewportChanged', updateHeight);
    }

    return () => {
      if (webApp.offEvent) {
        webApp.offEvent('viewportChanged', updateHeight);
      }
      observer.disconnect();
    };
  }, [webApp]);

  if (error) {
    return <ErrorScreen message={error.message} />;
  }

  if (!ready) {
    return <LoadingScreen />;
  }

  return <div ref={containerRef}>{children}</div>;
} 