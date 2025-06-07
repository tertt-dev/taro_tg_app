'use client';

import { Header } from '@/components/Header';
import { useTelegram } from '@/components/TelegramProvider';

export default function ProfilePage() {
  const { user } = useTelegram();

  return (
    <div className="min-h-screen text-white font-cormorant">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-center mb-8">
          Профиль
        </h2>

        <div className="max-w-xl mx-auto">
          <div className="relative rounded-xl p-6 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-zinc-900"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
            </div>
            <div className="relative space-y-4">
              <div>
                <h3 className="text-lg text-zinc-400">Имя</h3>
                <p className="text-xl">{user?.first_name} {user?.last_name}</p>
              </div>
              
              <div>
                <h3 className="text-lg text-zinc-400">ID пользователя</h3>
                <p className="text-xl">{user?.id}</p>
              </div>

              <div>
                <h3 className="text-lg text-zinc-400">Язык</h3>
                <p className="text-xl">{user?.language_code}</p>
              </div>

              <div>
                <h3 className="text-lg text-zinc-400">Статистика</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="relative rounded-lg p-4 overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-zinc-900"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
                    </div>
                    <div className="relative">
                      <p className="text-2xl font-medium">12</p>
                      <p className="text-sm text-zinc-400">Всего раскладов</p>
                    </div>
                  </div>
                  <div className="relative rounded-lg p-4 overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-zinc-900"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
                    </div>
                    <div className="relative">
                      <p className="text-2xl font-medium">3</p>
                      <p className="text-sm text-zinc-400">За сегодня</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 