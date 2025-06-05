import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 space-y-2"
    >
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