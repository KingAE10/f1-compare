'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

interface Props {
  label: string
  value: number
  accent: string
  glow: string
  delay?: number
  suffix?: string
}

export default function StatCard({ label, value, accent, glow, delay = 0, suffix = '' }: Props) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numRef.current) return
    gsap.fromTo(
      numRef.current,
      { innerText: 0 },
      {
        innerText: value,
        duration: 1.5,
        delay,
        ease: 'power2.out',
        snap: { innerText: value % 1 === 0 ? 1 : 0.1 },
        onUpdate() {
          if (numRef.current) {
            const v = parseFloat(numRef.current.innerText)
            numRef.current.innerText =
              value % 1 === 0 ? Math.round(v).toString() : v.toFixed(1)
          }
        },
      }
    )
  }, [value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl p-3 text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accent}11, ${accent}05)`,
        border: `1px solid ${accent}33`,
        boxShadow: `0 0 12px ${glow}11`,
      }}
    >
      <p className="text-[10px] uppercase tracking-widest opacity-50 text-white mb-1">{label}</p>
      <p className="text-2xl font-black text-white">
        <span ref={numRef}>0</span>
        {suffix}
      </p>
    </motion.div>
  )
}