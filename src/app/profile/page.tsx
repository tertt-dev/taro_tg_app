'use client';

import { useTelegram } from '@/components/TelegramProvider';

export default function ProfilePage() {
  const { isAuthenticated, user } = useTelegram();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-500 mb-8">Профиль</h1>
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Имя</h2>
              <p>{user?.first_name} {user?.last_name}</p>
            </div>
            {user?.username && (
              <div>
                <h2 className="text-lg font-semibold">Имя пользователя</h2>
                <p>@{user.username}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 