import './globals.css'
import { Inter, Cormorant, DM_Sans } from 'next/font/google'
import { ParticlesBackground } from '@/components/ParticlesBackground'
import { BottomNav } from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const cormorant = Cormorant({ 
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700']
})
const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
})

export const metadata = {
  title: 'Таро Предсказания',
  description: 'Узнайте свое будущее с помощью карт Таро',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${cormorant.variable} ${dmSans.variable} min-h-screen overflow-x-hidden bg-black`}>
        <main className="relative z-0">
          {children}
        </main>
        <div className="fixed inset-0 z-[5] pointer-events-none">
          <ParticlesBackground />
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
