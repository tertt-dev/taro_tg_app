'use client';

import { Heart, Briefcase, Sun, Dices } from 'lucide-react';

export interface SpreadType {
  id: string;
  name: string;
  icon: React.ReactNode;
  emoji: string;
  description: string;
  cardCount: number;
}

export const spreads: SpreadType[] = [
  {
    id: 'love',
    name: 'Любовь',
    icon: <Heart className="w-6 h-6" />,
    emoji: '❤️',
    description: 'Чувства, препятствия, перспектива отношений',
    cardCount: 3,
  },
  {
    id: 'work',
    name: 'Работа',
    icon: <Briefcase className="w-6 h-6" />,
    emoji: '💼',
    description: 'Текущее положение, вызовы, совет',
    cardCount: 3,
  },
  {
    id: 'daily',
    name: 'На день',
    icon: <Sun className="w-6 h-6" />,
    emoji: '☀️',
    description: 'Энергия дня, краткое предсказание',
    cardCount: 1,
  },
  {
    id: 'random',
    name: 'Случайный',
    icon: <Dices className="w-6 h-6" />,
    emoji: '🎲',
    description: 'Случайный расклад с необычной перспективой',
    cardCount: 0,
  },
];

interface SpreadSelectorProps {
  onSelect: (spread: SpreadType) => void;
}

export function SpreadSelector({ onSelect }: SpreadSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {spreads.map((spread) => (
        <button
          key={spread.id}
          onClick={() => onSelect(spread)}
          className="relative flex flex-col items-center p-4 rounded-xl bg-black/40 backdrop-blur-[20px] border border-white/10 hover:bg-black/50 transition-all duration-200 group overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-full border border-white/20"
                />
              ))}
            </div>
          </div>

          <div className="absolute -top-2 -right-2 text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
            {spread.emoji}
          </div>
          <div className="mb-2 text-primary group-hover:scale-110 transition-transform relative z-10">
            {spread.icon}
          </div>
          <h3 className="text-lg font-medium mb-1 relative z-10">{spread.name}</h3>
          <p className="text-xs text-muted-foreground text-center relative z-10">
            {spread.description}
          </p>
          {spread.cardCount > 0 && (
            <div className="mt-2 text-xs text-muted-foreground relative z-10">
              {spread.cardCount} {spread.cardCount === 1 ? 'карта' : 'карты'}
            </div>
          )}
        </button>
      ))}
    </div>
  );
} 