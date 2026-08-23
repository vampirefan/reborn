import type { StateMutations, NarrativeMetadata } from '~~/shared/types/narrative'

export interface GeoCoordinates {
  lat: number
  lng: number
}

export interface ScenarioChoice {
  id: string
  text: string
  textEn: string
  nextNodeId: string
  isHistorical?: boolean
  historicalNote?: { text: string; textEn: string }
}

export interface ContemporaryFigure {
  name: string
  nameEn: string
  role: string
  roleEn: string
  quote?: string
  quoteEn?: string
}

export interface EncyclopediaEntry {
  text: string
  textEn: string
  quote?: { text: string; textEn: string; author?: string; authorEn?: string }
  contemporaries?: ContemporaryFigure[]
}

export interface ScenarioNode {
  id: string
  narrative: string
  narrativeEn: string
  choices: ScenarioChoice[]
  stateMutations: StateMutations
  imageTag: string
  imageTags?: string[]
  metadata: NarrativeMetadata
  encyclopedia?: EncyclopediaEntry
}

export interface ScenarioBirthInfo {
  name: string
  nameEn: string
  birthYear: number
  era: string
  eraEn: string
  location: {
    region: string
    regionEn: string
    country: string
    countryEn: string
    city?: string
    cityEn?: string
    coordinates: GeoCoordinates
  }
  occupation: string
  occupationEn: string
  socialStatus: 'peasant' | 'merchant' | 'noble' | 'royal' | 'clergy' | 'military' | 'scholar' | 'artisan' | 'outcast'
  traits: string[]
  traitsEn: string[]
  health: number
}

export interface PreBuiltScenario {
  id: string
  birthInfo: ScenarioBirthInfo
  nodes: Record<string, ScenarioNode>
  startNodeId: string
}
