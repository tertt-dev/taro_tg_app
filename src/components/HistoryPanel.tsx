import { motion } from 'framer-motion';
import { TarotCard } from './TarotCard';

interface Prediction {
  id: string;
  card: {
    name: string;
    image: string;
    isReversed: boolean;
    currentMeaning: string;
  };
  date: string;
}

interface HistoryPanelProps {
  predictions: Prediction[];
}

export const HistoryPanel = ({ predictions }: HistoryPanelProps) => {
  if (!predictions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-4"
    >
      <h3 className="text-xl text-zinc-300 mb-4 font-serif">История предсказаний</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        {predictions.map((prediction) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <TarotCard
              name={prediction.card.name}
              image={prediction.card.image}
              isReversed={prediction.card.isReversed}
              size="sm"
              isInteractive={false}
            />
            <p className="text-xs text-zinc-500 mt-2 text-center">
              {new Date(prediction.date).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}; 