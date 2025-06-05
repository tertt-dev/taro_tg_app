import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GlobalStyles } from "@/components/GlobalStyles";
import { TelegramScript } from "@/components/TelegramScript";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

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
        <TelegramScript />
        <GlobalStyles />
        {children}
      </body>
    </html>
  );
}
