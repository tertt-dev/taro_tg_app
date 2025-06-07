'use client'

import { VideoBackground } from '@/components/VideoBackground'
import { BottomNav } from '@/components/BottomNav'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background layer */}
      <div className="fixed inset-0 bg-black z-0" />
      
      {/* Video background layer */}
      <div className="fixed inset-0 z-10">
        <VideoBackground />
      </div>
      
      {/* Content layer */}
      <main className="flex-1 relative z-20">
        {children}
      </main>
      
      {/* Navigation layer */}
      <div className="relative z-50">
        <BottomNav />
      </div>
    </div>
  )
} 