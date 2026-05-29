import { defineStore } from 'pinia'
import { type AppSettings, DEFAULT_SETTINGS } from '~~/shared/types/settings'

const STORAGE_KEY = 'reborn-settings'

export const useSettingsStore = defineStore('settings', {
  state: (): AppSettings => ({ ...DEFAULT_SETTINGS }),

  actions: {
    loadFromStorage() {
      if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            Object.assign(this, { ...DEFAULT_SETTINGS, ...parsed })
          }
          catch {
            // Invalid stored data, use defaults
          }
        }
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
      }
    },

    updateSettings(partial: Partial<AppSettings>) {
      Object.assign(this, partial)
      this.saveToStorage()
    },

    setLanguage(lang: 'zh' | 'en') {
      this.language = lang
      this.saveToStorage()
    },

    hasLLMKey(): boolean {
      return this.llmApiKey.length > 0
    },

    hasImageKey(): boolean {
      return this.imageApiKey.length > 0 || this.imageProvider === 'none'
    },
  },
})
