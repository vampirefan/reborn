import type { StateMutations, NarrativeMetadata } from '~~/shared/types/narrative'

export interface ScenarioChoice {
  id: string
  text: string
  textEn: string
  nextNodeId: string
}

export interface ScenarioNode {
  id: string
  narrative: string
  narrativeEn: string
  choices: ScenarioChoice[]
  stateMutations: StateMutations
  imageTag: string
  metadata: NarrativeMetadata
  encyclopedia?: { text: string; textEn: string }
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
