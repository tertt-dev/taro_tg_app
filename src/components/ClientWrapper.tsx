'use client'

import { ParticlesBackground } from '@/components/ParticlesBackground'
import { BottomNav } from '@/components/BottomNav'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background layer */}
      <div className="fixed inset-0 bg-black -z-30" />
      
      {/* Particles layer */}
      <div className="fixed inset-0 -z-20">
        <ParticlesBackground />
      </div>
      
      {/* Content layer */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      {/* Navigation layer */}
      <div className="relative z-50">
        <BottomNav />
      </div>
    </div>
  )
} 