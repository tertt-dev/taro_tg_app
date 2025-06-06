'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTelegramWebApp } from '@/components/TelegramProvider';
import { TarotCard } from '@/components/TarotCard';
import { TAROT_CARDS } from '@/utils/predictions';

export default function DeckPage() {
  const { webApp } = useTelegramWebApp();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Show BackButton in Telegram WebApp
  if (webApp) {
    webApp.BackButton.show();
    webApp.BackButton.onClick(() => window.history.back());
  }

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TAROT_CARDS.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TarotCard
                {...card}
                isRevealed={selectedCard === index}
                onReveal={() => setSelectedCard(index)}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 