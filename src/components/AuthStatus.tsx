'use client';

import { useTelegram } from './TelegramProvider';

export default function AuthStatus() {
  const { webApp, ready, error } = useTelegram();

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
          <p className="text-lg mb-4">{error.message}</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
          <p className="text-lg">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return null;
} 