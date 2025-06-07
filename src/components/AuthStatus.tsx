'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import LoadingScreen from '@/components/LoadingScreen';

export function AuthStatus({ children }: { children: React.ReactNode }) {
  const { ready, user } = useTelegram();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.push('/');
    }
  }, [ready, user, router]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p>Пожалуйста, откройте приложение через Telegram.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {children}
    </div>
  );
} 