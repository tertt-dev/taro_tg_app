'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="relative w-12 h-12">
      <motion.div
        className="absolute inset-0 border-2 border-[var(--accent-gold)] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-0 border-2 border-[var(--accent-silver)] rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.3, 0.1],
          rotate: -360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-4 flex items-center justify-center text-[var(--accent-gold)]"
        animate={{
          opacity: [1, 0.5, 1],
          scale: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✧
      </motion.div>
    </div>
  )
} 