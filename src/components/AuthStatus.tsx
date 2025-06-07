'use client';

import { useTelegram } from './TelegramProvider';

export function AuthStatus() {
  const { webApp, ready, error, isAuthenticated, user } = useTelegram();

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

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-purple-500 mb-4">Таро Бот</h1>
          <p className="text-lg mb-4">Загрузка приложения...</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: Нет</p>
            <p>Аутентифицирован: {isAuthenticated ? 'Да' : 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-purple-500 mb-4">Таро Бот</h1>
          <p className="text-lg mb-4">Для использования приложения необходима авторизация через Telegram</p>
          <div className="text-sm text-gray-400 mt-4">
            <p>WebApp доступен: {webApp ? 'Да' : 'Нет'}</p>
            <p>Готов к работе: {ready ? 'Да' : 'Нет'}</p>
            <p>Аутентифицирован: Нет</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 