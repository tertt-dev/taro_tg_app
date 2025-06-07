'use client';

import { Header } from '@/components/Header';
import { motion } from 'framer-motion';

const MOCK_READINGS = [
  {
    id: 1,
    type: 'Любовный расклад',
    date: '2024-03-20',
    cards: ['Влюбленные', 'Колесо Фортуны', 'Звезда'],
  },
  {
    id: 2,
    type: 'Расклад на день',
    date: '2024-03-19',
    cards: ['Маг'],
  },
  {
    id: 3,
    type: 'Карьерный расклад',
    date: '2024-03-18',
    cards: ['Император', 'Колесница', 'Мир'],
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen text-white font-cormorant">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-center mb-8">
          История раскладов
        </h2>

        <div className="space-y-4">
          {MOCK_READINGS.map((reading) => (
            <div key={reading.id} className="relative rounded-xl p-4 overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-zinc-900"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
              </div>
              <div className="relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium">{reading.type}</h3>
                  <span className="text-sm text-zinc-400">{reading.date}</span>
                </div>
                <div className="text-zinc-300">
                  Карты: {reading.cards.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 