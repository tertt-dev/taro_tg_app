'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TarotCard } from '@/components/TarotCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface TarotCardData {
  name: string;
  image: string;
  description: string;
}

const TAROT_CARDS: TarotCardData[] = [
  {
    name: 'Шут',
    image: '/cards/fool.svg',
    description: 'Новые начинания, спонтанность, свобода'
  },
  {
    name: 'Маг',
    image: '/cards/magician.svg',
    description: 'Сила воли, мастерство, проявление'
  },
  {
    name: 'Верховная Жрица',
    image: '/cards/high-priestess.svg',
    description: 'Интуиция, тайны, внутренняя мудрость'
  }
];

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startReading = () => {
    setIsReading(true);
    setIsLoading(true);
    // Randomly select 3 cards
    const selected: number[] = [];
    while (selected.length < 3) {
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Фоновая текстура */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-900/20 to-black pointer-events-none" />
      
      <div className="relative z-10 w-full py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-cormorant font-semibold text-[var(--accent-gold)] mb-4">
            Мистическое Таро
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-dm-sans mb-12">
            Погрузитесь в тайны карт и раскройте послания судьбы
          </p>

          {!isReading && (
            <motion.button
              className="mystic-button mx-auto group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startReading}
            >
              <span className="text-[var(--accent-gold)]">✦</span>
              <span className="text-lg font-dm-sans">Получить предсказание</span>
              <span className="text-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                ✦
              </span>
            </motion.button>
          )}

          {isReading && (
            <div className="mt-12">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[480px]">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {TAROT_CARDS.map((card, index) => (
                    <TarotCard
                      key={card.name}
                      {...card}
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

              {selectedCards.length === TAROT_CARDS.length && (
                <motion.button
                  className="mystic-button mx-auto mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setSelectedCards([]);
                    setIsReading(false);
                    setIsLoading(false);
                  }}
                >
                  <span>✧</span>
                  <span>Начать заново</span>
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
