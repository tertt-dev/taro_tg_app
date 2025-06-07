'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Card } from '@/utils/predictions';

export interface TarotCardProps extends Card {
  isRevealed?: boolean;
  onReveal?: () => void;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: string;
}

export function TarotCard({
  name,
  image,
  description,
  cardNumber,
  position,
  isRevealed = false,
  onReveal,
  showDescription = false,
  size = 'md',
}: TarotCardProps) {
  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-40 h-60',
    lg: 'w-56 h-84',
  };

  const handleClick = () => {
    if (!isRevealed && onReveal) {
      onReveal();
    }
  };

  return (
    <motion.div
      className={`perspective-1000 ${sizeClasses[size]}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative w-full h-full transform-style-preserve-3d"
        initial={false}
        animate={{ rotateY: isRevealed ? 0 : 180 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="relative w-full h-full glass-panel">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {showDescription && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                {position && (
                  <div className="text-sm text-purple-300 mb-1">{position}</div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-purple-300">{cardNumber}</span>
                  <h3 className="text-lg font-semibold text-white">{name}</h3>
                </div>
                <p className="text-sm text-gray-200 line-clamp-2">{description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="relative w-full h-full glass-panel overflow-hidden">
            <Image
              src="/cards/back.jpg"
              alt="Card Back"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-white/30 rounded-full animate-spin-slow" />
              <div className="absolute w-12 h-12 border-2 border-white/20 rounded-full animate-spin-reverse-slow" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 