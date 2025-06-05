import { motion } from 'framer-motion';
import Image from 'next/image';

interface TarotCardProps {
  name: string;
  image?: string;
  isReversed?: boolean;
  isInteractive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-24 h-36',
  md: 'w-32 h-48',
  lg: 'w-48 h-72'
};

export const TarotCard = ({ 
  name, 
  image = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`, 
  isReversed = false, 
  isInteractive = true,
  size = 'md',
  onClick 
}: TarotCardProps) => {
  return (
    <motion.div
      whileHover={isInteractive ? { scale: 1.05, y: -5 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${sizeClasses[size]} cursor-pointer`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-xl backdrop-blur-sm border border-zinc-700/50" />
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isReversed ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full rounded-xl bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center justify-center p-4"
      >
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain rounded-lg opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
        {isReversed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-zinc-800 rounded-full"
          >
            <span className="text-zinc-400 text-sm">↻</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}; 