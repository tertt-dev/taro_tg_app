'use client';

import { useTelegram } from '@/components/TelegramProvider';

export default function HistoryPage() {
  const { isAuthenticated } = useTelegram();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">История предсказаний</h1>
        {/* Здесь будет контент страницы истории */}
      </div>
    </div>
  );
} 