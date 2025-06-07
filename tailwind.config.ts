import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'accent-gold': 'var(--accent-gold)',
        'accent-silver': 'var(--accent-silver)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        cormorant: ['Cormorant', 'serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'mystic': '0 0 15px rgba(212, 175, 55, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      perspective: {
        'none': 'none',
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'visible': 'visible',
        'hidden': 'hidden',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.perspective-none': {
          perspective: 'none',
        },
        '.perspective-500': {
          perspective: '500px',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
        '.transform-style-preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-visible': {
          backfaceVisibility: 'visible',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
      })
    }),
  ],
}

export default config 