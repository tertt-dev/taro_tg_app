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
          <div className="w-full h-full glass-panel overflow-hidden border-2 border-[var(--accent-silver)] bg-gradient-to-br from-[#1a1a2e] to-[#000000]">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-[var(--accent-silver)] opacity-20"
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
              </svg>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full glass-panel overflow-hidden border-2 border-[var(--accent-gold)]">
            <div className="relative w-full h-full p-4 flex flex-col">
              <div className="relative flex-1 mb-4">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes={`(max-width: ${size === 'sm' ? '140px' : size === 'md' ? '280px' : '320px'}) 100vw`}
                  priority
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{name}</h3>
                {position && (
                  <div className="text-sm text-[var(--text-secondary)] mb-2">{position}</div>
                )}
                <p className="text-sm text-[var(--text-secondary)]">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 