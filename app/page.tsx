'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import BackgroundMesh from '@/components/BackgroundMesh'
import DriverSelector from '@/components/DriverSelector'
import DriverPanel from '@/components/DriverPanel'
import DriverRadar from '@/components/RadarChart'
import StatBar from '@/components/StatBar'

import { DRIVERS } from '@/data/drivers'
import { DRIVER_THEMES, getThemeForDriver } from '@/lib/themes'
import { DriverTheme } from '@/types'

const HEAD_TO_HEAD_STATS = [
  { label: 'Race Wins',           key: 'wins'            },
  { label: 'Pole Positions',      key: 'poles'           },
  { label: 'Podiums',             key: 'podiums'         },
  { label: 'World Championships', key: 'championships'   },
  { label: 'Fastest Laps',        key: 'fastestLaps'     },
  { label: 'Career Points',       key: 'points'          },
  { label: 'Win %',               key: 'careerWinPct'    },
] as const

export default function Home() {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null])

  const selectedDrivers = useMemo(
    () =>
      slots
        .map(id => (id ? DRIVERS.find(d => d.id === id) ?? null : null))
        .filter(Boolean) as NonNullable<(typeof DRIVERS)[number]>[],
    [slots]
  )

  const themesMap = useMemo<Record<string, DriverTheme>>(
    () => Object.fromEntries(selectedDrivers.map(d => [d.id, getThemeForDriver(d.id)])),
    [selectedDrivers]
  )

  const activeMeshThemes = useMemo(
    () => selectedDrivers.map(d => getThemeForDriver(d.id)),
    [selectedDrivers]
  )

  const chosenIds = slots.filter(Boolean) as string[]

  function handleSelect(slotIndex: number, driverId: string | null) {
    setSlots(prev => {
      const next = [...prev]
      next[slotIndex] = driverId
      return next
    })
  }

  const showComparison = selectedDrivers.length >= 2

  return (
    <main className="min-h-screen text-white overflow-x-hidden pb-24">
      <BackgroundMesh themes={activeMeshThemes} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <header className="relative pt-12 pb-8 px-4 overflow-hidden">

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)',
          }}
        />

        {/* Corner brackets — top left */}
        <div className="absolute top-6 left-6 w-10 h-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/60" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-red-500/60" />
        </div>
        {/* Corner brackets — top right */}
        <div className="absolute top-6 right-6 w-10 h-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-red-500/60" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-red-500/60" />
        </div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-red-500/50" />
          <span className="text-[10px] tracking-[0.5em] text-white/30 uppercase">Formula 1 · Analytics</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-red-500/50" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          F1{' '}
          <span
            style={{
              color: '#DC0000',
              textShadow: '0 0 60px #DC000077, 0 0 120px #DC000033',
            }}
          >
            RIVAL
          </span>
          <br />
          <span className="text-white/90">MATRIX</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] tracking-[0.5em] text-white/25 uppercase mt-3"
        >
          Select up to 3 drivers · Compare stats · Find the GOAT
        </motion.p>
      </header>

      {/* ── SELECTOR SECTION ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mb-6">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] tracking-[0.4em] text-white/20 uppercase mb-5"
        >
          ── Choose your drivers ──
        </motion.p>

        <div className="flex justify-center gap-4 flex-wrap">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <DriverSelector
                slotIndex={i}
                drivers={DRIVERS}
                selectedId={slots[i]}
                onSelect={id => handleSelect(i, id)}
                theme={slots[i] ? getThemeForDriver(slots[i]!) : null}
                disabledIds={chosenIds.filter(id => id !== slots[i])}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── EMPTY STATE ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDrivers.length < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-16 px-4"
          >
            {/* Decorative grid lines */}
            <div className="relative mx-auto w-48 h-48 mb-8 opacity-10">
              <div className="absolute inset-0 border border-white/20 rounded-full" />
              <div className="absolute inset-4 border border-white/10 rounded-full" />
              <div className="absolute inset-8 border border-white/10 rounded-full" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">
                🏎️
              </div>
            </div>
            <p className="text-white/20 text-sm tracking-widest uppercase">
              {selectedDrivers.length === 0
                ? 'Select 2 or 3 drivers above to begin'
                : 'Add one more driver to compare'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COMPARISON ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4 mt-4 space-y-6"
          >

            {/* ── Driver Cards ─────────────────────────────────────── */}
            <div
              className={`grid gap-4 ${
                selectedDrivers.length === 3
                  ? 'grid-cols-1 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {selectedDrivers.map((driver, i) => (
                  <DriverPanel
                    key={driver.id}
                    driver={driver}
                    theme={getThemeForDriver(driver.id)}
                    panelIndex={i}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* ── Head to Head ─────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Section header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-xl font-black uppercase tracking-[0.15em]"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      Head to Head
                    </h2>
                    <p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">
                      Career statistics
                    </p>
                  </div>
                  {/* Driver color dots */}
                  <div className="flex gap-3">
                    {selectedDrivers.map(d => {
                      const t = getThemeForDriver(d.id)
                      return (
                        <div key={d.id} className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: t.accent, boxShadow: `0 0 6px ${t.glow}` }}
                          />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">
                            {d.lastName}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Stat bars */}
              <div className="px-6 py-5">
                {HEAD_TO_HEAD_STATS.map(stat => (
                  <StatBar
                    key={stat.key}
                    label={stat.label}
                    statKey={stat.key as keyof (typeof selectedDrivers)[number]['stats']}
                    drivers={selectedDrivers}
                    themes={themesMap}
                  />
                ))}
              </div>
            </motion.section>

            {/* ── Performance Radar ────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="px-6 pt-6 pb-4 border-b border-white/5">
                <h2
                  className="text-xl font-black uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  Performance Radar
                </h2>
                <p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">
                  Normalized across selected drivers
                </p>
              </div>

              <div className="px-4 pt-2 pb-4">
                <DriverRadar drivers={selectedDrivers} themes={themesMap} />

                {/* Custom legend */}
                <div className="flex justify-center gap-6 mt-2 flex-wrap">
                  {selectedDrivers.map(d => {
                    const t = getThemeForDriver(d.id)
                    return (
                      <div key={d.id} className="flex items-center gap-2">
                        <div
                          className="w-8 h-[2px] rounded-full"
                          style={{ backgroundColor: t.accent, boxShadow: `0 0 6px ${t.glow}` }}
                        />
                        <span className="text-xs text-white/50 uppercase tracking-widest">
                          {d.lastName}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.section>

            {/* ── Matrix Verdict ───────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl overflow-hidden relative"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Verdict drivers={selectedDrivers} />
            </motion.section>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

/* ─── Matrix Verdict ─────────────────────────────────────────────── */
function Verdict({ drivers }: { drivers: NonNullable<(typeof DRIVERS)[number]>[] }) {
  const scores = drivers.map(d => {
    const s = d.stats
    return (
      s.championships * 15 +
      s.wins * 2 +
      s.poles * 1.5 +
      s.podiums * 0.8 +
      s.careerWinPct * 3 +
      (s.wetWeatherRating ?? 0) * 0.5
    )
  })

  const maxScore = Math.max(...scores)
  const winner = drivers[scores.indexOf(maxScore)]
  const theme = getThemeForDriver(winner.id)

  return (
    <div
      className="relative overflow-hidden p-8 text-center"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}33, rgba(0,0,0,0.7))`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.glow}11 0%, transparent 70%)`,
        }}
      />

      <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3">
        ── Matrix Verdict ──
      </p>

      {/* Score bars */}
      <div className="flex justify-center gap-8 mb-6">
        {drivers.map((d, i) => {
          const t = getThemeForDriver(d.id)
          const pct = Math.round((scores[i] / maxScore) * 100)
          const isWinner = d.id === winner.id
          return (
            <div key={d.id} className="flex flex-col items-center gap-2">
              <p
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: isWinner ? t.accent : 'rgba(255,255,255,0.3)' }}
              >
                {d.lastName}
              </p>
              <div className="relative h-20 w-10 bg-white/5 rounded-full overflow-hidden flex items-end">
                <motion.div
                  className="w-full rounded-full"
                  style={{ background: `linear-gradient(0deg, ${t.primary}, ${t.accent})` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <p
                className="text-xs font-bold"
                style={{ color: isWinner ? t.accent : 'rgba(255,255,255,0.3)' }}
              >
                {pct}%
              </p>
            </div>
          )
        })}
      </div>

      <p
        className="text-5xl font-black uppercase tracking-tight"
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          color: theme.accent,
          textShadow: `0 0 30px ${theme.glow}88`,
        }}
      >
        {winner.name}
      </p>
      <p className="text-xs text-white/25 mt-2 tracking-widest uppercase">
        Leads across weighted career metrics
      </p>
    </div>
  )
}