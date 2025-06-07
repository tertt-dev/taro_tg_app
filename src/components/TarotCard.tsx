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
  showDescription?: boolean;
  cardNumber?: string;
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
  showDescription = false,
  cardNumber,
}: TarotCardProps) {
  const cardSizes = {
    sm: 'w-[140px] h-[240px]',
    md: 'w-[280px] h-[480px]',
    lg: 'w-[320px] h-[520px]'
  };

  const imageSizes = {
    sm: { width: 140, height: 240 },
    md: { width: 280, height: 480 },
    lg: { width: 320, height: 520 }
  };

  const handleClick = () => {
    if (isInteractive && !isRevealed) {
      onReveal();
    }
  };

  return (
    <motion.div
      className={`relative ${cardSizes[size]} ${isInteractive ? 'cursor-pointer' : ''} perspective-1000`}
      whileHover={isInteractive && !isRevealed ? { scale: 1.02 } : undefined}
      whileTap={isInteractive && !isRevealed ? { scale: 0.98 } : undefined}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative transform-style-preserve-3d transition-transform duration-700"
        animate={{ rotateY: isRevealed ? '180deg' : '0deg' }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-xl border-2 border-[#6a4a7a] bg-gradient-to-br from-[#1a1a2e] via-[#2a1a3e] to-[#1a1a2e] overflow-hidden">
            <Image
              src="/Cards-png/CardBacks.png"
              alt="Card Back"
              width={imageSizes[size].width}
              height={imageSizes[size].height}
              className="w-full h-full object-cover"
              priority={true}
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#2a1a3e]/30 to-[#1a1a2e]/30" />
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl border-2 border-[#4a4a6a] bg-[#1a1a2e] overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={imageSizes[size].width}
              height={imageSizes[size].height}
              className="w-full h-full object-cover"
              loading="lazy"
              quality={90}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              {position && (
                <div className="text-sm text-white/70 mb-1">
                  {position}
                </div>
              )}
              <div className="text-lg font-medium text-white flex items-center gap-2">
                {cardNumber && (
                  <span className="text-sm text-white/70">{cardNumber}</span>
                )}
                {name}
              </div>
              {showDescription && (
                <p className="text-sm text-white/70 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 