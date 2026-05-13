'use client'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { Driver, DriverTheme } from '@/types'

interface Props {
  drivers: Driver[]
  themes: Record<string, DriverTheme>
}

// Normalize each driver stat to 0–100 for fair radar display
function normalize(value: number, min: number, max: number) {
  if (max === min) return 50
  return Math.round(((value - min) / (max - min)) * 100)
}

const STAT_CONFIG = [
  { label: 'Wins',         key: 'wins'              },
  { label: 'Poles',        key: 'poles'             },
  { label: 'Podiums',      key: 'podiums'           },
  { label: 'Titles',       key: 'championships'     },
  { label: 'Consistency',  key: 'avgRaceFinish',    invert: true },
  { label: 'Qualifying',   key: 'avgQualifyingPos', invert: true },
  { label: 'Wet Weather',  key: 'wetWeatherRating'  },
  { label: 'Win %',        key: 'careerWinPct'      },
]

export default function DriverRadar({ drivers, themes }: Props) {
  const data = STAT_CONFIG.map(cfg => {
    const raw = drivers.map(d => {
      const val = d.stats[cfg.key as keyof typeof d.stats] as number ?? 0
      return cfg.invert ? 100 - val : val
    })
    const min = Math.min(...raw)
    const max = Math.max(...raw)

    const entry: Record<string, number | string> = { stat: cfg.label }
    drivers.forEach((d, i) => {
      entry[d.id] = normalize(raw[i], min, max)
    })
    return entry
  })

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="stat"
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}
        />
        {drivers.map(d => (
          <Radar
            key={d.id}
            name={d.lastName}
            dataKey={d.id}
            stroke={themes[d.id]?.accent}
            fill={themes[d.id]?.accent}
            fillOpacity={0.12}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}