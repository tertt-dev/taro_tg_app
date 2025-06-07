'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onHistoryClick?: () => void;
}

export const Header = ({ onHistoryClick }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== '/';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative text-center py-8 space-y-2"
    >
      <div className="absolute left-4 top-4 flex items-center gap-4">
        {showBackButton && (
          <motion.button
            onClick={() => router.back()}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {onHistoryClick && (
        <motion.button
          onClick={onHistoryClick}
          className="absolute right-4 top-4 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      )}
      
      <motion.h1
        className="text-4xl md:text-5xl font-serif text-white"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        Врата Судьбы
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.2 }}
        className="text-sm md:text-base text-zinc-400"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Получи своё предсказание сегодня
      </motion.p>
    </motion.header>
  );
}; 