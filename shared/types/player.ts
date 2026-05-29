export interface PlayerStats {
  body: number
  mind: number
  charisma: number
  luck: number
}

export interface PlayerState {
  id: string
  name: string
  age: number
  birthYear: number
  era: string
  location: PlayerLocation
  occupation: string
  socialStatus: SocialStatus
  health: number
  stats: PlayerStats
  traits: string[]
  relationships: Relationship[]
}

export interface PlayerLocation {
  region: string
  country: string
  city?: string
}

export type SocialStatus =
  | 'peasant'
  | 'merchant'
  | 'noble'
  | 'royal'
  | 'clergy'
  | 'military'
  | 'scholar'
  | 'artisan'
  | 'outcast'

export interface Relationship {
  name: string
  role: string
  sentiment: 'friendly' | 'neutral' | 'hostile'
}
