'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { spreads, SpreadType } from '@/components/SpreadSelector';
import { TarotCard } from '@/components/TarotCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface TarotCardData {
  name: string;
  image: string;
  description: string;
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCAwIDI4MCA0ODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSI0ODAiIGZpbGw9IiMxYTFhMmUiLz48L3N2Zz4=';

const TAROT_CARDS: TarotCardData[] = [
  {
    name: 'Шут',
    image: PLACEHOLDER_IMAGE,
    description: 'Новые начинания, спонтанность, свобода'
  },
  {
    name: 'Маг',
    image: PLACEHOLDER_IMAGE,
    description: 'Сила воли, мастерство, проявление'
  },
  {
    name: 'Верховная Жрица',
    image: PLACEHOLDER_IMAGE,
    description: 'Интуиция, тайны, внутренняя мудрость'
  }
  // Add more cards here
];

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

  if (!spread) return null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-2xl mb-2">{spread.emoji}</div>
        <h1 className="text-3xl font-bold mb-2">{spread.name}</h1>
        <p className="text-muted-foreground">{spread.description}</p>
      </motion.div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[480px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {TAROT_CARDS.slice(0, spread.cardCount || 3).map((card, index) => (
              <TarotCard
                key={card.name}
                {...card}
                position={getPositionLabel(spread.id, index)}
                isRevealed={selectedCards.includes(index)}
                onReveal={() => {
                  if (!selectedCards.includes(index)) {
                    setSelectedCards(prev => [...prev, index]);
                  }
                }}
              />
            ))}
          </div>
        )}

        {selectedCards.length === (spread.cardCount || 3) && (
          <motion.button
            className="mx-auto mt-12 px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center gap-2 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/')}
          >
            <span>Новый расклад</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}

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