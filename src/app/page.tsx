'use client';

import { useTelegram } from '@/components/TelegramProvider';

export default function Home() {
  const { isAuthenticated, user } = useTelegram();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-500 mb-6">
          Добро пожаловать, {user?.firstName}!
        </h1>
        <p className="text-lg mb-4">
          Выберите расклад, чтобы начать гадание
        </p>
        {/* Здесь будет основной контент приложения */}
      </div>
    </main>
  );
}
