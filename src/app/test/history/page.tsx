'use client';

import { Header } from '@/components/Header';
import { motion } from 'framer-motion';

const mockHistory = [
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
    <div className="min-h-screen bg-black text-white font-cormorant">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h2 className="text-2xl font-medium text-center mb-8">
          История раскладов
        </h2>

        <div className="space-y-4">
          {mockHistory.map((reading) => (
            <motion.div
              key={reading.id}
              className="bg-white/5 rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{reading.type}</h3>
                <span className="text-sm text-white/60">{reading.date}</span>
              </div>
              <div className="text-white/80">
                Карты: {reading.cards.join(', ')}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 