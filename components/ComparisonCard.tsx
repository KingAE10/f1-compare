'use client'

import { motion } from 'framer-motion'
import { Driver } from '@/types'
import { getThemeForDriver } from '@/lib/themes'

const STATS = [
  { label: 'Race Wins',     key: 'wins'          },
  { label: 'Poles',         key: 'poles'         },
  { label: 'Podiums',       key: 'podiums'       },
  { label: 'Championships', key: 'championships' },
  { label: 'Fastest Laps',  key: 'fastestLaps'   },
  { label: 'Points',        key: 'points'        },
  { label: 'Win %',         key: 'careerWinPct'  },
] as const

interface Props {
  drivers: Driver[]
}

export default function ComparisonCard({ drivers }: Props) {
  const themes  = drivers.map(d => getThemeForDriver(d.id))
  const is2     = drivers.length === 2
  const photoH  = is2 ? 320 : 260

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{
        background: 'rgba(7,7,15,0.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 0 80px rgba(0,0,0,0.6)',
      }}
    >

      {/* ── PHOTO STRIP ──────────────────────────────────────────── */}
      <div className="flex w-full" style={{ height: `${photoH}px` }}>
        {drivers.map((driver, i) => {
          const theme = themes[i]
          return (
            <div key={driver.id} className="flex flex-1">

              {/* Vertical divider between drivers */}
              {i > 0 && (
                <div
                  className="relative flex-shrink-0 flex flex-col items-center justify-center"
                  style={{ width: '1px', background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)' }}
                >
                  {/* VS / · badge */}
                  <div
                    className="absolute font-black text-[10px] tracking-[0.3em] px-2 py-1 rounded z-10"
                    style={{
                      background: '#07070f',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {is2 ? 'VS' : '·'}
                  </div>
                </div>
              )}

              {/* Driver photo card */}
              <motion.div
                className="relative flex-1 overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{
                  background: `linear-gradient(160deg, ${theme.primary}55 0%, rgba(7,7,15,0.7) 100%)`,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] z-10"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${theme.accent}cc, transparent)`,
                  }}
                />

                {/* Driver number watermark */}
                {driver.number > 0 && (
                  <div
                    className="absolute top-3 right-4 font-black leading-none pointer-events-none select-none"
                    style={{
                      fontSize: '5rem',
                      color: `${theme.accent}18`,
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {driver.number}
                  </div>
                )}

                {/* Flag top-left */}
                <div className="absolute top-4 left-4 z-10 text-2xl">
                  {driver.flag}
                </div>

                {/* Photo */}
                {(driver as any).photo && (
                  <img
                    src={(driver as any).photo}
                    alt={driver.name}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 object-contain object-bottom pointer-events-none"
                    style={{
                      height: '88%',
                      width: 'auto',
                      maxWidth: '100%',
                      filter: `drop-shadow(0 0 24px ${theme.glow}44)`,
                    }}
                  />
                )}

                {/* Bottom name overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 z-10"
                  style={{
                    background: `linear-gradient(0deg, ${theme.primary}dd 0%, transparent 100%)`,
                  }}
                >
                  <p
                    className="text-[9px] tracking-[0.4em] uppercase font-bold mb-0.5"
                    style={{ color: theme.accent, opacity: 0.85 }}
                  >
                    {driver.team}
                  </p>
                  <h3
                    className="font-black leading-none"
                    style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: is2 ? '1.8rem' : '1.4rem',
                      color: '#fff',
                    }}
                  >
                    {driver.firstName}{' '}
                    <span style={{ color: theme.accent, textShadow: `0 0 20px ${theme.glow}88` }}>
                      {driver.lastName.toUpperCase()}
                    </span>
                  </h3>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* ── DIVIDER ──────────────────────────────────────────────── */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
      />

      {/* ── STATS ────────────────────────────────────────────────── */}
      <div className="px-6 py-4">

        {/* Column headers */}
        <div
          className="grid mb-3 pb-2"
          style={{
            gridTemplateColumns: is2 ? '1fr 120px 1fr' : '1fr',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {is2 ? (
            <>
              <span
                className="text-[9px] tracking-[0.35em] uppercase font-bold"
                style={{ color: themes[0].accent }}
              >
                {drivers[0].lastName.toUpperCase()}
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 text-center">
                STAT
              </span>
              <span
                className="text-[9px] tracking-[0.35em] uppercase font-bold text-right"
                style={{ color: themes[1].accent }}
              >
                {drivers[1].lastName.toUpperCase()}
              </span>
            </>
          ) : (
            <div className="flex gap-6">
              {drivers.map((d, i) => (
                <span
                  key={d.id}
                  className="text-[9px] tracking-[0.35em] uppercase font-bold"
                  style={{ color: themes[i].accent }}
                >
                  {d.lastName.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stat rows */}
        <div className="space-y-0">
          {STATS.map((stat, si) => {
            const values = drivers.map(
              d => (d.stats[stat.key as keyof typeof d.stats] as number) ?? 0
            )
            const maxVal   = Math.max(...values)
            const winnerIdx = values.indexOf(maxVal)
            const isTie    = values.every(v => v === maxVal)

            return is2 ? (
              <TwoDriverRow
                key={stat.key}
                label={stat.label}
                values={values}
                themes={themes}
                winnerIdx={isTie ? -1 : winnerIdx}
                maxVal={maxVal}
                delay={si * 0.04}
              />
            ) : (
              <ThreeDriverRow
                key={stat.key}
                label={stat.label}
                values={values}
                themes={themes}
                winnerIdx={isTie ? -1 : winnerIdx}
                maxVal={maxVal}
                drivers={drivers}
                delay={si * 0.04}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── 2-driver mirror row ─────────────────────────────────────────── */
function TwoDriverRow({
  label, values, themes, winnerIdx, maxVal, delay,
}: {
  label: string
  values: number[]
  themes: ReturnType<typeof getThemeForDriver>[]
  winnerIdx: number
  maxVal: number
  delay: number
}) {
  const fmt = (v: number) => (v % 1 !== 0 ? v.toFixed(1) : String(v))
  const pct = (v: number) => (maxVal > 0 ? (v / maxVal) * 100 : 0)

  return (
    <motion.div
      className="grid items-center py-2.5"
      style={{
        gridTemplateColumns: '1fr 120px 1fr',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Left driver */}
      <div className="flex flex-col items-end gap-1.5 pr-3">
        <span
          className="text-2xl font-black leading-none"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            color: winnerIdx === 0 ? themes[0].accent : 'rgba(255,255,255,0.18)',
            textShadow: winnerIdx === 0 ? `0 0 20px ${themes[0].glow}` : 'none',
          }}
        >
          {fmt(values[0])}
        </span>
        {/* Bar fills RIGHT → LEFT (toward center) */}
        <div className="w-full h-[3px] rounded-full bg-white/5 overflow-hidden flex justify-end">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: winnerIdx === 0
                ? `linear-gradient(90deg, transparent, ${themes[0].accent})`
                : 'rgba(255,255,255,0.07)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct(values[0])}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.15 }}
          />
        </div>
      </div>

      {/* Center label */}
      <div className="text-center px-2">
        <span className="text-[9px] tracking-[0.35em] uppercase text-white/25">
          {label}
        </span>
      </div>

      {/* Right driver */}
      <div className="flex flex-col gap-1.5 pl-3">
        <span
          className="text-2xl font-black leading-none"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            color: winnerIdx === 1 ? themes[1].accent : 'rgba(255,255,255,0.18)',
            textShadow: winnerIdx === 1 ? `0 0 20px ${themes[1].glow}` : 'none',
          }}
        >
          {fmt(values[1])}
        </span>
        {/* Bar fills LEFT → RIGHT (toward center) */}
        <div className="w-full h-[3px] rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: winnerIdx === 1
                ? `linear-gradient(90deg, ${themes[1].accent}, transparent)`
                : 'rgba(255,255,255,0.07)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct(values[1])}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.15 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ── 3-driver stacked row ────────────────────────────────────────── */
function ThreeDriverRow({
  label, values, themes, winnerIdx, maxVal, drivers, delay,
}: {
  label: string
  values: number[]
  themes: ReturnType<typeof getThemeForDriver>[]
  winnerIdx: number
  maxVal: number
  drivers: Driver[]
  delay: number
}) {
  const fmt = (v: number) => (v % 1 !== 0 ? v.toFixed(1) : String(v))

  return (
    <motion.div
      className="py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <p className="text-[8px] tracking-[0.5em] uppercase text-white/20 mb-2.5">
        {label}
      </p>
      <div className="space-y-2">
        {drivers.map((d, i) => {
          const val       = values[i]
          const pct       = maxVal > 0 ? (val / maxVal) * 100 : 0
          const isWinner  = i === winnerIdx
          const t         = themes[i]

          return (
            <div key={d.id} className="flex items-center gap-3">
              {/* Name */}
              <span
                className="text-[9px] uppercase tracking-wider font-bold flex-shrink-0"
                style={{
                  width: '80px',
                  textAlign: 'right',
                  color: isWinner ? t.accent : 'rgba(255,255,255,0.2)',
                }}
              >
                {d.lastName.toUpperCase()}
              </span>

              {/* Bar */}
              <div className="flex-1 h-[3px] rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isWinner ? t.accent : 'rgba(255,255,255,0.08)',
                    boxShadow: isWinner ? `0 0 8px ${t.glow}` : 'none',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.15 }}
                />
              </div>

              {/* Value */}
              <span
                className="text-base font-black flex-shrink-0"
                style={{
                  width: '48px',
                  fontFamily: 'Rajdhani, sans-serif',
                  color: isWinner ? t.accent : 'rgba(255,255,255,0.2)',
                  textShadow: isWinner ? `0 0 14px ${t.glow}` : 'none',
                }}
              >
                {fmt(val)}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}