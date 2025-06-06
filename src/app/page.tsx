'use client';

import { SpreadSelector, SpreadType } from '@/components/SpreadSelector';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSpreadSelect = (spread: SpreadType) => {
    router.push(`/prediction/${spread.id}`);
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Выберите расклад
      </h1>
      <SpreadSelector onSelect={handleSpreadSelect} />
    </div>
  );
}
