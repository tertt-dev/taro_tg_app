'use client';

import { useTelegram } from '@/components/TelegramProvider';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { SpreadSelector, type SpreadType } from '@/components/SpreadSelector';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, user } = useTelegram();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  const handleSpreadSelect = (spreadType: SpreadType) => {
    router.push(`/prediction?spread=${spreadType.id}`);
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <ParticlesBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        <h1 className="text-3xl font-bold text-purple-500 mb-6 text-center">
          Добро пожаловать, {user?.first_name}!
        </h1>
        <p className="text-lg mb-8 text-center">
          Выберите расклад, чтобы начать гадание
        </p>
        <SpreadSelector onSelect={handleSpreadSelect} />
      </motion.div>
    </main>
  );
}
