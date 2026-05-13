export interface DriverStats {
  championships: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  points: number
  dnfs: number
  avgQualifyingPos: number
  avgRaceFinish: number
  careerWinPct: number
  wetWeatherRating?: number
}

export interface Driver {
  id: string
  name: string
  firstName: string
  lastName: string
  number: number
  nationality: string
  flag: string
  team: string
  teamShort?: string
  debutYear?: number
  image: string
  active: boolean
  stats: DriverStats
}

export interface DriverTheme {
  primary: string
  secondary: string
  accent: string
  glow: string
  gradient: string[]
}