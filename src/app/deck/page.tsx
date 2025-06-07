'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { TarotCard } from '@/components/TarotCard';
import { TAROT_CARDS } from '@/utils/predictions';
import { X } from 'lucide-react';

export default function DeckPage() {
  const { webApp } = useTelegramWebApp();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    const backButton = webApp?.BackButton;
    if (backButton) {
      backButton.show();
      const handleBack = () => window.history.back();
      backButton.onClick(handleBack);

      // Cleanup
      return () => {
        backButton.hide();
        backButton.offClick(handleBack);
      };
    }
  }, [webApp]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Колода Таро</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {TAROT_CARDS.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
                <TarotCard
                  {...card}
                  isRevealed={true}
                  onReveal={() => setSelectedCard(index)}
                showDescription={false}
                size="sm"
                />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 p-6 rounded-2xl max-w-lg w-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {TAROT_CARDS[selectedCard].name}
                </h2>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-300">
                {TAROT_CARDS[selectedCard].description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 