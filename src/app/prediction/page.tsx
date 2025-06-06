'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { Header } from '@/components/Header';
import { TarotCard } from '@/components/TarotCard';
import { HistoryPanel } from '@/components/HistoryPanel';
import { generatePrediction, type Prediction } from '@/utils/predictions';

export default function PredictionPage() {
  const router = useRouter();
  const { ready } = useTelegramWebApp();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  useEffect(() => {
    if (!ready) {
      router.push('/');
    }
  }, [ready, router]);

  useEffect(() => {
    const savedPredictions = localStorage.getItem('predictions');
    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('predictions', JSON.stringify(predictions));
  }, [predictions]);

  const handleNewPrediction = async () => {
    setIsGenerating(true);
    setRevealedCards([]);
    try {
      const prediction = await generatePrediction();
      setPredictions((prev) => [prediction, ...prev]);
    } catch (error) {
      console.error('Failed to generate prediction:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onHistoryClick={toggleHistory} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <motion.button
            onClick={handleNewPrediction}
            disabled={isGenerating}
            className={`
              px-6 py-3 rounded-lg bg-purple-600 text-white font-medium
              transition-colors duration-200
              ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}
            `}
            whileHover={{ scale: isGenerating ? 1 : 1.05 }}
            whileTap={{ scale: isGenerating ? 1 : 0.95 }}
          >
            {isGenerating ? 'Гадаем...' : 'Получить предсказание'}
          </motion.button>

          {predictions.length > 0 && (
            <div className="mt-8 w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900 rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {predictions[0].date}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {predictions[0].cards.map((card, index) => (
                    <TarotCard
                      key={index}
                      name={card.name}
                      image={`https://api.dicebear.com/7.x/identicon/svg?seed=${card.name.toLowerCase().replace(/\s+/g, '-')}`}
                      description={card.description || ''}
                      isRevealed={revealedCards.includes(index)}
                      onReveal={() => {
                        if (!revealedCards.includes(index)) {
                          setRevealedCards(prev => [...prev, index]);
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {predictions[0].text}
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <HistoryPanel
        isOpen={showHistory}
        onClose={toggleHistory}
        predictions={predictions}
      />
    </div>
  );
} 