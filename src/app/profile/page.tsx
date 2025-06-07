'use client';

import { useTelegram } from '@/components/TelegramProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useTelegram();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-500 mb-6">Профиль</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold mb-2">{user.first_name} {user.last_name}</h2>
              {user.username && (
                <p className="text-gray-400 mb-4">@{user.username}</p>
              )}
              {user.language_code && (
                <p className="text-sm text-gray-500">Язык: {user.language_code.toUpperCase()}</p>
              )}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Статистика</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300">Выполнено раскладов</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300">Любимая колода</h3>
                <p className="text-xl">Не выбрана</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 