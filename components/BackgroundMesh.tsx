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
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bgRef.current) return
    const gradient = blendGradients(themes)
    gsap.to(bgRef.current, {
      background: gradient,
      duration: 1.4,
      ease: 'power2.inOut',
    })
  }, [themes])

  return (
    <>
      {/* Animated gradient background */}
      <div
        ref={bgRef}
        className="fixed inset-0 -z-20 transition-all"
        style={{ background: '#050505' }}
      />

      {/* Grid overlay */}
      <div
        ref={gridRef}
        className="fixed inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Motion streaks */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px opacity-20"
            style={{
              top: `${15 + i * 14}%`,
              left: 0,
              right: 0,
              background: themes[i % themes.length]
                ? `linear-gradient(90deg, transparent, ${themes[i % themes.length]?.accent || '#fff'}, transparent)`
                : 'linear-gradient(90deg, transparent, #ffffff33, transparent)',
              animation: `streak ${3 + i * 0.7}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}