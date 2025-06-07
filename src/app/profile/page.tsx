'use client';

import { useTelegram } from '@/components/TelegramProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useTelegram();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen text-white font-cormorant">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-center mb-8">
          Профиль
        </h2>

        <div className="max-w-xl mx-auto">
          <div className="relative flex flex-col p-6 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden z-20">
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            </div>
            <div className="relative space-y-4 z-10">
              <div>
                <h3 className="text-lg text-muted-foreground font-cormorant">Имя</h3>
                <p className="text-xl font-cormorant">{user.first_name} {user.last_name}</p>
              </div>
              
              <div>
                <h3 className="text-lg text-muted-foreground font-cormorant">ID пользователя</h3>
                <p className="text-xl font-cormorant">{user.id}</p>
              </div>

              <div>
                <h3 className="text-lg text-muted-foreground font-cormorant">Язык</h3>
                <p className="text-xl font-cormorant">{user.language_code}</p>
              </div>

              <div>
                <h3 className="text-lg text-muted-foreground font-cormorant">Статистика</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="relative flex flex-col p-4 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden z-20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-2xl font-medium font-cormorant">12</p>
                      <p className="text-sm text-muted-foreground font-cormorant">Всего раскладов</p>
                    </div>
                  </div>
                  <div className="relative flex flex-col p-4 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden z-20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-2xl font-medium font-cormorant">3</p>
                      <p className="text-sm text-muted-foreground font-cormorant">За сегодня</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 