'use client'

import { ParticlesBackground } from '@/components/ParticlesBackground'
import { BottomNav } from '@/components/BottomNav'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <ParticlesBackground />
      </div>
      <main className="relative z-10">
        {children}
      </main>
      <BottomNav />
    </>
  )
} 