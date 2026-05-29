import { defineStore } from 'pinia'
import type { PastLife, Achievement, GameStatistics } from '~~/shared/types/history'

const LIVES_STORAGE_KEY = 'reborn-past-lives'
const ACHIEVEMENTS_STORAGE_KEY = 'reborn-achievements'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    pastLives: [] as PastLife[],
    achievements: [] as Achievement[],
    statistics: {
      totalLives: 0,
      totalYearsLived: 0,
      uniqueEras: [],
      uniqueLocations: [],
      oldestAge: 0,
      youngestDeath: 999,
    } as GameStatistics,
  }),

  actions: {
    loadFromStorage() {
      if (import.meta.client) {
        try {
          const lives = localStorage.getItem(LIVES_STORAGE_KEY)
          if (lives) {
            this.pastLives = JSON.parse(lives)
          }
          const achievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)
          if (achievements) {
            this.achievements = JSON.parse(achievements)
          }
          this.recalculateStatistics()
        }
        catch {
          // Invalid data
        }
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem(LIVES_STORAGE_KEY, JSON.stringify(this.pastLives))
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(this.achievements))
      }
    },

    recordLife(life: PastLife) {
      this.pastLives.unshift(life)
      this.recalculateStatistics()
      this.checkAchievements(life)
      this.saveToStorage()
    },

    recalculateStatistics() {
      const lives = this.pastLives
      this.statistics.totalLives = lives.length
      this.statistics.totalYearsLived = lives.reduce(
        (sum, l) => sum + (l.deathYear - l.birthYear),
        0,
      )
      this.statistics.uniqueEras = [...new Set(lives.map(l => l.era))]
      this.statistics.uniqueLocations = [...new Set(lives.map(l => l.location))]
      this.statistics.oldestAge = lives.length > 0
        ? Math.max(...lives.map(l => l.deathYear - l.birthYear))
        : 0
      this.statistics.youngestDeath = lives.length > 0
        ? Math.min(...lives.map(l => l.deathYear - l.birthYear))
        : 999
    },

    checkAchievements(life: PastLife) {
      const age = life.deathYear - life.birthYear
      const earned: string[] = []

      if (age >= 80 && !this.hasAchievement('longevity')) {
        earned.push('longevity')
        this.achievements.push({
          id: 'longevity',
          titleKey: 'achievements.longevity',
          descriptionKey: 'achievements.longevityDesc',
          icon: '🧓',
          condition: 'Live past 80 years old',
          unlockedAt: Date.now(),
        })
      }

      if (this.pastLives.length >= 10 && !this.hasAchievement('reincarnator')) {
        earned.push('reincarnator')
        this.achievements.push({
          id: 'reincarnator',
          titleKey: 'achievements.reincarnator',
          descriptionKey: 'achievements.reincarnatorDesc',
          icon: '🔄',
          condition: 'Complete 10 lives',
          unlockedAt: Date.now(),
        })
      }

      if (this.statistics.uniqueEras.length >= 5 && !this.hasAchievement('time_traveler')) {
        earned.push('time_traveler')
        this.achievements.push({
          id: 'time_traveler',
          titleKey: 'achievements.timeTraveler',
          descriptionKey: 'achievements.timeTravelerDesc',
          icon: '⏳',
          condition: 'Experience 5 different historical eras',
          unlockedAt: Date.now(),
        })
      }

      return earned
    },

    hasAchievement(id: string): boolean {
      return this.achievements.some(a => a.id === id)
    },

    clearHistory() {
      this.pastLives = []
      this.achievements = []
      this.statistics = {
        totalLives: 0,
        totalYearsLived: 0,
        uniqueEras: [],
        uniqueLocations: [],
        oldestAge: 0,
        youngestDeath: 999,
      }
      this.saveToStorage()
    },
  },
})
