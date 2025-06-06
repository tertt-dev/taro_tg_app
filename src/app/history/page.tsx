'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { type Prediction } from '@/utils/predictions';

export default function HistoryPage() {
  const { webApp } = useTelegramWebApp();
  const [predictions, setPredictions] = useState<Prediction[]>([]);

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

  // Load predictions from localStorage
  useEffect(() => {
    const savedPredictions = localStorage.getItem('predictions');
    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions));
    }
  }, []);

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
          <h1 className="text-xl font-semibold">История</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 rounded-lg p-4"
            >
              <div className="text-sm text-muted-foreground mb-2">
                {prediction.date}
              </div>
              <div className="flex gap-2 mb-3">
                {prediction.cards.map((card, cardIndex) => (
                  <div
                    key={`${prediction.date}-${cardIndex}`}
                    className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center text-xs"
                  >
                    {card.name}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {prediction.text}
              </p>
            </motion.div>
          ))}

          {predictions.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              У вас пока нет предсказаний
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 