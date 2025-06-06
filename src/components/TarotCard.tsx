'use client'

import { useState } from 'react';
import Image from 'next/image';

interface TarotCardProps {
  name: string;
  image: string;
  isRevealed?: boolean;
  onReveal?: () => void;
}

export function TarotCard({ name, image, isRevealed = false, onReveal }: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onReveal && !isRevealed) {
      onReveal();
    }
  };

  return (
    <div
      className="relative w-[280px] h-[480px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : ''
        }}
      >
        {/* Front of card (Back side of tarot) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
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

        {/* Back of card (Front side with image) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative w-full h-full glass-panel overflow-hidden border-2 border-[var(--accent-gold)]">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 280px) 100vw, 280px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 