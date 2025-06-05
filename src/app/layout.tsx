import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Врата Судьбы | Таро предсказания",
  description: "Получите персональное предсказание на картах Таро",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://api.dicebear.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <style jsx global>{`
          .font-serif {
            font-family: ${playfair.style.fontFamily};
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}
