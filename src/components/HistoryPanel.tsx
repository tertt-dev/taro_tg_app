import { motion } from 'framer-motion';
import { TarotCard } from './TarotCard';
import type { Prediction } from '@/utils/predictions';

interface HistoryPanelProps {
  predictions: Prediction[];
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPanel = ({ predictions, isOpen, onClose }: HistoryPanelProps) => {
  if (!isOpen || !predictions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed top-0 right-0 h-full w-full md:w-96 bg-black/95 backdrop-blur-lg p-6 shadow-xl z-50"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl text-zinc-300 font-serif">История предсказаний</h3>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {predictions.map((prediction) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 rounded-lg p-4"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {prediction.cards.map((card, index) => (
                  <TarotCard
                    key={index}
                    name={card.name}
                    image={`https://api.dicebear.com/7.x/identicon/svg?seed=${card.name.toLowerCase().replace(/\s+/g, '-')}`}
                    isReversed={card.isReversed}
                    size="sm"
                    isInteractive={false}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-zinc-400">{prediction.date}</p>
                <p className="text-sm text-zinc-300 mt-2">{prediction.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}; 