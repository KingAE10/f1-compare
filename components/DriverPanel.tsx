'use client'
import { motion } from 'framer-motion'
import { Driver, DriverTheme } from '@/types'
import StatCard from './StatCard'

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
        background: `linear-gradient(135deg, ${theme.primary}55, ${theme.secondary}44, rgba(0,0,0,0.85))`,
        border: `1px solid ${theme.accent}55`,
        boxShadow: `0 0 60px ${theme.glow}22, inset 0 1px 0 ${theme.accent}33`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
      />

      {/* Driver number watermark */}
      <div
        className="absolute bottom-0 right-2 text-[120px] font-black pointer-events-none select-none leading-none"
        style={{ color: `${theme.accent}08`, fontFamily: 'Rajdhani, sans-serif' }}
      >
        {driver.number > 0 ? driver.number : ''}
      </div>

      {/* ── Main layout: image LEFT · info RIGHT ── */}
      <div className="flex">

        {/* Left: Driver photo */}
        <div className="relative w-44 flex-shrink-0 overflow-hidden" style={{ minHeight: '280px' }}>
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `radial-gradient(ellipse at center bottom, ${theme.glow}44 0%, transparent 65%)`,
            }}
          />
          <img
            src={driver.image}
            alt={driver.name}
            className="w-full h-full object-cover object-top"
            style={{ minHeight: '280px' }}
            onError={e => {
              ;(e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${driver.firstName}+${driver.lastName}&background=111&color=fff&size=256`
            }}
          />
          {/* Fade to stats */}
          <div
            className="absolute inset-y-0 right-0 w-10 z-20"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}dd)` }}
          />
        </div>

        {/* Right: Identity + Stats */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">

          {/* Identity block */}
          <div className="mb-2">
            <p
              className="text-[10px] tracking-[0.3em] uppercase font-semibold"
              style={{ color: theme.accent }}
            >
              {driver.flag} {driver.nationality}
            </p>
            <h3
              className="text-3xl font-black text-white leading-none tracking-tight mt-1"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {driver.firstName.toUpperCase()}
              <br />
              <span style={{ color: theme.accent }}>{driver.lastName.toUpperCase()}</span>
            </h3>
            <p className="text-[10px] text-white/40 mt-1 tracking-widest uppercase">{driver.team}</p>
            {!driver.active && (
              <span
                className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider border"
                style={{ color: theme.accent, borderColor: `${theme.accent}44` }}
              >
                Legend
              </span>
            )}
          </div>

          {/* Divider */}
          <div
            className="mb-2 h-px"
            style={{ background: `linear-gradient(90deg, ${theme.accent}66, transparent)` }}
          />

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-1.5">
            <StatCard label="Titles"       value={driver.stats.championships}    accent={theme.accent} glow={theme.glow} delay={0.1}  />
            <StatCard label="Wins"         value={driver.stats.wins}             accent={theme.accent} glow={theme.glow} delay={0.15} />
            <StatCard label="Podiums"      value={driver.stats.podiums}          accent={theme.accent} glow={theme.glow} delay={0.2}  />
            <StatCard label="Poles"        value={driver.stats.poles}            accent={theme.accent} glow={theme.glow} delay={0.25} />
            <StatCard label="Fastest Laps" value={driver.stats.fastestLaps}      accent={theme.accent} glow={theme.glow} delay={0.3}  />
            <StatCard label="Points"       value={driver.stats.points}           accent={theme.accent} glow={theme.glow} delay={0.35} />
            <StatCard label="Avg Quali"    value={driver.stats.avgQualifyingPos} accent={theme.accent} glow={theme.glow} delay={0.4}  />
            <StatCard label="Win %"        value={driver.stats.careerWinPct}     accent={theme.accent} glow={theme.glow} delay={0.45} suffix="%" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}