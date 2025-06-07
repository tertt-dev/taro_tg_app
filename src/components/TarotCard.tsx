'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface TarotCardProps {
  name: string;
  description?: string;
  image: string;
  cardNumber?: string;
  position?: string;
  isRevealed: boolean;
  onReveal: () => void;
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  showDescription?: boolean;
}

const sizeClasses = {
  sm: 'w-[200px] h-[325px]',
  md: 'w-[260px] h-[422px]',
  lg: 'w-full h-full aspect-[320/520]'
} as const;

export function TarotCard({ 
  name, 
  description, 
  image, 
  cardNumber,
  position,
  isRevealed,
  onReveal,
  size = 'md',
  isInteractive = true,
  showDescription = false,
}: TarotCardProps) {
  const handleClick = () => {
    if (isInteractive && !isRevealed) {
      onReveal();
    }
  };

  return (
    <div className={`relative cursor-pointer perspective-1000 ${sizeClasses[size]}`}>
      <div 
        className={`w-full h-full relative transform-style-preserve-3d transition-transform duration-700 ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
        onClick={handleClick}
      >
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-xl border-2 border-[#6a4a7a] bg-gradient-to-br from-[#1a1a2e] via-[#2a1a3e] to-[#1a1a2e] overflow-hidden">
            <Image
              src="/Cards-png/CardBacks.png"
              alt="Card Back"
              width={320}
              height={520}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#2a1a3e]/30 to-[#1a1a2e]/30" />
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl border-2 border-[#4a4a6a] bg-[#1a1a2e] overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={320}
              height={520}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              {position && (
                <div className="text-sm text-white/70 mb-1 font-cormorant">
                  {position}
                </div>
              )}
              <div className="text-lg font-medium text-white flex items-center gap-2 font-cormorant">
                {cardNumber && (
                  <span className="text-sm text-white/70">{cardNumber}</span>
                )}
                {name}
              </div>
              {showDescription && (
                <p className="text-sm text-white/70 mt-1 line-clamp-2 font-cormorant">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 