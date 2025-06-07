'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Heart, Compass } from 'lucide-react';

export type SpreadType = {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  icon: React.ReactElement;
};

export const spreads: SpreadType[] = [
  {
    id: 'daily',
    name: 'Карта дня',
    description: 'Одна карта, отражающая энергию и события предстоящего дня',
    cardCount: 1,
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: 'past-present-future',
    name: 'Прошлое-Настоящее-Будущее',
    description: 'Классический расклад для понимания временной линии ситуации',
    cardCount: 3,
    icon: <Calendar className="w-8 h-8" />,
  },
  {
    id: 'celtic-cross',
    name: 'Кельтский крест',
    description: 'Глубокий анализ ситуации с разных сторон',
    cardCount: 10,
    icon: <Compass className="w-8 h-8" />,
  },
  {
    id: 'relationship',
    name: 'Отношения',
    description: 'Расклад для анализа любовных и партнерских отношений',
    cardCount: 5,
    icon: <Heart className="w-8 h-8" />,
  },
];

interface SpreadSelectorProps {
  onSelect: (spread: SpreadType) => void;
}

export function SpreadSelector({ onSelect }: SpreadSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {spreads.map((spread, index) => (
        <motion.button
          key={spread.id}
          onClick={() => onSelect(spread)}
          className="relative flex flex-col items-center p-6 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          </div>

          <div className="mb-4 text-purple-400 group-hover:scale-110 transition-transform relative z-10">
            {spread.icon}
          </div>
          <h3 className="text-xl font-medium mb-2 relative z-10">{spread.name}</h3>
          <p className="text-sm text-gray-400 text-center relative z-10">
            {spread.description}
          </p>
          <div className="mt-4 text-sm text-gray-500 relative z-10">
            {spread.cardCount} {spread.cardCount === 1 ? 'карта' : 'карты'}
          </div>
        </motion.button>
      ))}
    </div>
  );
} 