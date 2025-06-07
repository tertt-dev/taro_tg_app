'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTelegram } from '@/components/TelegramProvider';

const DECK = {
  name: 'Классическое Таро Райдера-Уэйта',
  description: 'Самая известная и универсальная колода Таро, созданная в 1909 году. Каждая карта наполнена символизмом и глубоким смыслом, что делает её идеальной как для начинающих, так и для опытных тарологов.',
  cardCount: 78,
  previewCards: [
    '/Cards-png/RWS_Tarot_01_Magician.png',
    '/Cards-png/RWS_Tarot_02_High_Priestess.png',
    '/Cards-png/RWS_Tarot_03_Empress.png',
    '/Cards-png/RWS_Tarot_04_Emperor.png',
  ]
};

export default function DeckPage() {
  const { user } = useTelegram();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gold-text">Колода Таро</h1>
            <p className="text-gray-400">
              Добро пожаловать, {user?.first_name}
            </p>
          </div>
          
          <div className="glass-panel overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
              {DECK.previewCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-[2/3] rounded overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Image
                    src={card}
                    alt={`Preview card ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-3">{DECK.name}</h2>
              <p className="text-gray-300 mb-6">{DECK.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{DECK.cardCount} карт</span>
                <Link 
                  href="/prediction"
                  className="mystic-button"
                >
                  Начать расклад
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 