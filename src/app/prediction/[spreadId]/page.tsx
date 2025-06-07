'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { TarotCard } from '@/components/TarotCard';
import { TAROT_CARDS, Card } from '@/utils/predictions';
import { spreads, SpreadType } from '@/components/SpreadSelector';

function getRandomCards(count: number): Card[] {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getPositionLabel(spreadId: string, position: number): string {
  const spread = spreads.find((s: SpreadType) => s.id === spreadId);
  if (!spread) return '';
  return spread.positions[position] || '';
}

export default function PredictionPage() {
  const params = useParams();
  const spreadId = params.spreadId as string;
  const spread = spreads.find((s: SpreadType) => s.id === spreadId);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!spread) return;
    setCards(getRandomCards(spread.positions.length));
    setIsReady(true);
  }, [spread]);

  if (!spread || !isReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
          <p className="text-gray-400">Подготовка карт</p>
        </div>
      </div>
    );
    }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{spread.name}</h1>
        <p className="text-gray-300 mb-8">{spread.description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
      <motion.div
              key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
                <TarotCard
                  {...card}
                  position={getPositionLabel(spread.id, index)}
                  isRevealed={selectedCards.includes(index)}
                  onReveal={() => {
                    if (!selectedCards.includes(index)) {
                      setSelectedCards(prev => [...prev, index]);
                    }
                  }}
                showDescription={true}
                size="lg"
                />
            </motion.div>
          ))}
          </div>
      </div>
    </div>
  );
} 