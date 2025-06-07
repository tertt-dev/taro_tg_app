'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTelegram } from '@/components/TelegramProvider';
import { SpreadSelector } from '@/components/SpreadSelector';
import { type SpreadType } from '@/components/SpreadSelector';

export default function PredictionPage() {
  const router = useRouter();
  const { user } = useTelegram();

  const handleSpreadSelect = (spread: SpreadType) => {
    router.push(`/prediction/${spread.id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Расклады</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 gold-text">Выберите расклад</h1>
              <p className="text-gray-400 mb-8">
                Здравствуйте, {user?.first_name}! Выберите тип расклада, который лучше всего подходит для вашего вопроса
              </p>
            </div>

            <SpreadSelector onSelect={handleSpreadSelect} />
          </motion.div>
        </div>
      </main>
    </div>
  );
} 