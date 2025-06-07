'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SpreadSelector } from '@/components/SpreadSelector';

export default function TestPage() {
  const router = useRouter();

  const handleSpreadSelect = (spread: any) => {
    router.push(`/test/prediction/${spread.id}`);
  };

  return (
    <div className="min-h-screen text-white font-cormorant">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h2 className="text-2xl font-medium text-center mb-8">
          Выберите расклад
        </h2>
        <SpreadSelector onSelect={handleSpreadSelect} />
      </main>
    </div>
  );
} 