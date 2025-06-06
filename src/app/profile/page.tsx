'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, History } from 'lucide-react';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import Image from 'next/image';
import { db } from '@/utils/db';

interface Theme {
  id: 'light' | 'dark';
  name: string;
  icon: typeof Sun | typeof Moon;
}

const themes: Theme[] = [
  { id: 'light', name: 'Светлая', icon: Sun },
  { id: 'dark', name: 'Тёмная', icon: Moon },
];

export default function ProfilePage() {
  const { webApp, ready, error } = useTelegramWebApp();
  const [theme, setTheme] = useState<Theme['id']>('dark');
  const [predictionsCount, setPredictionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Handle BackButton in Telegram WebApp
  useEffect(() => {
    const backButton = webApp?.BackButton;
    if (backButton) {
      backButton.show();
      const handleBack = () => window.history.back();
      backButton.onClick(handleBack);

      return () => {
        backButton.hide();
        backButton.offClick(handleBack);
      };
    }
  }, [webApp]);

  // Initialize user data
  useEffect(() => {
    console.log('Profile page: checking user data...');
    const user = webApp?.initDataUnsafe?.user;
    console.log('Profile page: user data:', user);
    if (user?.id) {
      console.log('Profile page: creating/updating user in database...');
      // Create or update user in database
      db.createOrUpdateUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
      });
      // Get prediction count
      const count = db.getPredictionCount(user.id);
      console.log('Profile page: prediction count:', count);
      setPredictionsCount(count);
    }
    setIsLoading(false);
  }, [webApp?.initDataUnsafe?.user]);

  const handleThemeChange = (newTheme: Theme['id']) => {
    setTheme(newTheme);
    // Here you can implement actual theme change logic
  };

  const user = webApp?.initDataUnsafe?.user;

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-lg text-red-500 mb-4">Ошибка загрузки данных</p>
          <p className="text-muted-foreground">Пожалуйста, попробуйте перезапустить приложение</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-lg">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-lg text-yellow-500 mb-4">Данные пользователя недоступны</p>
          <p className="text-muted-foreground">Пожалуйста, убедитесь что вы открыли приложение через Telegram</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Профиль</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <Image
                  src={user.photo_url || '/placeholder-avatar.svg'}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {user.first_name}{' '}
                  {user.last_name}
                </h2>
                {user.username && (
                  <p className="text-muted-foreground">
                    @{user.username}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="w-4 h-4" />
                  <span>{predictionsCount} предсказаний</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Тема оформления</h3>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`
                          flex items-center gap-3 p-4 rounded-lg transition-all
                          ${theme === t.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-black/20 hover:bg-black/30'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Настройки</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => webApp?.openTelegramLink?.('https://t.me/share/url?url=https://t.me/your_bot')}
                    className="w-full text-left px-4 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    Поделиться ботом
                  </button>
                  <button
                    onClick={() => webApp?.openTelegramLink?.('https://t.me/your_support_chat')}
                    className="w-full text-left px-4 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    Поддержка
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 