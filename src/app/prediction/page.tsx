'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { generatePrediction } from '@/utils/predictions';
import type { Prediction } from '@/utils/predictions';
import { TarotCard } from '@/components/TarotCard';

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

export default function PredictionPage() {
  const router = useRouter();
  const { ready } = useTelegramWebApp();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedPredictions = storage.get('predictions') || [];
    setPredictions(savedPredictions);
  }, []);

  const savePredictions = (newPredictions: Prediction[]) => {
    setPredictions(newPredictions);
    storage.set('predictions', newPredictions);
  };

  const handleNewPrediction = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const prediction = await generatePrediction();
      savePredictions([prediction, ...predictions]);
    } catch (error) {
      console.error('Failed to generate prediction:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
          <h1 className="text-xl font-semibold">Предсказание</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Получить предсказание</h1>
              <p className="text-muted-foreground mb-8">
                Нажмите кнопку, чтобы получить предсказание на картах Таро
              </p>
              <button
                onClick={handleNewPrediction}
                disabled={isGenerating}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Генерация...' : 'Получить предсказание'}
              </button>
            </div>

            {predictions.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">История предсказаний</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            showDescription={false}
                            size="sm"
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {prediction.date}
                        </p>
                        <p className="text-sm">{prediction.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
} 