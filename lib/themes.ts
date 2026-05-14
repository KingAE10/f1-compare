// lib/themes.ts
import { DriverTheme } from '@/types'

export const DRIVER_THEMES: Record<string, DriverTheme> = {
  verstappen: {
    primary: '#1E3A8A',
    secondary: '#CC1E4A',
    accent: '#00BFFF',
    glow: '#00BFFF',
    gradient: ['#0A1628', '#1E3A8A', '#CC1E4A'],
  },
  hamilton: {
    primary: '#00D2BE',
    secondary: '#1a1a1a',
    accent: '#FFD700',
    glow: '#00D2BE',
    gradient: ['#111111', '#00D2BE', '#222222'],
  },
  leclerc: {
    primary: '#DC0000',
    secondary: '#8B0000',
    accent: '#FF6B6B',
    glow: '#FF0000',
    gradient: ['#1a0000', '#DC0000', '#8B0000'],
  },
  norris: {
    primary: '#FF8000',
    secondary: '#2D2D2D',
    accent: '#FFA500',
    glow: '#FF8000',
    gradient: ['#1a0d00', '#FF8000', '#333333'],
  },
  russell: {
    primary: '#00D2BE',
    secondary: '#C0C0C0',
    accent: '#27F4D2',
    glow: '#27F4D2',
    gradient: ['#001a19', '#00D2BE', '#808080'],
  },
  alonso: {
    primary: '#006F62',
    secondary: '#001a17',
    accent: '#00FFC8',
    glow: '#00FFC8',
    gradient: ['#001a17', '#006F62', '#00FFC8'],
  },
  sainz: {
    primary: '#DC0000',
    secondary: '#FF8C00',
    accent: '#FF4500',
    glow: '#FF4500',
    gradient: ['#1a0000', '#DC0000', '#FF8C00'],
  },
  piastri: {
    primary: '#FF8000',
    secondary: '#1a0d00',
    accent: '#FFB347',
    glow: '#FF8000',
    gradient: ['#1a0d00', '#FF8000', '#FFB347'],
  },
  perez: {
    primary: '#1E3A8A',
    secondary: '#00008B',
    accent: '#4169E1',
    glow: '#4169E1',
    gradient: ['#0a0a2a', '#1E3A8A', '#00008B'],
  },
  schumacher: {
    primary: '#DC0000',
    secondary: '#C0C0C0',
    accent: '#FF0000',
    glow: '#FF0000',
    gradient: ['#1a0000', '#DC0000', '#808080'],
  },
  senna: {
    primary: '#009C3B',
    secondary: '#002776',
    accent: '#FEDD00',
    glow: '#FEDD00',
    gradient: ['#001a0d', '#009C3B', '#002776'],
  },
  prost: {
    primary: '#002395',
    secondary: '#ED2939',
    accent: '#FFFFFF',
    glow: '#FFFFFF',
    gradient: ['#00001a', '#002395', '#ED2939'],
  },
}

export function getThemeForDriver(driverId: string): DriverTheme {
  return (
    DRIVER_THEMES[driverId] ?? {
      primary: '#333333',
      secondary: '#555555',
      accent: '#AAAAAA',
      glow: '#AAAAAA',
      gradient: ['#111111', '#333333', '#555555'],
    }
  )
}

export function blendGradients(themes: DriverTheme[]): string {
  if (themes.length === 0)
    return `radial-gradient(ellipse at 20% 50%, #5a0000 0%, transparent 65%),
            radial-gradient(ellipse at 80% 20%, #120025 0%, transparent 65%),
            radial-gradient(ellipse at 50% 90%, #001a33 0%, transparent 65%),
            #07070f`

  const positions = ['20% 50%', '80% 20%', '50% 80%']

  // opacity bumped: 44 (~27%) → 88 (~53%) so the glows actually show
  const radials = themes.map(
    (theme, i) =>
      `radial-gradient(ellipse at ${positions[i % positions.length]}, ${theme.primary}88 0%, transparent 65%)`
  )

  // base was '#050505' (black) — fixed to '#07070f' (dark navy)
  return [...radials, '#07070f'].join(', ')
}