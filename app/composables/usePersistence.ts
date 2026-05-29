import { useSettingsStore } from '~/stores/settingsStore'
import { useGameStore } from '~/stores/gameStore'
import { useHistoryStore } from '~/stores/historyStore'

export function usePersistence() {
  const settingsStore = useSettingsStore()
  const gameStore = useGameStore()
  const historyStore = useHistoryStore()

  function initializeAll() {
    settingsStore.loadFromStorage()
    historyStore.loadFromStorage()
  }

  function exportSaveData(): string {
    const data = {
      version: 1,
      exportedAt: Date.now(),
      settings: settingsStore.$state,
      game: gameStore.$state,
      history: {
        pastLives: historyStore.pastLives,
        achievements: historyStore.achievements,
      },
    }
    return JSON.stringify(data, null, 2)
  }

  function importSaveData(json: string): boolean {
    try {
      const data = JSON.parse(json)
      if (data.version !== 1) return false

      if (data.settings) {
        settingsStore.updateSettings(data.settings)
      }
      if (data.game?.currentPlayer) {
        Object.assign(gameStore.$state, data.game)
        gameStore.saveToStorage()
      }
      if (data.history) {
        historyStore.pastLives = data.history.pastLives || []
        historyStore.achievements = data.history.achievements || []
        historyStore.recalculateStatistics()
        historyStore.saveToStorage()
      }
      return true
    }
    catch {
      return false
    }
  }

  return {
    initializeAll,
    exportSaveData,
    importSaveData,
  }
}
