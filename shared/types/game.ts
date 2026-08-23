import type { PlayerState } from './player'

export type GameStatus = 'idle' | 'birth' | 'living' | 'choosing' | 'death' | 'rebirth'

export interface GameState {
  status: GameStatus
  currentPlayer: PlayerState | null
  currentNarrative: string
  currentChoices: Choice[]
  currentImage: string | null
  imageLoading: boolean
  narrativeLoading: boolean
  eventHistory: GameEvent[]
  turnCount: number
  contextSummary: string
  historicalNote: string | null
}

export interface Choice {
  id: string
  text: string
  isHistorical?: boolean
}

export interface GameEvent {
  id: string
  turn: number
  year: number
  playerAge: number
  narrative: string
  choiceMade: string | null
  historicalEvent?: string
  npcsMet?: string[]
  imageUrl?: string
}
