'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { type Prediction } from '@/utils/predictions';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  predictions: Prediction[];
}

export function HistoryPanel({ isOpen, onClose, predictions }: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-black/80 backdrop-blur-lg border-l border-white/10 p-6 z-50"
    >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">История предсказаний</h2>
        <button
          onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
              <X className="w-5 h-5" />
        </button>
      </div>

          <div className="space-y-4">
        {predictions.map((prediction) => (
          <motion.div
                key={prediction.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 rounded-lg p-4"
          >
                <div className="text-sm text-muted-foreground mb-2">
                  {prediction.date}
                </div>
                <div className="flex gap-2 mb-3">
                {prediction.cards.map((card, index) => (
                    <div
                      key={`${prediction.date}-${index}`}
                      className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center text-xs"
                    >
                      {card.name}
                    </div>
                ))}
              </div>
                <p className="text-sm text-muted-foreground">
                  {prediction.text}
                </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );
} 