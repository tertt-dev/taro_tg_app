'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTelegram } from '@/components/TelegramProvider';
import { generatePrediction } from '@/utils/predictions';
import type { Prediction, SpreadType } from '@/utils/predictions';
import { TarotCard } from '@/components/TarotCard';

const SPREADS = [
  {
    id: 'daily' as SpreadType,
    name: 'Карта дня',
    description: 'Одна карта, отражающая энергию и основную тему дня',
    cardCount: 1,
  },
  {
    id: 'past-present-future' as SpreadType,
    name: 'Прошлое, настоящее, будущее',
    description: 'Трехкарточный расклад для понимания временной динамики ситуации',
    cardCount: 3,
  },
  {
    id: 'celtic-cross' as SpreadType,
    name: 'Кельтский крест',
    description: 'Подробный расклад из 10 карт для глубокого анализа ситуации',
    cardCount: 10,
  },
  {
    id: 'relationship' as SpreadType,
    name: 'Отношения',
    description: 'Пятикарточный расклад для анализа отношений и их перспектив',
    cardCount: 5,
  }
];

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
  const { isAuthenticated, user } = useTelegram();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);

  useEffect(() => {
    const savedPredictions = storage.get('predictions') || [];
    setPredictions(savedPredictions);
  }, []);

  const savePredictions = (newPredictions: Prediction[]) => {
    setPredictions(newPredictions);
    storage.set('predictions', newPredictions);
  };

  const handleNewPrediction = async () => {
    if (isGenerating || !selectedSpread) return;
    setIsGenerating(true);

    try {
      const prediction = await generatePrediction(selectedSpread);
      savePredictions([prediction, ...predictions]);
    } catch (error) {
      console.error('Failed to generate prediction:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return null;
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
          <h1 className="text-xl font-semibold">Расклады</h1>
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
              <h1 className="text-3xl font-bold mb-4">Выберите расклад</h1>
              <p className="text-gray-400 mb-8">
                Здравствуйте, {user?.first_name}! Выберите тип расклада, который лучше всего подходит для вашего вопроса
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPREADS.map((spread) => (
                <button
                  key={spread.id}
                  onClick={() => setSelectedSpread(spread.id)}
                  className={`p-6 rounded-lg text-left transition-all ${
                    selectedSpread === spread.id
                      ? 'bg-purple-600 ring-2 ring-purple-400'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{spread.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{spread.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{spread.cardCount} карт</span>
                    {selectedSpread === spread.id && (
                      <span className="text-purple-200">Выбрано ✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center pt-6">
              <button
                onClick={handleNewPrediction}
                disabled={isGenerating || !selectedSpread}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Подготовка расклада...' : 'Сделать расклад'}
              </button>
            </div>

            {predictions.length > 0 && (
              <div className="space-y-6 pt-12">
                <h2 className="text-2xl font-semibold text-purple-400">История раскладов</h2>
                <div className="grid grid-cols-1 gap-6">
                  {predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl p-6 space-y-4"
                    >
                      <div className="flex flex-wrap gap-4">
                        {prediction.cards.map((card, cardIndex) => (
                          <TarotCard
                            key={cardIndex}
                            {...card}
                            isRevealed={true}
                            showDescription={true}
                            size="sm"
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          {prediction.date}
                        </p>
                        <p className="text-sm text-gray-300">{prediction.text}</p>
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