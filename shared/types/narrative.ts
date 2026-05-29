export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface NarrativeRequest {
  messages: ChatMessage[]
  provider: string
  apiKey: string
  model: string
  baseUrl: string
}

export interface NarrativeResponse {
  narrative: string
  choices: { id: string; text: string }[]
  stateMutations: StateMutations
  imagePrompt: string
  metadata: NarrativeMetadata
}

export interface StateMutations {
  ageAdvance?: number
  healthChange?: number
  locationChange?: string
  occupationChange?: string
  newTrait?: string
  newRelationship?: { name: string; role: string }
  statChanges?: { body?: number; mind?: number; charisma?: number; luck?: number }
}

export interface NarrativeMetadata {
  year: number
  historicalEvent?: string
  npcsMet?: string[]
  isDeath?: boolean
  causeOfDeath?: string
}

export interface ImageRequest {
  prompt: string
  provider: string
  apiKey: string
  model: string
  baseUrl: string
  size?: string
  style?: string
}

export interface ImageResponse {
  url?: string
  base64?: string
  error?: string
}
