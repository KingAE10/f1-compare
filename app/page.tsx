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

const MAX_SLOTS = 3
const SLOT_LABELS = ['Driver 1', 'Driver 2', 'Driver 3']

// Stats shown in the Head-to-Head section
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
  // Each slot holds a driver ID or null
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null])

  // Resolve selected driver objects (skip null slots)
  const selectedDrivers = useMemo(
    () =>
      slots
        .map(id => (id ? DRIVERS.find(d => d.id === id) ?? null : null))
        .filter(Boolean) as NonNullable<(typeof DRIVERS)[number]>[],
    [slots]
  )

  // Build a themes map keyed by driver ID
  const themesMap = useMemo<Record<string, DriverTheme>>(
    () =>
      Object.fromEntries(
        selectedDrivers.map(d => [d.id, getThemeForDriver(d.id)])
      ),
    [selectedDrivers]
  )

  // Background mesh receives the themes of selected drivers
  const activeMeshThemes = useMemo(
    () => selectedDrivers.map(d => getThemeForDriver(d.id)),
    [selectedDrivers]
  )

  // IDs already chosen (to disable in other selectors)
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
      {/* ── Animated Background ─────────────────────────────────────── */}
      <BackgroundMesh themes={activeMeshThemes} />

      {/* ── Hero Header ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center pt-16 pb-10 px-4 relative"
      >
        {/* Decorative top line */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/60" />
          <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-medium">
            Formula 1
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/60" />
        </div>

        <h1
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          F1{' '}
          <span
            className="relative"
            style={{
              color: '#DC0000',
              textShadow: '0 0 40px #DC000066',
            }}
          >
            Rival
          </span>{' '}
          Matrix
        </h1>

        <p className="mt-4 text-white/30 tracking-[0.3em] text-xs uppercase">
          Select up to 3 drivers · Compare stats · Find the GOAT
        </p>
      </motion.header>

      {/* ── Driver Selector Row ──────────────────────────────────────── */}
      <section className="flex justify-center gap-4 px-4 flex-wrap">
        {SLOT_LABELS.map((_, slotIndex) => (
          <motion.div
            key={slotIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + slotIndex * 0.1, duration: 0.5 }}
          >
            <DriverSelector
              slotIndex={slotIndex}
              drivers={DRIVERS}
              selectedId={slots[slotIndex]}
              onSelect={id => handleSelect(slotIndex, id)}
              theme={slots[slotIndex] ? getThemeForDriver(slots[slotIndex]!) : null}
              disabledIds={chosenIds.filter(id => id !== slots[slotIndex])}
            />
          </motion.div>
        ))}
      </section>

      {/* ── Prompt when nothing selected ────────────────────────────── */}
      <AnimatePresence>
        {selectedDrivers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-24 text-white/20"
          >
            <p className="text-4xl mb-2">🏎️</p>
            <p className="text-sm tracking-widest uppercase">
              Pick at least 2 drivers to begin
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt when only 1 driver selected ──────────────────────── */}
      <AnimatePresence>
        {selectedDrivers.length === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-24 text-white/20"
          >
            <p className="text-sm tracking-widest uppercase">
              Add one more driver to compare
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full Comparison Layout ───────────────────────────────────── */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-7xl mx-auto px-4 mt-14 space-y-8"
          >
            {/* ── Driver Panels ──────────────────────────────────────── */}
            <div
              className={`grid gap-4 ${
                selectedDrivers.length === 3
                  ? 'grid-cols-1 md:grid-cols-3'
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

            {/* ── Radar Chart ────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl p-6 border border-white/8"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <SectionHeader
                title="Performance Radar"
                subtitle="Normalized across all selected drivers"
              />
              <DriverRadar drivers={selectedDrivers} themes={themesMap} />

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {selectedDrivers.map(d => (
                  <div key={d.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getThemeForDriver(d.id).accent,
                        boxShadow: `0 0 6px ${getThemeForDriver(d.id).glow}`,
                      }}
                    />
                    <span className="text-xs text-white/50 uppercase tracking-widest">
                      {d.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Head to Head Stat Bars ─────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="rounded-2xl p-6 border border-white/8"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <SectionHeader
                title="Head to Head"
                subtitle="Career statistics comparison"
              />

              {HEAD_TO_HEAD_STATS.map((stat, i) => (
                <StatBar
                  key={stat.key}
                  label={stat.label}
                  statKey={stat.key as keyof (typeof selectedDrivers)[number]['stats']}
                  drivers={selectedDrivers}
                  themes={themesMap}
                />
              ))}
            </motion.section>

            {/* ── Quick Verdict ──────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="rounded-2xl p-6 border border-white/8 text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
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

/* ─── Sub-components ─────────────────────────────────────────────── */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-8">
      <h2
        className="text-2xl font-black uppercase tracking-[0.15em] text-white"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-white/30 tracking-widest mt-1 uppercase">{subtitle}</p>
      )}
      <div className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

function Verdict({
  drivers,
}: {
  drivers: NonNullable<(typeof DRIVERS)[number]>[]
}) {
  // Simple GOAT score: weighted sum of normalized stats
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
    <>
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3">
        Matrix Verdict
      </p>
      <p
        className="text-4xl font-black uppercase tracking-tight"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: theme.accent }}
      >
        {winner.name}
      </p>
      <p className="text-xs text-white/30 mt-2 tracking-widest">
        Leads across weighted career metrics
      </p>
    </>
  )
}