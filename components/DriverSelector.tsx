'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Driver, DriverTheme } from '@/types'

interface Props {
  slotIndex: number
  drivers: Driver[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  theme: DriverTheme | null
  disabledIds: string[]
}

const SLOT_NUMBERS = ['01', '02', '03']
const SLOT_LABELS  = ['DRIVER ONE', 'DRIVER TWO', 'DRIVER THREE']

export default function DriverSelector({
  slotIndex,
  drivers,
  selectedId,
  onSelect,
  theme,
  disabledIds,
}: Props) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')

  const selected = drivers.find(d => d.id === selectedId) || null

  const filtered = drivers.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      !disabledIds.includes(d.id)
  )

  return (
    <div className="relative" style={{ width: '300px' }}>

      {/* ── Large trigger card ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.025, y: -3 }}
        whileTap={{ scale: 0.975 }}
        className="w-full relative overflow-hidden rounded-2xl text-left"
        style={{
          height: '180px',
          background: selected && theme
            ? `linear-gradient(135deg, ${theme.primary}88, ${theme.secondary}55, rgba(7,7,15,0.92))`
            : `linear-gradient(135deg, rgba(90,0,0,0.35) 0%, rgba(20,0,40,0.45) 50%, rgba(0,8,40,0.35) 100%)`,
          border: selected && theme
            ? `1px solid ${theme.accent}77`
            : '1px solid rgba(180,0,0,0.35)',
          boxShadow: selected && theme
            ? `0 0 50px ${theme.glow}44, 0 0 100px ${theme.glow}11, inset 0 1px 0 ${theme.accent}33`
            : '0 0 30px rgba(160,0,0,0.2), 0 0 60px rgba(100,0,0,0.1), inset 0 1px 0 rgba(255,60,60,0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Corner bracket — top left */}
        <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[2px]"
            style={{ background: selected && theme ? theme.accent : '#DC0000', opacity: 0.7 }} />
          <div className="absolute top-0 left-0 h-full w-[2px]"
            style={{ background: selected && theme ? theme.accent : '#DC0000', opacity: 0.7 }} />
        </div>
        {/* Corner bracket — bottom right */}
        <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[2px]"
            style={{ background: selected && theme ? theme.accent : '#DC0000', opacity: 0.7 }} />
          <div className="absolute bottom-0 right-0 h-full w-[2px]"
            style={{ background: selected && theme ? theme.accent : '#DC0000', opacity: 0.7 }} />
        </div>

        {/* Slot number watermark */}
        <div
          className="absolute top-1 left-3 font-black leading-none pointer-events-none select-none"
          style={{
            fontSize: '72px',
            color: selected && theme ? `${theme.accent}20` : 'rgba(220,0,0,0.18)',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {SLOT_NUMBERS[slotIndex]}
        </div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: selected && theme
              ? `linear-gradient(90deg, transparent, ${theme.accent}cc, transparent)`
              : 'linear-gradient(90deg, transparent, rgba(220,0,0,0.6), transparent)',
          }}
        />

        {selected && theme ? (
          /* ── Selected state ── */
          <div className="absolute inset-0 flex flex-col justify-end p-4">

            {/* Radial glow behind content */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 80% 60%, ${theme.glow}22 0%, transparent 65%)`,
              }}
            />

            {/* Flag + number */}
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <span className="text-2xl">{selected.flag}</span>
              {selected.number > 0 && (
                <span
                  className="text-sm font-black"
                  style={{
                    color: theme.accent,
                    fontFamily: 'Rajdhani, sans-serif',
                    textShadow: `0 0 12px ${theme.glow}`,
                    opacity: 0.7,
                  }}
                >
                  #{selected.number}
                </span>
              )}
            </div>

            {/* Driver name */}
            <div>
              <p
                className="text-[10px] tracking-[0.35em] uppercase mb-1 font-bold"
                style={{ color: theme.accent, opacity: 0.8 }}
              >
                {selected.team}
              </p>
              <h3
                className="font-black leading-none text-white"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '2rem',
                }}
              >
                {selected.firstName}
                <br />
                <span
                  style={{
                    color: theme.accent,
                    textShadow: `0 0 20px ${theme.glow}88`,
                    fontSize: '2.4rem',
                  }}
                >
                  {selected.lastName.toUpperCase()}
                </span>
              </h3>
            </div>

            {/* Bottom glow line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.accent}99, transparent)`,
              }}
            />
          </div>

        ) : (
          /* ── Empty state ── */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">

            {/* Inner ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(120,0,0,0.15) 0%, transparent 70%)',
              }}
            />

            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                border: '1px solid rgba(220,0,0,0.5)',
                boxShadow: '0 0 20px rgba(220,0,0,0.25), inset 0 0 20px rgba(180,0,0,0.1)',
                background: 'rgba(80,0,0,0.2)',
              }}
            >
              <span
                className="text-3xl font-thin leading-none"
                style={{
                  color: 'rgba(255,60,60,0.8)',
                  textShadow: '0 0 12px rgba(220,0,0,0.8)',
                }}
              >
                +
              </span>
            </motion.div>

            <div className="text-center">
              <p
                className="text-xs tracking-[0.45em] uppercase font-bold"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {SLOT_LABELS[slotIndex]}
              </p>
              <p
                className="text-[10px] tracking-widest uppercase mt-1"
                style={{ color: 'rgba(220,0,0,0.45)' }}
              >
                Tap to select
              </p>
            </div>
          </div>
        )}
      </motion.button>

      {/* Clear button */}
      {selected && (
        <button
          onClick={e => { e.stopPropagation(); onSelect(null) }}
          className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          ✕
        </button>
      )}

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(7,7,15,0.98)',
              border: '1px solid rgba(220,0,0,0.2)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 40px rgba(120,0,0,0.15)',
            }}
          >
            {/* Search */}
            <div className="p-3 border-b border-white/5">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search driver..."
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm outline-none border border-white/10 focus:border-red-600/50 placeholder:text-white/20 transition-all"
              />
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-center text-white/25 text-sm py-6">No drivers found</p>
              )}
              {filtered.map(driver => (
                <motion.button
                  key={driver.id}
                  whileHover={{ backgroundColor: 'rgba(180,0,0,0.1)' }}
                  onClick={() => { onSelect(driver.id); setOpen(false); setSearch('') }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/5 last:border-0 transition-all"
                >
                  <span className="text-xl">{driver.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight truncate">
                      {driver.name}
                    </p>
                    <p className="text-white/35 text-xs truncate">{driver.team}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-white/25 font-black text-base"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      {driver.number > 0 ? `#${driver.number}` : '—'}
                    </span>
                    {!driver.active && (
                      <p className="text-[9px] text-white/25 uppercase tracking-wider">Legend</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}