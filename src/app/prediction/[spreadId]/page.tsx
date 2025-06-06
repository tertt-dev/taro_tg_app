'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { spreads, SpreadType } from '@/components/SpreadSelector';
import { TarotCard } from '@/components/TarotCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TAROT_CARDS } from '@/utils/predictions';

function getPositionLabel(spreadId: string, position: number): string {
  switch (spreadId) {
    case 'love':
      return ['Чувства', 'Препятствия', 'Перспектива'][position];
    case 'work':
      return ['Текущее положение', 'Вызовы', 'Совет'][position];
    case 'daily':
      return 'Энергия дня';
    default:
      return `Позиция ${position + 1}`;
  }
}

export default function PredictionPage() {
  const params = useParams();
  const router = useRouter();
  const [spread, setSpread] = useState<SpreadType | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const spreadId = params?.spreadId as string;
    const currentSpread = spreads.find(s => s.id === spreadId);
    if (!currentSpread) {
      router.push('/');
      return;
    }
    setSpread(currentSpread);
    startReading(currentSpread);
  }, [params?.spreadId, router]);

  const startReading = (currentSpread: SpreadType) => {
    setIsLoading(true);
    setSelectedCards([]);
    const cardCount = currentSpread.cardCount || 
      (currentSpread.id === 'random' ? Math.floor(Math.random() * 3) + 1 : 3);

    // Randomly select cards
    const selected: number[] = [];
    while (selected.length < cardCount) {
      const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
      if (!selected.includes(randomIndex)) {
        selected.push(randomIndex);
      }
    }

    // Reveal cards one by one with delay
    selected.forEach((cardIndex, i) => {
      setTimeout(() => {
        setSelectedCards(prev => [...prev, cardIndex]);
        if (i === selected.length - 1) {
          setIsLoading(false);
        }
      }, i * 1000);
    });
  };

  const handleNewSpread = () => {
    if (spread) {
      startReading(spread);
    }
  };

  if (!spread) return null;

  const cardCount = spread.cardCount || (spread.id === 'random' ? Math.floor(Math.random() * 3) + 1 : 3);
  const isSingleCard = cardCount === 1;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{spread.name}</h1>
        <p className="text-muted-foreground">{spread.description}</p>
      </motion.div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[480px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className={`grid gap-8 justify-items-center ${
            isSingleCard 
              ? 'grid-cols-1 place-items-center' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {Array.from({ length: cardCount }).map((_, index) => {
              const card = TAROT_CARDS[selectedCards[index]] || TAROT_CARDS[0];
              return (
                <TarotCard
                  key={index}
                  {...card}
                  position={getPositionLabel(spread.id, index)}
                  isRevealed={selectedCards.includes(index)}
                  onReveal={() => {
                    if (!selectedCards.includes(index)) {
                      setSelectedCards(prev => [...prev, index]);
                    }
                  }}
                  size={isSingleCard ? 'lg' : 'md'}
                />
              );
            })}
          </div>
        )}

        {selectedCards.length === cardCount && (
          <motion.button
            className="mx-auto mt-12 px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center gap-2 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNewSpread}
          >
            <span>Новый расклад</span>
          </motion.button>
        )}
      </div>
    </div>
  );
} 