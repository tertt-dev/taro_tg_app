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
    sm: 'w-36 h-60',
    md: 'w-48 h-80',
    lg: 'w-60 h-96',
  };

  const handleClick = () => {
    if (!isRevealed && onReveal) {
      onReveal();
    }
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${sizeClasses[size]}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        {isRevealed ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-900">
            <div className="absolute inset-0 bg-[url('/card-back-pattern.svg')] opacity-20" />
          </div>
        )}
      </div>

      {showDescription && isRevealed && (
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            {position && (
              <div className="text-sm text-gray-400 mb-1">{position}</div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-400">{cardNumber}</span>
              <h3 className="text-lg font-semibold">{name}</h3>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
} 