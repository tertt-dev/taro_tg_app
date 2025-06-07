'use client'

import { BottomNav } from '@/components/BottomNav'
import { TelegramProvider } from '@/components/TelegramProvider'
import dynamic from 'next/dynamic'

// Load ParticlesBackground only on client side
const ClientParticlesBackground = dynamic(
  () => import('@/components/ParticlesBackground').then(mod => ({ default: mod.ParticlesBackground })),
  { ssr: false }
)

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <div className="fixed inset-0 z-0">
        <ClientParticlesBackground />
      </div>
      <main className="relative z-10">
        {children}
      </main>
      <BottomNav />
    </TelegramProvider>
  )
} 