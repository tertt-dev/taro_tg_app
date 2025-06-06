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
  const [predictions, setPredictions] = useState<any[]>([]);
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

  // Initialize user data and load predictions
  useEffect(() => {
    console.log('Profile page: checking user data...');
    
    // Try to get user data from URL if not available in WebApp
    let userData = webApp?.initDataUnsafe?.user;
    if (!userData && typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const tgWebAppData = params.get('tgWebAppData');
        if (tgWebAppData) {
          const parsedData = JSON.parse(atob(tgWebAppData));
          userData = parsedData;
          console.log('Got user data from URL:', userData);
        }
      } catch (error) {
        console.error('Failed to parse URL data:', error);
      }
    }

    console.log('Profile page: user data:', userData);
    
    if (userData?.id) {
      // Load predictions from localStorage
      const savedPredictions = localStorage.getItem('predictions');
      if (savedPredictions) {
        setPredictions(JSON.parse(savedPredictions));
      }
      
      // Create or update user in database
      db.createOrUpdateUser({
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        photo_url: userData.photo_url,
      });
    } else {
      console.warn('Profile page: no user data available');
    }
    setIsLoading(false);
  }, [webApp?.initDataUnsafe?.user]);

  const handleThemeChange = (newTheme: Theme['id']) => {
    setTheme(newTheme);
    // Here you can implement actual theme change logic
  };

  const user = webApp?.initDataUnsafe?.user;
  const recentPredictions = predictions.slice(0, 5); // Show only 5 most recent predictions

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-lg">Инициализация приложения...</p>
          <p className="text-sm text-muted-foreground mt-2">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-lg text-red-500 mb-4">Ошибка инициализации</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Убедитесь, что вы открыли приложение через Telegram и попробуйте перезапустить его
          </p>
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
          <p className="text-sm text-muted-foreground mt-2">Получение данных пользователя</p>
        </div>
      </div>
    );
  }

  if (!webApp?.initDataUnsafe?.user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-lg text-yellow-500 mb-4">Данные пользователя недоступны</p>
          <p className="text-muted-foreground mb-4">
            Не удалось получить информацию о пользователе из Telegram
          </p>
          <p className="text-sm text-muted-foreground">
            Пожалуйста, убедитесь что вы:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Открыли приложение через Telegram</li>
            <li>• Используете актуальную версию Telegram</li>
            <li>• Разрешили доступ к данным профиля</li>
          </ul>
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
            className="space-y-6"
          >
            {/* User Info Section */}
            <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
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
                    <span>{predictions.length} предсказаний</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Predictions Section */}
            {recentPredictions.length > 0 && (
              <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-medium mb-4">Последние предсказания</h3>
                <div className="space-y-4">
                  {recentPredictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="p-4 bg-black/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Image
                          src={prediction.image}
                          alt={prediction.name}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium">{prediction.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(prediction.date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {prediction.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Section */}
            <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm">
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

            {/* Settings Section */}
            <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm">
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
          </motion.div>
        )}
      </main>
    </div>
  );
} 