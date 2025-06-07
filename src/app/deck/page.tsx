'use client';

import { useTelegram } from '@/components/TelegramProvider';
import Image from 'next/image';
import Link from 'next/link';

const DECK = {
  id: 'rider-waite',
  name: 'Райдер-Уэйт',
  description: 'Классическая колода Таро, созданная в 1909 году. Идеально подходит как для начинающих, так и для опытных тарологов. Содержит 78 карт с богатой символикой и глубоким значением.',
  cardCount: 78,
  previewCards: [
    '/Cards-png/00-TheFool.png',
    '/Cards-png/06-TheLovers.png',
    '/Cards-png/21-TheWorld.png',
    '/Cards-png/CardBacks.png',
  ]
};

export default function DeckPage() {
  const { isAuthenticated, user } = useTelegram();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-500">Колода Таро</h1>
          <p className="text-gray-400">
            Добро пожаловать, {user?.first_name}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
            {DECK.previewCards.map((card, index) => (
              <div key={index} className="relative aspect-[2/3] rounded overflow-hidden">
                <Image
                  src={card}
                  alt={`Preview card ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-3">{DECK.name}</h2>
            <p className="text-gray-300 mb-6">{DECK.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{DECK.cardCount} карт</span>
              <Link 
                href="/prediction"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Начать расклад
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-purple-500 mb-6">О колоде</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Старшие арканы</h3>
              <p className="text-gray-300">22 карты, представляющие основные жизненные уроки и архетипы</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Младшие арканы</h3>
              <p className="text-gray-300">56 карт, отражающие повседневные ситуации и влияния</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Масти</h3>
              <p className="text-gray-300">Жезлы, Кубки, Мечи и Пентакли, каждая со своим значением</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 