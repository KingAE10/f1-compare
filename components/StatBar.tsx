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
  const max = Math.max(...values, 1)

  // ── 2-driver battle layout ────────────────────────────────────────
  if (drivers.length === 2) {
    const [a, b] = drivers
    const [va, vb] = values
    const pctA = (va / max) * 100
    const pctB = (vb / max) * 100
    const themeA = themes[a.id]
    const themeB = themes[b.id]
    const aWins = va > vb
    const bWins = vb > va

    return (
      <div className="mb-4">
        {/* Stat label */}
        <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] text-center mb-2">
          {label}
        </p>

        <div className="flex items-center gap-2">
          {/* Driver A name + value */}
          <div className="w-28 text-right flex-shrink-0">
            <p
              className="text-xs font-bold uppercase tracking-wide truncate"
              style={{ color: aWins ? themeA.accent : 'rgba(255,255,255,0.4)' }}
            >
              {a.lastName}
            </p>
            <p
              className="text-lg font-black leading-none"
              style={{
                color: aWins ? themeA.accent : 'rgba(255,255,255,0.5)',
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: aWins ? `0 0 12px ${themeA.glow}` : 'none',
              }}
            >
              {typeof va === 'number' && va % 1 !== 0 ? va.toFixed(1) : va}
              {aWins && <span className="text-xs ml-1">▲</span>}
            </p>
          </div>

          {/* Battle bars — mirror from center */}
          <div className="flex-1 flex items-center gap-0.5 h-5">
            {/* A bar: grows from right to left */}
            <div className="flex-1 flex justify-end h-3 rounded-l-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full rounded-l-full"
                style={{
                  background: `linear-gradient(270deg, ${themeA.accent}, ${themeA.primary})`,
                  boxShadow: aWins ? `0 0 8px ${themeA.glow}88` : 'none',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pctA}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>

            {/* Center divider */}
            <div className="w-px h-5 bg-white/20 flex-shrink-0" />

            {/* B bar: grows from left to right */}
            <div className="flex-1 h-3 rounded-r-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full rounded-r-full"
                style={{
                  background: `linear-gradient(90deg, ${themeB.accent}, ${themeB.primary})`,
                  boxShadow: bWins ? `0 0 8px ${themeB.glow}88` : 'none',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pctB}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Driver B name + value */}
          <div className="w-28 text-left flex-shrink-0">
            <p
              className="text-xs font-bold uppercase tracking-wide truncate"
              style={{ color: bWins ? themeB.accent : 'rgba(255,255,255,0.4)' }}
            >
              {b.lastName}
            </p>
            <p
              className="text-lg font-black leading-none"
              style={{
                color: bWins ? themeB.accent : 'rgba(255,255,255,0.5)',
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: bWins ? `0 0 12px ${themeB.glow}` : 'none',
              }}
            >
              {bWins && <span className="text-xs mr-1">▲</span>}
              {typeof vb === 'number' && vb % 1 !== 0 ? vb.toFixed(1) : vb}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── 3-driver layout: stacked bars in a compact block ─────────────
  return (
    <div className="mb-4">
      <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-2">{label}</p>
      <div className="space-y-1.5">
        {drivers.map((driver, i) => {
          const val = values[i]
          const pct = (val / max) * 100
          const isTop = val === max
          const theme = themes[driver.id]

          return (
            <div key={driver.id} className="flex items-center gap-2">
              <span className="text-white/50 text-xs w-24 truncate text-right font-medium">
                {driver.lastName}
              </span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: isTop ? `0 0 8px ${theme.glow}88` : 'none',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.08 }}
                />
              </div>
              <span
                className="text-sm font-black w-16 text-right"
                style={{
                  color: isTop ? theme.accent : 'rgba(255,255,255,0.5)',
                  fontFamily: 'Rajdhani, sans-serif',
                  textShadow: isTop ? `0 0 8px ${theme.glow}` : 'none',
                }}
              >
                {typeof val === 'number' && val % 1 !== 0 ? val.toFixed(1) : val}
                {isTop && <span className="ml-1 text-[10px]">▲</span>}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}