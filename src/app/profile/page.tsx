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

interface Prediction {
  name: string;
  image: string;
  text: string;
  date: string;
  isReversed?: boolean;
  currentMeaning?: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

const themes: Theme[] = [
  { id: 'light', name: 'Светлая', icon: Sun },
  { id: 'dark', name: 'Тёмная', icon: Moon },
];

export default function ProfilePage() {
  const { webApp, ready, error } = useTelegramWebApp();
  const [theme, setTheme] = useState<Theme['id']>('dark');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);

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

      // Set user data in state
      setUserData({
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        photo_url: userData.photo_url,
        language_code: userData.language_code
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

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
          <p className="text-gray-400">Получаем данные профиля</p>
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
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              {userData.photo_url && (
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={userData.photo_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {userData.first_name} {userData.last_name}
                </h2>
                {userData.username && (
                  <p className="text-muted-foreground">
                    @{userData.username}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">История предсказаний</h3>
                </div>
                {recentPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {recentPredictions.map((prediction, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={prediction.image}
                            alt={prediction.name}
                            width={48}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{prediction.name}</p>
                          <p className="text-sm text-muted-foreground">{prediction.date}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {prediction.currentMeaning || prediction.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    У вас пока нет предсказаний. Сделайте первое предсказание, чтобы увидеть его здесь.
                  </p>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Настройки</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Тема оформления
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                              theme === t.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 