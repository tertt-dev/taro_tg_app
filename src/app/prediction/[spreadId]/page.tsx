'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TarotCard } from '@/components/TarotCard';
import { getRandomCards, getPositionLabel, type Card, type SpreadId } from '@/utils/predictions';
import { spreads, type SpreadType } from '@/components/SpreadSelector';

export default function PredictionPage() {
  const router = useRouter();
  const params = useParams();
  const spreadId = params.spreadId as SpreadId;
  const spread = spreads.find((s: SpreadType) => s.id === spreadId);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!spread) return;
    setCards(getRandomCards(spread.cardCount));
    setIsReady(true);
  }, [spread]);

  if (!spread || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Подготовка карт...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{spread.name}</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <p className="text-gray-400">{spread.description}</p>
            </div>

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
                    position={getPositionLabel(spreadId, index)}
                    isRevealed={selectedCards.includes(index)}
                    onReveal={() => {
                      if (!selectedCards.includes(index)) {
                        setSelectedCards((prev) => [...prev, index]);
                      }
                    }}
                    showDescription={true}
                    size="lg"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 