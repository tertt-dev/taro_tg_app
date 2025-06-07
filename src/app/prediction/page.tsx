'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTelegram } from '@/components/TelegramProvider';
import { Header } from '@/components/Header';
import { TarotCard } from '@/components/TarotCard';
import { HistoryPanel } from '@/components/HistoryPanel';
import { generatePrediction, type Prediction } from '@/utils/predictions';

export default function PredictionPage() {
  const router = useRouter();
  const { ready } = useTelegram();
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
    <div className="min-h-screen text-white font-cormorant">
      <Header onHistoryClick={toggleHistory} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <motion.button
            onClick={handleNewPrediction}
            disabled={isGenerating}
            className="relative flex flex-col p-4 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden z-20"
            whileHover={{ scale: isGenerating ? 1 : 1.05 }}
            whileTap={{ scale: isGenerating ? 1 : 0.95 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            </div>
            <div className="relative z-10">
              {isGenerating ? 'Гадаем...' : 'Получить предсказание'}
            </div>
          </motion.button>

          {predictions.length > 0 && (
            <div className="mt-8 w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex flex-col p-6 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden z-20"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl font-medium mb-4 font-cormorant">
                    {predictions[0].date}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {predictions[0].cards.map((card, index) => (
                      <TarotCard
                        key={index}
                        name={card.name}
                        image={card.image}
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
                  <p className="text-muted-foreground leading-relaxed font-cormorant">
                    {predictions[0].text}
                  </p>
                </div>
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