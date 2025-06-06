'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface TarotCardProps {
  name: string;
  image: string;
  description: string;
  position?: string;
  isRevealed: boolean;
  onReveal: () => void;
}

export function TarotCard({
  name,
  image,
  description,
  position,
  isRevealed,
  onReveal,
}: TarotCardProps) {
  return (
    <motion.div
      className="relative w-full max-w-[280px] aspect-[2/3] cursor-pointer perspective-1000"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onReveal}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ rotateY: isRevealed ? '180deg' : '0deg' }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1">
            <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
              <span className="text-4xl">🎴</span>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm p-4 flex flex-col items-center">
            <div className="relative w-full aspect-square mb-4">
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            {position && (
              <div className="text-sm text-muted-foreground mb-2">{position}</div>
            )}
            <p className="text-sm text-center text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 