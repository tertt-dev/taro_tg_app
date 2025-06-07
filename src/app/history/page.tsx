'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { TarotCard } from '@/components/TarotCard';
import type { Prediction } from '@/utils/predictions';

// Safe localStorage wrapper
const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  },
  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
};

export default function HistoryPage() {
  const router = useRouter();
  const { ready } = useTelegramWebApp();
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const savedPredictions = storage.get('predictions') || [];
    setPredictions(savedPredictions);
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">История предсказаний</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {predictions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex flex-wrap gap-4">
                      {prediction.cards.map((card, cardIndex) => (
                        <TarotCard
                          key={cardIndex}
                          {...card}
                          isRevealed={true}
                          showDescription={true}
                          size="md"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {prediction.date}
                      </p>
                      <p className="text-lg">{prediction.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  У вас пока нет предсказаний
                </p>
                <button
                  onClick={() => router.push('/prediction')}
                  className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Получить предсказание
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
} 