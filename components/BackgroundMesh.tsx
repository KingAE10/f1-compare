'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DriverTheme } from '@/types'
import { blendGradients } from '@/lib/themes'

interface Props {
  themes: DriverTheme[]
}

export default function BackgroundMesh({ themes }: Props) {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bgRef.current) return
    const gradient = themes.length > 0
      ? blendGradients(themes)
      : `radial-gradient(ellipse at 20% 50%, #3d0000 0%, transparent 55%),
         radial-gradient(ellipse at 80% 20%, #0a0018 0%, transparent 55%),
         radial-gradient(ellipse at 50% 90%, #001133 0%, transparent 55%),
         #07070f`
    gsap.to(bgRef.current, {
      background: gradient,
      duration: 1.6,
      ease: 'power2.inOut',
    })
  }, [themes])

  return (
    <>
      {/* Base gradient — dark navy/maroon, never pure black */}
      <div
        ref={bgRef}
        className="fixed inset-0 -z-30"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, #3d0000 0%, transparent 55%),
                       radial-gradient(ellipse at 80% 20%, #0a0018 0%, transparent 55%),
                       radial-gradient(ellipse at 50% 90%, #001133 0%, transparent 55%),
                       #07070f`,
        }}
      />

      {/* Grid lines */}
      <div
        className="fixed inset-0 -z-20 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,60,60,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,60,60,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Diagonal speed streaks */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              top: `${8 + i * 11}%`,
              left: '-100%',
              right: '-100%',
              opacity: 0.15 + (i % 3) * 0.05,
              background: themes[i % Math.max(themes.length, 1)]
                ? `linear-gradient(90deg, transparent 0%, ${themes[i % themes.length]?.accent || '#ff3333'} 50%, transparent 100%)`
                : `linear-gradient(90deg, transparent 0%, #ff333366 50%, transparent 100%)`,
              animation: `streak ${2.5 + i * 0.6}s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette edges */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </>
  )
}