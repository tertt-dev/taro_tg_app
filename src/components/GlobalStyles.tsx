'use client';

import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'] });

export const GlobalStyles = () => {
  return (
    <style jsx global>{`
      .font-serif {
        font-family: ${playfair.style.fontFamily};
      }
    `}</style>
  );
}; 