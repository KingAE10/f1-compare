'use client'
import { motion } from 'framer-motion'
import { Driver, DriverTheme } from '@/types'
import StatCard from './StatCard'
import Image from 'next/image'

interface Props {
  driver: Driver
  theme: DriverTheme
  panelIndex: number
}

export default function DriverPanel({ driver, theme, panelIndex }: Props) {
  return (
    <motion.div
      key={driver.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: panelIndex * 0.1 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: `linear-gradient(160deg, ${theme.primary}22, ${theme.secondary}33, rgba(0,0,0,0.6))`,
        border: `1px solid ${theme.accent}44`,
        boxShadow: `0 0 40px ${theme.glow}22, inset 0 1px 0 ${theme.accent}22`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
      />

      {/* Driver number watermark */}
      <div
        className="absolute top-4 right-4 text-8xl font-black pointer-events-none select-none leading-none"
        style={{ color: `${theme.accent}15` }}
      >
        {driver.number > 0 ? driver.number : ''}
      </div>

      {/* Header: image + identity */}
      <div className="p-5 pb-0 flex items-end gap-4">
        {/* Driver image */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 30px ${theme.glow}55` }}
          />
          <img
            src={driver.image}
            alt={driver.name}
            className="w-full h-full object-cover object-top rounded-xl"
            onError={e => {
              ;(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${driver.firstName}+${driver.lastName}&background=111&color=fff&size=128`
            }}
          />
        </div>

        {/* Identity */}
        <div className="pb-2 flex-1 min-w-0">
          <p
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-1"
            style={{ color: theme.accent }}
          >
            {driver.flag} {driver.nationality}
          </p>
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
            {driver.firstName}
            <br />
            {driver.lastName.toUpperCase()}
          </h3>
          <p className="text-xs text-white/40 mt-1 tracking-widest uppercase">{driver.team}</p>
          {!driver.active && (
            <span
              className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border"
              style={{ color: theme.accent, borderColor: `${theme.accent}44` }}
            >
              Legend
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-5 my-4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}44, transparent)` }}
      />

      {/* Stat grid */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2">
        <StatCard label="World Titles" value={driver.stats.championships} accent={theme.accent} glow={theme.glow} delay={0.1} />
        <StatCard label="Race Wins" value={driver.stats.wins} accent={theme.accent} glow={theme.glow} delay={0.15} />
        <StatCard label="Podiums" value={driver.stats.podiums} accent={theme.accent} glow={theme.glow} delay={0.2} />
        <StatCard label="Pole Positions" value={driver.stats.poles} accent={theme.accent} glow={theme.glow} delay={0.25} />
        <StatCard label="Fastest Laps" value={driver.stats.fastestLaps} accent={theme.accent} glow={theme.glow} delay={0.3} />
        <StatCard label="Career Points" value={driver.stats.points} accent={theme.accent} glow={theme.glow} delay={0.35} />
        <StatCard label="Avg Quali Pos" value={driver.stats.avgQualifyingPos} accent={theme.accent} glow={theme.glow} delay={0.4} suffix="" />
        <StatCard label="Win %" value={driver.stats.careerWinPct} accent={theme.accent} glow={theme.glow} delay={0.45} suffix="%" />
      </div>
    </motion.div>
  )
}