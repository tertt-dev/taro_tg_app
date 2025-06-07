'use client';

import { Header } from '@/components/Header';
import { TarotCard } from '@/components/TarotCard';
import { TAROT_CARDS } from '@/utils/predictions';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

const MOCK_SPREADS = {
  'love': {
    name: 'Любовь',
    cards: [
      { ...TAROT_CARDS[6], position: 'Чувства' },
      { ...TAROT_CARDS[19], position: 'Препятствия' },
      { ...TAROT_CARDS[17], position: 'Перспектива' },
    ]
  },
  'work': {
    name: 'Работа',
    cards: [
      { ...TAROT_CARDS[4], position: 'Текущее положение' },
      { ...TAROT_CARDS[7], position: 'Вызовы' },
      { ...TAROT_CARDS[8], position: 'Совет' },
    ]
  },
  'daily': {
    name: 'На день',
    cards: [
      { ...TAROT_CARDS[17], position: 'Энергия дня' },
    ]
  },
  'random': {
    name: 'Случайный расклад',
    cards: [
      { ...TAROT_CARDS[0], position: 'Ситуация' },
      { ...TAROT_CARDS[1], position: 'Скрытое влияние' },
      { ...TAROT_CARDS[2], position: 'Совет' },
    ]
  }
} as const;

function getGridClass(cardCount: number): string {
  switch (cardCount) {
    case 1:
      return 'max-w-sm';
    case 2:
      return 'max-w-3xl grid-cols-1 md:grid-cols-2';
    case 3:
      return 'max-w-5xl grid-cols-1 md:grid-cols-3';
    default:
      return 'max-w-5xl grid-cols-1 md:grid-cols-3';
  }
}

export default function PredictionPage() {
  const params = useParams();
  const type = params?.type as string;
  const spread = MOCK_SPREADS[type as keyof typeof MOCK_SPREADS];
  
  if (!spread) {
    return (
      <div className="min-h-screen text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-medium text-center mb-8">
            Расклад не найден: {type}
          </h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-center mb-12">
          {spread.name}
        </h1>

        <div className="flex flex-col items-center">
          <div className={`grid gap-16 w-full mx-auto ${getGridClass(spread.cards.length)}`}>
            {spread.cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-full aspect-[320/520] max-w-[320px] mx-auto mb-6">
                  <TarotCard
                    {...card}
                    isRevealed={true}
                    onReveal={() => {}}
                    size="lg"
                  />
                </div>
                <p className="text-lg text-center text-muted-foreground">
                  {card.position}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 