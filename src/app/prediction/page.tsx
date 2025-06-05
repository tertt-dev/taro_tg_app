'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import Image from 'next/image';

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

const API_URL = '/api';

export default function PredictionPage() {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);
  const webApp = useTelegramWebApp();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await fetch(`${API_URL}/api/get-prediction`);
        const data = await response.json();
        setCard(data);
        
        if (webApp) {
          webApp.MainButton.text = "Получить новое предсказание";
          webApp.MainButton.show();
          webApp.MainButton.onClick(() => window.location.reload());
        }
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [webApp]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Ошибка при получении предсказания</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-8"
      >
        <h1 className="text-3xl font-bold text-center gold-text">
          Ваше предсказание
        </h1>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="aspect-[2/3] mystical-border bg-gradient-to-br from-purple-800/50 to-black/50 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="card-container w-full h-full">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: card.isReversed ? 180 : 0 }}
              transition={{ duration: 1 }}
              className="card w-full h-full rounded-lg bg-gradient-to-br from-purple-900 to-black flex flex-col items-center justify-center p-6 space-y-4"
            >
              <div className="relative w-32 h-32">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="rounded-full border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 object-cover"
                />
                {card.isReversed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-purple-500 text-xs px-2 py-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                  >
                    ↻
                  </motion.span>
                )}
              </div>
              <h2 className="text-2xl font-bold gold-text">
                {card.name}
                {card.isReversed && ' (Перевёрнута)'}
              </h2>
              <p className="text-center text-gray-300 leading-relaxed">{card.currentMeaning}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="w-full py-4 px-8 mystical-border bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
          Получить новое предсказание
        </motion.button>
      </motion.div>
    </main>
  );
} 