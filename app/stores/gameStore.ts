import { defineStore } from 'pinia'
import type { GameState, GameStatus, Choice, GameEvent } from '~~/shared/types/game'
import type { PlayerState } from '~~/shared/types/player'

const STORAGE_KEY = 'reborn-game-state'

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    status: 'idle',
    currentPlayer: null,
    currentNarrative: '',
    currentChoices: [],
    currentImage: null,
    imageLoading: false,
    narrativeLoading: false,
    eventHistory: [],
    turnCount: 0,
    contextSummary: '',
  }),

  getters: {
    isAlive: (state) => state.status === 'living' || state.status === 'choosing',
    currentYear: (state) => {
      if (!state.currentPlayer) return 0
      return state.currentPlayer.birthYear + state.currentPlayer.age
    },
    canPlay: (state) => state.status !== 'idle',
    isLoading: (state) => state.narrativeLoading || state.imageLoading,
  },

  actions: {
    setStatus(status: GameStatus) {
      this.status = status
    },

    setPlayer(player: PlayerState) {
      this.currentPlayer = player
    },

    setNarrative(narrative: string) {
      this.currentNarrative = narrative
    },

    setChoices(choices: Choice[]) {
      this.currentChoices = choices
      if (choices.length > 0) {
        this.status = 'choosing'
      }
    },

    setImage(url: string | null) {
      this.currentImage = url
    },

    setImageLoading(loading: boolean) {
      this.imageLoading = loading
    },

    setNarrativeLoading(loading: boolean) {
      this.narrativeLoading = loading
    },

    addEvent(event: GameEvent) {
      this.eventHistory.push(event)
      this.turnCount++
    },

    applyMutations(mutations: {
      ageAdvance?: number
      healthChange?: number
      locationChange?: string
      occupationChange?: string
      newTrait?: string
      newRelationship?: { name: string; role: string }
      statChanges?: { body?: number; mind?: number; charisma?: number; luck?: number }
    }) {
      if (!this.currentPlayer) return

      if (mutations.ageAdvance) {
        this.currentPlayer.age += mutations.ageAdvance
      }
      if (mutations.healthChange) {
        this.currentPlayer.health = Math.max(0, Math.min(100, this.currentPlayer.health + mutations.healthChange))
      }
      if (mutations.locationChange) {
        this.currentPlayer.location.city = mutations.locationChange
      }
      if (mutations.occupationChange) {
        this.currentPlayer.occupation = mutations.occupationChange
      }
      if (mutations.newTrait && !this.currentPlayer.traits.includes(mutations.newTrait)) {
        this.currentPlayer.traits.push(mutations.newTrait)
      }
      if (mutations.newRelationship) {
        this.currentPlayer.relationships.push({
          ...mutations.newRelationship,
          sentiment: 'friendly',
        })
      }
      if (mutations.statChanges && this.currentPlayer.stats) {
        const stats = this.currentPlayer.stats
        const changes = mutations.statChanges
        if (changes.body) stats.body = Math.max(1, Math.min(20, stats.body + changes.body))
        if (changes.mind) stats.mind = Math.max(1, Math.min(20, stats.mind + changes.mind))
        if (changes.charisma) stats.charisma = Math.max(1, Math.min(20, stats.charisma + changes.charisma))
        if (changes.luck) stats.luck = Math.max(1, Math.min(20, stats.luck + changes.luck))
      }
    },

    setContextSummary(summary: string) {
      this.contextSummary = summary
    },

    reset() {
      this.status = 'idle'
      this.currentPlayer = null
      this.currentNarrative = ''
      this.currentChoices = []
      this.currentImage = null
      this.imageLoading = false
      this.narrativeLoading = false
      this.eventHistory = []
      this.turnCount = 0
      this.contextSummary = ''
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
      }
    },

    loadFromStorage(): boolean {
      if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.currentPlayer) {
              Object.assign(this, parsed)
              return true
            }
          }
          catch {
            // Invalid data
          }
        }
      }
      return false
    },

    clearSave() {
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
  },
})
