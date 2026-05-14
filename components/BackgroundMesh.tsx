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

export default function DriverSelector({
  slotIndex,
  drivers,
  selectedId,
  onSelect,
  theme,
  disabledIds,
}: Props) {
  const [open, setOpen] = useState(false)
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
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full relative overflow-hidden rounded-2xl text-left transition-all duration-300"
        style={{
          height: '180px',
          background: selected && theme
            ? `linear-gradient(135deg, ${theme.primary}66, ${theme.secondary}44, rgba(5,5,15,0.9))`
            : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: `1px solid ${theme ? theme.accent + '66' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: theme
            ? `0 0 40px ${theme.glow}33, inset 0 1px 0 ${theme.accent}22`
            : '0 0 20px rgba(255,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Slot number watermark */}
        <div
          className="absolute top-2 left-4 font-black text-6xl leading-none pointer-events-none select-none"
          style={{
            color: theme ? `${theme.accent}18` : 'rgba(255,40,40,0.1)',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {SLOT_NUMBERS[slotIndex]}
        </div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: theme
              ? `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`
              : 'linear-gradient(90deg, transparent, rgba(220,0,0,0.5), transparent)',
          }}
        />

        {selected && theme ? (
          /* ── Selected state ── */
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            {/* Flag + number top right */}
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <span className="text-2xl">{selected.flag}</span>
              {selected.number > 0 && (
                <span
                  className="text-xs font-black opacity-50"
                  style={{ color: theme.accent, fontFamily: 'Rajdhani, sans-serif' }}
                >
                  #{selected.number}
                </span>
              )}
            </div>

            {/* Driver name */}
            <div>
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-0.5"
                style={{ color: theme.accent }}
              >
                {selected.team}
              </p>
              <h3
                className="text-3xl font-black leading-none text-white"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {selected.firstName}
                <br />
                <span style={{ color: theme.accent }}>{selected.lastName.toUpperCase()}</span>
              </h3>
            </div>

            {/* Bottom glow line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.accent}88, transparent)`,
              }}
            />
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {/* Animated plus */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-thin"
              style={{
                border: '1px dashed rgba(220,0,0,0.3)',
                color: 'rgba(220,0,0,0.5)',
                boxShadow: '0 0 20px rgba(220,0,0,0.1)',
              }}
            >
              +
            </div>
            <div className="text-center">
              <p
                className="text-xs tracking-[0.4em] uppercase font-bold"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Driver {slotIndex + 1}
              </p>
              <p className="text-[10px] text-white/15 tracking-widest uppercase mt-0.5">
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
            background: 'rgba(0,0,0,0.5)',
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
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
            }}
          >
            {/* Search */}
            <div className="p-3 border-b border-white/8">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search driver..."
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm outline-none border border-white/10 focus:border-red-500/40 placeholder:text-white/20 transition-all"
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
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
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
                    <span className="text-white/20 font-black text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
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