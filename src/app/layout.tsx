import type { Metadata } from "next";
import { RootLayoutClient } from "@/components/RootLayoutClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Врата Судьбы | Таро предсказания",
  description: "Получите персональное предсказание на картах Таро",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
