'use client';

import { useTelegramWebApp } from '@/components/TelegramProvider';
import { useAuth } from '@/hooks/useAuth';
import { SpreadSelector, SpreadType } from '@/components/SpreadSelector';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { webApp, ready, error } = useTelegramWebApp();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Show loading state
  if (!ready && !error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-purple-500 mb-4">Таро Бот</h1>
          <p className="text-lg mb-4">Инициализация приложения</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
            <p>Аутентифицирован: {isAuthenticated ? 'Да' : 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
          <p className="text-lg mb-4">{error}</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
            <p>Аутентифицирован: {isAuthenticated ? 'Да' : 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authenticated content
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Таро Бот</h1>
          <SpreadSelector onSelect={(spread: SpreadType) => router.push(`/prediction/${spread.id}`)} />
        </div>
      </div>
    );
  }

  // Show authentication prompt
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-purple-500 mb-4">Таро Бот</h1>
        <p className="text-lg mb-4">
          Для использования приложения необходима авторизация через Telegram
        </p>
        <div className="text-sm text-gray-400 mt-4">
          <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
          <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
          <p>Аутентифицирован: {isAuthenticated ? 'Да' : 'Нет'}</p>
        </div>
      </div>
    </div>
  );
}
