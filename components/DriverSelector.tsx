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

  const slotLabels = ['Driver 1', 'Driver 2', 'Driver 3']

  return (
    <div className="relative w-72">
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-xl p-4 text-left transition-all duration-300 relative overflow-hidden"
        style={{
          background: theme
            ? `linear-gradient(135deg, ${theme.primary}33, ${theme.secondary}55)`
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${theme ? theme.accent + '66' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: theme ? `0 0 20px ${theme.glow}22` : 'none',
        }}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selected.flag}</span>
            <div>
              <p className="text-xs tracking-widest uppercase opacity-60" style={{ color: theme?.accent }}>
                {selected.team}
              </p>
              <p className="font-bold text-white text-lg leading-tight">{selected.name}</p>
            </div>
            <span
              className="ml-auto text-3xl font-black opacity-30"
              style={{ color: theme?.accent }}
            >
              {selected.number}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-xs">
              +
            </div>
            <span className="text-white text-sm tracking-widest uppercase">
              {slotLabels[slotIndex]}
            </span>
          </div>
        )}
      </motion.button>

      {/* Clear button */}
      {selected && (
        <button
          onClick={() => onSelect(null)}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white/50 text-xs flex items-center justify-center transition-all"
        >
          ✕
        </button>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(10,10,15,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search driver..."
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm outline-none border border-white/10 focus:border-white/30 placeholder:text-white/30 transition-all"
              />
            </div>

            {/* Driver list */}
            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-center text-white/30 text-sm py-6">No drivers found</p>
              )}
              {filtered.map(driver => (
                <motion.button
                  key={driver.id}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                  onClick={() => {
                    onSelect(driver.id)
                    setOpen(false)
                    setSearch('')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-white/5 last:border-0"
                >
                  <span className="text-xl">{driver.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight truncate">
                      {driver.name}
                    </p>
                    <p className="text-white/40 text-xs truncate">{driver.team}</p>
                  </div>
                  <span className="text-white/20 font-black text-lg">
                    {driver.number > 0 ? driver.number : '—'}
                  </span>
                  {!driver.active && (
                    <span className="text-[10px] text-white/30 uppercase tracking-wider border border-white/10 rounded px-1">
                      Legend
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}