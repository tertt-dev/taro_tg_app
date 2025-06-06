'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { TarotCard } from '@/components/TarotCard';
import { TAROT_CARDS } from '@/utils/predictions';

interface CardDetailsProps {
  card: typeof TAROT_CARDS[number];
  onClose: () => void;
}

const CardDetails = ({ card, onClose }: CardDetailsProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-zinc-900/90 rounded-xl p-6 max-w-lg w-full relative"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex flex-col items-center">
        <div className="w-48 h-80 mb-6">
          <TarotCard
            {...card}
            isRevealed={true}
            onReveal={() => {}}
            size="sm"
            isInteractive={false}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4">{card.name}</h2>
        <p className="text-muted-foreground text-center leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  </motion.div>
);

export default function DeckPage() {
  const { webApp } = useTelegramWebApp();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    const backButton = webApp?.BackButton;
    if (backButton) {
      backButton.show();
      const handleBack = () => window.history.back();
      backButton.onClick(handleBack);

      return () => {
        backButton.hide();
        backButton.offClick(handleBack);
      };
    }
  }, [webApp]);

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
          <h1 className="text-xl font-semibold">Колода Таро</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {TAROT_CARDS.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-center"
            >
              <div className="w-36 h-60">
                <TarotCard
                  {...card}
                  size="sm"
                  isRevealed={true}
                  onReveal={() => setSelectedCard(index)}
                  showDescription={true}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedCard !== null && (
          <CardDetails
            card={TAROT_CARDS[selectedCard]}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 