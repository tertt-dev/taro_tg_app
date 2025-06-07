'use client';

import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TAROT_CARDS } from '@/utils/predictions';

export default function DeckPage() {
  return (
    <div className="min-h-screen bg-black text-white font-cormorant">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-2xl font-medium text-center mb-8">
          Колода Таро
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TAROT_CARDS.map((card) => (
            <motion.div
              key={card.cardNumber}
              className="relative aspect-[2/3] rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                <div className="text-center">
                  <span className="text-sm text-gray-300">{card.cardNumber}</span>
                  <h3 className="text-lg">{card.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 