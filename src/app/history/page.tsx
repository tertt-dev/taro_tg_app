'use client';

import { useTelegram } from '@/components/TelegramProvider';

export default function HistoryPage() {
  const { isAuthenticated } = useTelegram();

  if (!isAuthenticated) {
    return null;
  }

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

  return (
    <div className="min-h-screen text-white font-cormorant">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-center mb-8">
          История раскладов
        </h2>

        <div className="space-y-4">
          {MOCK_READINGS.map((reading) => (
            <div 
              key={reading.id} 
              className="relative flex flex-col p-4 rounded-xl bg-black/80 backdrop-blur-[30px] border border-white/10 hover:bg-black/90 transition-all duration-200 group overflow-hidden z-20"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium font-cormorant">{reading.type}</h3>
                  <span className="text-sm text-muted-foreground font-cormorant">{reading.date}</span>
                </div>
                <div className="text-muted-foreground font-cormorant">
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