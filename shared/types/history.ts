export interface PastLife {
  id: string
  name: string
  birthYear: number
  deathYear: number
  era: string
  location: string
  occupation: string
  causeOfDeath: string
  keyEvents: string[]
  achievements: string[]
  totalTurns: number
  createdAt: number
}

export interface Achievement {
  id: string
  titleKey: string
  descriptionKey: string
  icon: string
  condition: string
  unlockedAt?: number
}

export interface GameStatistics {
  totalLives: number
  totalYearsLived: number
  uniqueEras: string[]
  uniqueLocations: string[]
  oldestAge: number
  youngestDeath: number
}
