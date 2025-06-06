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
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
}

export function TarotCard({
  name,
  image,
  description,
  position,
  isRevealed,
  onReveal,
  size = 'md',
  isInteractive = true,
}: TarotCardProps) {
  const cardSizes = {
    sm: 'w-[140px] h-[240px]',
    md: 'w-[280px] h-[480px]',
    lg: 'w-[320px] h-[520px]'
  };

  return (
    <motion.div
      className={`relative ${cardSizes[size]} ${isInteractive ? 'cursor-pointer' : ''} perspective-1000`}
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      onClick={isInteractive ? onReveal : undefined}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ rotateY: isRevealed ? '180deg' : '0deg' }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-xl border-2 border-[#4a4a6a] bg-[#1a1a2e] overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-full border border-[#4a4a6a]"
                  />
                ))}
              </div>
            </div>
            {/* Center Emblem */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-[#4a4a6a] flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-[#4a4a6a]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl border-2 border-[#4a4a6a] bg-[#1a1a2e] overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={size === 'sm' ? 140 : size === 'md' ? 280 : 320}
              height={size === 'sm' ? 240 : size === 'md' ? 480 : 520}
              className="w-full h-full object-cover"
              unoptimized
            />
            {position && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-sm text-white/70 mb-1">
                  {position}
                </div>
                <div className="text-lg font-medium text-white">
                  {name}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 