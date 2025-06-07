'use client';

import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { useTelegram } from '@/components/TelegramProvider';

export default function ProfilePage() {
  const { user } = useTelegram();

  return (
    <div className="min-h-screen bg-black text-white font-cormorant">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h2 className="text-2xl font-medium text-center mb-8">
          Профиль
        </h2>

        <motion.div
          className="bg-white/5 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg text-white/60">Имя</h3>
              <p className="text-xl">{user?.first_name || 'Test'} {user?.last_name || 'User'}</p>
            </div>
            
            <div>
              <h3 className="text-lg text-white/60">ID пользователя</h3>
              <p className="text-xl">{user?.id || '12345'}</p>
            </div>

            <div>
              <h3 className="text-lg text-white/60">Язык</h3>
              <p className="text-xl">{user?.language_code || 'ru'}</p>
            </div>

            <div>
              <h3 className="text-lg text-white/60">Статистика</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-2xl font-medium">12</p>
                  <p className="text-sm text-white/60">Всего раскладов</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-2xl font-medium">3</p>
                  <p className="text-sm text-white/60">За сегодня</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 