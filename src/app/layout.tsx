import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Таро Предсказания",
  description: "Получите ваше персональное предсказание на картах Таро",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
