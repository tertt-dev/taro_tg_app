'use client'

import { BottomNav } from '@/components/BottomNav'
import { TelegramProvider } from '@/components/TelegramProvider'
import dynamic from 'next/dynamic'
import { GlobalStyles } from './GlobalStyles'

// Load ParticlesBackground only on client side
const ParticlesBackground = dynamic(
  () => import('@/components/ParticlesBackground').then(mod => ({ default: mod.ParticlesBackground })),
  { ssr: false }
)

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <GlobalStyles />
      <div className="fixed inset-0 z-0">
        <ParticlesBackground />
        <div className="grain" />
      </div>
      <main className="relative z-10 min-h-screen pb-20">
        {children}
      </main>
      <BottomNav />
    </TelegramProvider>
  )
} 