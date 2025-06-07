'use client'

export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/wave.mp4" type="video/mp4" />
      </video>
    </div>
  )
} 