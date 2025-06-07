'use client'

import { useCallback } from 'react'
import { Particles } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      particlesInit={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        particles: {
          color: {
            value: '#ff3366',
          },
          links: {
            color: '#ff3366',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          number: {
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
      }}
      className="absolute inset-0"
    />
  )
} 