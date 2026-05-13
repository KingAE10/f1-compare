export interface DriverTheme {
  primary: string
  secondary: string
  accent: string
  glow: string
  gradient: string[]
}

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
  sprintWins?: number
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
  teamShort: string
  image: string
  active: boolean
  debutYear: number
  stats: DriverStats
}