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
    const gradient =
      themes.length > 0
        ? blendGradients(themes)
        : `radial-gradient(ellipse at 20% 50%, #5a0000 0%, transparent 65%),
           radial-gradient(ellipse at 80% 20%, #120025 0%, transparent 65%),
           radial-gradient(ellipse at 50% 90%, #001a33 0%, transparent 65%),
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
          background: `radial-gradient(ellipse at 20% 50%, #5a0000 0%, transparent 65%),
                       radial-gradient(ellipse at 80% 20%, #120025 0%, transparent 65%),
                       radial-gradient(ellipse at 50% 90%, #001a33 0%, transparent 65%),
                       #07070f`,
        }}
      />

      {/* Red radial spotlight — left anchor */}
      <div
        className="fixed -z-29 pointer-events-none"
        style={{
          top: '10%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #DC000033 0%, #DC000011 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Purple radial spotlight — top right */}
      <div
        className="fixed -z-29 pointer-events-none"
        style={{
          top: '-5%',
          right: '-5%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2a006688 0%, #1a003322 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Grid lines */}
      <div
        className="fixed inset-0 -z-20 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,60,60,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,60,60,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Diagonal speed streaks */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              top: `${5 + i * 9.5}%`,
              left: '-100%',
              right: '-100%',
              opacity: 0.2 + (i % 3) * 0.08,
              background:
                themes.length > 0
                  ? `linear-gradient(90deg, transparent 0%, ${themes[i % themes.length]?.accent || '#ff3333'}99 50%, transparent 100%)`
                  : `linear-gradient(90deg, transparent 0%, #ff333399 50%, transparent 100%)`,
              animation: `streak ${2.2 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom edge glow */}
      <div
        className="fixed bottom-0 left-0 right-0 -z-10 pointer-events-none"
        style={{
          height: '30vh',
          background: 'linear-gradient(0deg, rgba(100,0,0,0.15) 0%, transparent 100%)',
        }}
      />

      {/* Vignette edges */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)',
        }}
      />
    </>
  )
}