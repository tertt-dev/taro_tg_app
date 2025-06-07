'use client';

import { useEffect, useRef } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { ClientWrapper } from '@/components/ClientWrapper';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { webApp, ready, error } = useTelegram();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!webApp || !containerRef.current) {
      return;
    }

    // Expand the WebApp viewport
    if (webApp.expand) {
      webApp.expand();
    }

    // Set up viewport change handler
    if (webApp.onEvent) {
      webApp.onEvent('viewportChanged', () => {
        if (webApp.isExpanded) {
          // Handle expanded state if needed
        }
      });
    }

    return () => {
      if (webApp.offEvent) {
        webApp.offEvent('viewportChanged', () => {});
      }
    };
  }, [webApp]);

  // Show loading screen while initializing
  if (!ready) {
    return <LoadingScreen />;
  }

  // Show error screen if there's an error
  if (error) {
    return <ErrorScreen message={error.message} />;
  }

  // Show main content when ready and no errors
  return (
    <ClientWrapper>
      <div ref={containerRef} className="min-h-screen text-white">
        {children}
      </div>
    </ClientWrapper>
  );
} 