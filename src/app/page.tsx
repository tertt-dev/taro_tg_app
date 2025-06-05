'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

export default function Home() {
  const router = useRouter();
  const webApp = useTelegramWebApp();

  const handleGetPrediction = () => {
    if (webApp) {
      webApp.MainButton.text = "Вернуться на главную";
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => router.push('/'));
    }
    router.push('/prediction');
  };

  return (
    <main className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-center gold-text">
          Добро пожаловать в Таро-бот
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetPrediction}
          className="w-full py-4 px-8 mystical-border bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
          Получить предсказание
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="aspect-[2/3] mystical-border bg-gradient-to-br from-purple-800/50 to-black/50 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                <span className="text-purple-400">Карта Таро</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
