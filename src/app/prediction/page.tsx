'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { TarotCard } from '@/components/TarotCard';
import { HistoryPanel } from '@/components/HistoryPanel';

interface TarotCard {
  name: string;
  description: string;
  image: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  isReversed: boolean;
  currentMeaning: string;
}

interface Prediction {
  id: string;
  card: TarotCard;
  date: string;
}

export default function PredictionPage() {
  const router = useRouter();
  const [card, setCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const webApp = useTelegramWebApp();

  useEffect(() => {
    // Загружаем историю предсказаний
    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions).slice(-5));
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/get-prediction');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCard(data);
        
        // Сохраняем предсказание в историю
        const newPrediction = {
          id: Date.now().toString(),
          card: data,
          date: new Date().toISOString()
        };
        const updatedPredictions = [...predictions, newPrediction].slice(-5);
        setPredictions(updatedPredictions);
        localStorage.setItem('predictions', JSON.stringify(updatedPredictions));

        if (webApp) {
          webApp.MainButton.text = "Вернуться на главную";
          webApp.MainButton.show();
          webApp.MainButton.onClick(() => router.push('/'));
        }
      } catch (error) {
        console.error('Error fetching prediction:', error);
        setError('Не удалось получить предсказание. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();

    return () => {
      if (webApp?.MainButton) {
        webApp.MainButton.hide();
      }
    };
  }, [webApp]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-zinc-700 border-t-zinc-300 rounded-full"
        />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-400">{error || 'Ошибка при получении предсказания'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-900/20 to-black pointer-events-none" />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto space-y-8"
        >
          <h1 className="text-3xl font-serif text-center">
            Ваше предсказание
          </h1>

          <div className="flex justify-center">
            <TarotCard
              name={card.name}
              image={card.image}
              isReversed={card.isReversed}
              size="lg"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 border border-zinc-800"
          >
            <h2 className="text-xl font-serif mb-2">
              {card.name}
              {card.isReversed && ' (Перевёрнута)'}
            </h2>
            <p className="text-zinc-300 leading-relaxed">{card.currentMeaning}</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full py-4 px-8 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-lg border border-zinc-700/50 shadow-lg hover:shadow-zinc-700/20 transition-all duration-300"
          >
            <span className="text-lg font-serif">Получить новое предсказание</span>
          </motion.button>
        </motion.div>

        <HistoryPanel predictions={predictions} />
      </main>
    </div>
  );
} 