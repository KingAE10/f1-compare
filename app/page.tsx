'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import BackgroundMesh from '@/components/BackgroundMesh'
import DriverSelector from '@/components/DriverSelector'
import DriverPanel from '@/components/DriverPanel'
import DriverRadar from '@/components/RadarChart'
import StatBar from '@/components/StatBar'

import { DRIVERS } from '@/data/drivers'
import { getThemeForDriver } from '@/lib/themes'
import { DriverTheme } from '@/types'

const HEAD_TO_HEAD_STATS = [
  { label: 'Race Wins',           key: 'wins'          },
  { label: 'Pole Positions',      key: 'poles'         },
  { label: 'Podiums',             key: 'podiums'       },
  { label: 'World Championships', key: 'championships' },
  { label: 'Fastest Laps',        key: 'fastestLaps'   },
  { label: 'Career Points',       key: 'points'        },
  { label: 'Win %',               key: 'careerWinPct'  },
] as const

export default function Home() {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null])
  const [carDone, setCarDone] = useState(false)

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

  function handleSelect(slotIndex: number, id: string | null) {
    setSlots(prev => { const n = [...prev]; n[slotIndex] = id; return n })
  }

  const showComparison = selectedDrivers.length >= 2

  return (
    <main className="min-h-screen text-white overflow-x-hidden pb-24">
      <BackgroundMesh themes={activeMeshThemes} />

      {/* ── F1 CAR INTRO ANIMATION ───────────────────────────────────── */}
      <AnimatePresence>
        {!carDone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {}}
          >
            {/* Dark overlay for intro */}
            <motion.div
              className="absolute inset-0"
              style={{ background: '#07070f' }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            />

            {/* F1 Car SVG flying across */}
            <motion.div
              className="absolute"
              style={{ top: '48%' }}
              initial={{ x: '-120vw', opacity: 0 }}
              animate={{ x: '130vw', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.4, ease: [0.2, 0.0, 0.8, 1.0], delay: 0.2 }}
              onAnimationComplete={() => setCarDone(true)}
            >
              {/* Motion blur trail */}
              <div
                className="absolute inset-y-0 right-0 w-64 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(220,0,0,0.4) 0%, transparent 100%)',
                  filter: 'blur(8px)',
                  transform: 'scaleX(-1)',
                }}
              />

              {/* F1 Car SVG */}
              <svg
                viewBox="0 0 240 60"
                width="320"
                height="80"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 0 16px #DC0000cc)' }}
              >
                {/* Body */}
                <ellipse cx="120" cy="30" rx="90" ry="14" fill="#1a1a2e" />
                {/* Nose */}
                <polygon points="210,30 240,33 240,27" fill="#DC0000" />
                {/* Cockpit */}
                <ellipse cx="110" cy="22" rx="28" ry="9" fill="#0a0a1a" />
                <ellipse cx="110" cy="20" rx="22" ry="5" fill="#1a1a3a" opacity="0.8" />
                {/* Front wing */}
                <rect x="195" y="37" width="35" height="5" rx="2" fill="#DC0000" />
                <rect x="198" y="35" width="30" height="3" rx="1" fill="#ff4444" opacity="0.6" />
                {/* Rear wing */}
                <rect x="30" y="12" width="40" height="4" rx="2" fill="#DC0000" />
                <rect x="45" y="16" width="10" height="14" fill="#DC0000" opacity="0.8" />
                {/* Front left wheel */}
                <ellipse cx="185" cy="40" rx="10" ry="10" fill="#111" stroke="#333" strokeWidth="2" />
                <ellipse cx="185" cy="40" rx="5" ry="5" fill="#222" />
                {/* Front right wheel */}
                <ellipse cx="185" cy="20" rx="10" ry="10" fill="#111" stroke="#333" strokeWidth="2" />
                <ellipse cx="185" cy="20" rx="5" ry="5" fill="#222" />
                {/* Rear left wheel */}
                <ellipse cx="70" cy="40" rx="12" ry="12" fill="#111" stroke="#333" strokeWidth="2" />
                <ellipse cx="70" cy="40" rx="6" ry="6" fill="#222" />
                {/* Rear right wheel */}
                <ellipse cx="70" cy="20" rx="12" ry="12" fill="#111" stroke="#333" strokeWidth="2" />
                <ellipse cx="70" cy="20" rx="6" ry="6" fill="#222" />
                {/* Red accent stripe */}
                <rect x="80" y="27" width="100" height="6" rx="3" fill="#DC0000" opacity="0.7" />
                {/* Halo */}
                <path d="M 95 20 Q 110 14 125 20" stroke="#gold" strokeWidth="2" fill="none" stroke="#aaa" opacity="0.6" />
              </svg>
            </motion.div>

            {/* Speed lines during intro */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px"
                style={{
                  top: `${30 + i * 8}%`,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(220,0,0,0.4), transparent)',
                  opacity: 0.6,
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
              />
            ))}

            {/* MATRIX text reveal */}
            <motion.div
              className="absolute text-center"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [1.2, 1, 1, 1] }}
              transition={{ duration: 1.8, times: [0, 0.3, 0.7, 1] }}
            >
              <p
                className="text-8xl font-black tracking-tighter"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  color: '#DC0000',
                  textShadow: '0 0 80px #DC0000, 0 0 160px #DC000066',
                }}
              >
                F1
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: carDone ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* ── HERO HEADER ──────────────────────────────────────────── */}
        <header className="relative pt-10 pb-6 px-4 overflow-hidden">

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* Corner brackets */}
          {[['top-4 left-4', 'top-0 left-0', 'top-0 left-0'], ['top-4 right-4', 'top-0 right-0', 'top-0 right-0']].map(([pos, hPos, vPos], ci) => (
            <div key={ci} className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
              <div className={`absolute ${hPos} w-full h-[2px] bg-red-600/50`} />
              <div className={`absolute ${vPos} h-full w-[2px] bg-red-600/50`} />
            </div>
          ))}

          {/* Horizontal accent lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-700/30 to-transparent" />

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-3"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600/50" />
            <span className="text-[9px] tracking-[0.6em] text-white/25 uppercase">Formula 1 · Analytics</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600/50" />
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-center"
          >
            <h1
              className="font-black tracking-tighter uppercase leading-none"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 'clamp(64px, 12vw, 140px)',
              }}
            >
              <span
                style={{
                  color: '#DC0000',
                  textShadow: '0 0 40px #DC000077',
                }}
              >
                F1
              </span>
              {' '}
              <span className="text-white">RIVAL</span>
              <br />
              <span
                className="text-white/80"
                style={{ fontSize: '0.65em', letterSpacing: '0.15em' }}
              >
                MATRIX
              </span>
            </h1>

            <p className="text-[9px] tracking-[0.6em] text-white/20 uppercase mt-2">
              Select drivers · Compare stats · Find the GOAT
            </p>
          </motion.div>

          {/* Animated underline */}
          <motion.div
            className="mx-auto mt-4 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #DC0000, transparent)' }}
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </header>

        {/* ── DRIVER SELECTOR AREA ─────────────────────────────────── */}
        <section className="px-4 pb-8">

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[9px] tracking-[0.5em] text-white/20 uppercase mb-6"
          >
            ── Choose your drivers ──
          </motion.p>

          {/* 3 large selector cards */}
          <div className="flex justify-center gap-5 flex-wrap">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
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

          {/* Prompt */}
          <AnimatePresence>
            {selectedDrivers.length < 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/15 text-xs tracking-widest uppercase mt-8"
              >
                {selectedDrivers.length === 0
                  ? '↑ Pick at least 2 drivers to begin'
                  : '↑ Add one more driver to compare'}
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        {/* ── COMPARISON ───────────────────────────────────────────── */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto px-4 space-y-6"
            >

              {/* Driver Cards */}
              <div className={`grid gap-4 ${selectedDrivers.length === 3 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
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

              {/* Head to Head */}
              <GlassSection
                title="Head to Head"
                subtitle="Career statistics"
                right={
                  <div className="flex gap-4">
                    {selectedDrivers.map(d => {
                      const t = getThemeForDriver(d.id)
                      return (
                        <div key={d.id} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.accent, boxShadow: `0 0 6px ${t.glow}` }} />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">{d.lastName}</span>
                        </div>
                      )
                    })}
                  </div>
                }
              >
                <div className="pt-4">
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
              </GlassSection>

              {/* Radar */}
              <GlassSection title="Performance Radar" subtitle="Normalized across selected drivers">
                <div className="pt-2">
                  <DriverRadar drivers={selectedDrivers} themes={themesMap} />
                  <div className="flex justify-center gap-6 mt-2 flex-wrap">
                    {selectedDrivers.map(d => {
                      const t = getThemeForDriver(d.id)
                      return (
                        <div key={d.id} className="flex items-center gap-2">
                          <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: t.accent, boxShadow: `0 0 4px ${t.glow}` }} />
                          <span className="text-xs text-white/40 uppercase tracking-widest">{d.lastName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </GlassSection>

              {/* Verdict */}
              <Verdict drivers={selectedDrivers} />

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}

/* ─── Glass section wrapper ──────────────────────────────────────── */
function GlassSection({
  title, subtitle, children, right,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="px-6 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black uppercase tracking-[0.15em]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {title}
          </h2>
          {subtitle && <p className="text-[9px] text-white/25 tracking-widest uppercase mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  )
}

/* ─── Verdict ────────────────────────────────────────────────────── */
function Verdict({ drivers }: { drivers: NonNullable<(typeof DRIVERS)[number]>[] }) {
  const scores = drivers.map(d => {
    const s = d.stats
    return (
      s.championships * 15 + s.wins * 2 + s.poles * 1.5 +
      s.podiums * 0.8 + s.careerWinPct * 3 + (s.wetWeatherRating ?? 0) * 0.5
    )
  })
  const maxScore = Math.max(...scores)
  const winner = drivers[scores.indexOf(maxScore)]
  const theme = getThemeForDriver(winner.id)

  return (
    <div
      className="rounded-2xl overflow-hidden relative p-8 text-center"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}44, rgba(7,7,15,0.9))`,
        border: `1px solid ${theme.accent}33`,
        boxShadow: `0 0 60px ${theme.glow}11`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${theme.glow}11 0%, transparent 70%)` }} />

      <p className="text-[9px] uppercase tracking-[0.5em] text-white/25 mb-4">── Matrix Verdict ──</p>

      <div className="flex justify-center gap-10 mb-6">
        {drivers.map((d, i) => {
          const t = getThemeForDriver(d.id)
          const pct = Math.round((scores[i] / maxScore) * 100)
          const isWinner = d.id === winner.id
          return (
            <div key={d.id} className="flex flex-col items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: isWinner ? t.accent : 'rgba(255,255,255,0.3)' }}>
                {d.lastName}
              </p>
              <div className="relative h-16 w-8 bg-white/5 rounded-full overflow-hidden flex items-end">
                <motion.div className="w-full rounded-full" style={{ background: `linear-gradient(0deg, ${t.primary}, ${t.accent})` }}
                  initial={{ height: 0 }} animate={{ height: `${pct}%` }} transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }} />
              </div>
              <p className="text-xs font-black" style={{ color: isWinner ? t.accent : 'rgba(255,255,255,0.25)', fontFamily: 'Rajdhani, sans-serif' }}>
                {pct}%
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-5xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: theme.accent, textShadow: `0 0 30px ${theme.glow}88` }}>
        {winner.name}
      </p>
      <p className="text-[10px] text-white/20 mt-2 tracking-widest uppercase">Leads across weighted career metrics</p>
    </div>
  )
}