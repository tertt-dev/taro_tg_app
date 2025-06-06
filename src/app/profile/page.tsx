'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTelegramWebApp } from '@/components/TelegramProvider';

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
  const { webApp } = useTelegramWebApp();
  const [theme, setTheme] = useState<Theme['id']>('dark');

  // Show BackButton in Telegram WebApp
  useEffect(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      return () => {
        webApp.BackButton.hide();
      };
    }
  }, [webApp]);

  // Handle back button click
  useEffect(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(() => window.history.back());
    }
  }, [webApp]);

  const handleThemeChange = (newTheme: Theme['id']) => {
    setTheme(newTheme);
    // Here you can implement actual theme change logic
  };

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
        {webApp?.initDataUnsafe.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              {webApp.initDataUnsafe.user.photo_url && (
                <img
                  src={webApp.initDataUnsafe.user.photo_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {webApp.initDataUnsafe.user.first_name}{' '}
                  {webApp.initDataUnsafe.user.last_name}
                </h2>
                {webApp.initDataUnsafe.user.username && (
                  <p className="text-muted-foreground">
                    @{webApp.initDataUnsafe.user.username}
                  </p>
                )}
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
                    onClick={() => webApp?.openTelegramLink('https://t.me/share/url?url=https://t.me/your_bot')}
                    className="w-full text-left px-4 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    Поделиться ботом
                  </button>
                  <button
                    onClick={() => webApp?.openTelegramLink('https://t.me/your_support_chat')}
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