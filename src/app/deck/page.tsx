'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTelegram } from '@/components/TelegramProvider';
import { TarotCard } from '@/components/TarotCard';
import { TAROT_CARDS } from '@/utils/predictions';
import Image from 'next/image';

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
  const { user } = useTelegram();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gold-text">Колода Таро</h1>
            <p className="text-gray-400">
              Добро пожаловать, {user?.first_name}
            </p>
          </div>
          
          <div className="glass-panel overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
              {TAROT_CARDS.map((card, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-[2/3] rounded overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Image
                    src={card.image}
                    alt={`Preview card ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

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