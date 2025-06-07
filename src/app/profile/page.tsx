'use client';

import { useTelegram } from '@/components/TelegramProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const { isAuthenticated, user } = useTelegram();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-500 mb-8">Профиль</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-6">
            {user?.photo_url && (
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={user.photo_url}
                    alt={user.first_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-grow space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-purple-400">Имя</h2>
                <p className="text-xl">{user?.first_name} {user?.last_name}</p>
              </div>
              {user?.username && (
                <div>
                  <h2 className="text-lg font-semibold text-purple-400">Имя пользователя</h2>
                  <p className="text-xl">@{user.username}</p>
                </div>
              )}
              {user?.language_code && (
                <div>
                  <h2 className="text-lg font-semibold text-purple-400">Язык</h2>
                  <p className="text-xl">{user.language_code.toUpperCase()}</p>
                </div>
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
    </div>
  );
} 