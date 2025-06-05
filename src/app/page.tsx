'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { Header } from '@/components/Header';
import { TarotCard } from '@/components/TarotCard';

const decorativeCards = [
  { name: "Маг", image: "https://api.dicebear.com/7.x/identicon/svg?seed=magician" },
  { name: "Жрица", image: "https://api.dicebear.com/7.x/identicon/svg?seed=priestess" },
  { name: "Императрица", image: "https://api.dicebear.com/7.x/identicon/svg?seed=empress" },
];

export default function Home() {
  const router = useRouter();
  const { ready } = useTelegramWebApp();
  const [dailyCard, setDailyCard] = useState<any>(null);

  useEffect(() => {
    if (ready) {
      router.push('/prediction');
    }
  }, [ready, router]);

  useEffect(() => {
    // Проверяем, была ли уже показана карта дня
    const today = new Date().toDateString();
    const storedCard = localStorage.getItem('dailyCard');
    const storedDate = localStorage.getItem('dailyCardDate');

    if (!storedCard || storedDate !== today) {
      fetch('/api/get-prediction')
        .then(res => res.json())
        .then(card => {
          setDailyCard(card);
          localStorage.setItem('dailyCard', JSON.stringify(card));
          localStorage.setItem('dailyCardDate', today);
        });
    } else {
      setDailyCard(JSON.parse(storedCard));
    }
  }, []);

  const handleGetPrediction = () => {
    router.push('/prediction');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Фоновая текстура */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-900/20 to-black pointer-events-none" />
      
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Карта дня */}
          {dailyCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-xl text-center text-zinc-400 mb-4 font-serif">
                Карта дня
              </h2>
              <div className="flex justify-center">
                <TarotCard
                  name={dailyCard.name}
                  image={dailyCard.image}
                  isReversed={dailyCard.isReversed}
                  size="md"
                  isInteractive={false}
                />
              </div>
            </motion.div>
          )}

          {/* Декоративные карты */}
          <div className="flex justify-center gap-4 mb-12">
            {decorativeCards.map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <TarotCard {...card} size="sm" />
              </motion.div>
            ))}
          </div>

          {/* Кнопка получения предсказания */}
          <motion.button
            onClick={handleGetPrediction}
            className="w-full max-w-md mx-auto block py-4 px-8 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-lg border border-zinc-700/50 shadow-lg hover:shadow-zinc-700/20 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg font-serif">Получить предсказание</span>
          </motion.button>
        </main>
      </div>
    </div>
  );
}
