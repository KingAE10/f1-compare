'use client'
import { motion } from 'framer-motion'
import { Driver, DriverTheme } from '@/types'

interface Props {
  label: string
  statKey: keyof Driver['stats']
  drivers: Driver[]
  themes: Record<string, DriverTheme>
}

export default function StatBar({ label, statKey, drivers, themes }: Props) {
  const values = drivers.map(d => d.stats[statKey] as number)
  const max = Math.max(...values)
  const min = Math.min(...values)

  return (
    <div className="mb-6">
      <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-3">{label}</p>
      <div className="space-y-2">
        {drivers.map((driver, i) => {
          const val = values[i]
          const pct = max === 0 ? 0 : (val / max) * 100
          const isTop = val === max
          const isLow = val === min && max !== min
          const theme = themes[driver.id]

          return (
            <div key={driver.id} className="flex items-center gap-3 group">
              <span className="text-white/60 text-xs w-20 truncate text-right">
                {driver.lastName}
              </span>

              <div className="flex-1 h-3 rounded-full overflow-hidden bg-white/5">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: isTop ? `0 0 10px ${theme.glow}88` : 'none',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
                />
              </div>

              <span
                className="text-sm font-bold w-14 text-right"
                style={{
                  color: isTop ? theme.accent : isLow ? '#ff4444' : 'rgba(255,255,255,0.7)',
                  textShadow: isTop ? `0 0 10px ${theme.glow}` : 'none',
                }}
              >
                {typeof val === 'number' && val % 1 !== 0 ? val.toFixed(1) : val}
                {isTop && <span className="ml-1 text-[10px] opacity-70">▲</span>}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}