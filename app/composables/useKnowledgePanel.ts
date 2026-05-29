import { useGameStore } from '~/stores/gameStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useFallbackContent } from '~/composables/useFallbackContent'

export interface TimelineEntry {
  year: number
  playerAge: number
  historicalEvent?: string
  npcsMet?: string[]
  isCurrent: boolean
}

export function useKnowledgePanel() {
  const gameStore = useGameStore()
  const settingsStore = useSettingsStore()
  const fallback = useFallbackContent()

  function getCurrentEncyclopedia(): string | null {
    const lang = settingsStore.language
    const node = fallback.getCurrentNode()
    if (!node?.encyclopedia) return null
    return lang === 'en' ? node.encyclopedia.textEn : node.encyclopedia.text
  }

  function getTimeline(): TimelineEntry[] {
    const events = gameStore.eventHistory
    if (events.length === 0) return []

    return events.map((event, index) => ({
      year: event.year,
      playerAge: event.playerAge,
      historicalEvent: event.historicalEvent,
      npcsMet: event.npcsMet,
      isCurrent: index === events.length - 1,
    }))
  }

  function getCurrentContext() {
    const player = gameStore.currentPlayer
    if (!player) return null

    return {
      era: player.era,
      year: gameStore.currentYear,
      location: player.location.city
        ? `${player.location.city}, ${player.location.country}`
        : player.location.country,
    }
  }

  return {
    getCurrentEncyclopedia,
    getTimeline,
    getCurrentContext,
  }
}
