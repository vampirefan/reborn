import { defineStore } from 'pinia'
import type { PreBuiltScenario } from '~/data/types'

const STORAGE_KEY = 'reborn-user-scenarios'

export interface NodePosition {
  x: number
  y: number
}

export interface UserScenarioMeta {
  createdAt: number
  updatedAt: number
  nodePositions: Record<string, NodePosition>
  forkedFromId?: string
}

export interface UserScenarioRecord {
  scenario: PreBuiltScenario
  meta: UserScenarioMeta
}

interface UserScenariosState {
  scenarios: Record<string, UserScenarioRecord>
  loaded: boolean
}

function generateUserId(): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `user-${Date.now().toString(36)}-${rand}`
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export const useUserScenariosStore = defineStore('userScenarios', {
  state: (): UserScenariosState => ({
    scenarios: {},
    loaded: false,
  }),

  getters: {
    list(state): UserScenarioRecord[] {
      return Object.values(state.scenarios).sort(
        (a, b) => b.meta.updatedAt - a.meta.updatedAt,
      )
    },
    byId: state => (id: string): UserScenarioRecord | undefined => {
      return state.scenarios[id]
    },
    allScenarios(state): PreBuiltScenario[] {
      return Object.values(state.scenarios).map(r => r.scenario)
    },
  },

  actions: {
    loadFromStorage() {
      if (!import.meta.client)
        return
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as UserScenariosState
          if (parsed && typeof parsed === 'object' && parsed.scenarios) {
            this.scenarios = parsed.scenarios
          }
        }
        catch {
          // Invalid stored data, ignore
        }
      }
      this.loaded = true
    },

    saveToStorage() {
      if (!import.meta.client)
        return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ scenarios: this.scenarios }),
      )
    },

    /**
     * Create a new empty scenario. Returns the generated id.
     */
    create(initial?: Partial<PreBuiltScenario>): string {
      const id = generateUserId()
      const now = Date.now()
      const startNodeId = initial?.startNodeId ?? 'start'
      const scenario: PreBuiltScenario = {
        id,
        birthInfo: initial?.birthInfo ?? {
          name: '新人物',
          nameEn: 'New Character',
          birthYear: 1000,
          era: '未知时代',
          eraEn: 'Unknown Era',
          location: {
            region: '未知区域',
            regionEn: 'Unknown Region',
            country: '未知国家',
            countryEn: 'Unknown Country',
          },
          occupation: '平民',
          occupationEn: 'Commoner',
          socialStatus: 'peasant',
          traits: [],
          traitsEn: [],
          health: 100,
        },
        nodes: initial?.nodes ?? {
          [startNodeId]: {
            id: startNodeId,
            narrative: '故事的开端……',
            narrativeEn: 'The beginning of the story...',
            choices: [],
            stateMutations: {},
            imageTag: 'start',
            metadata: { year: 1000 },
          },
        },
        startNodeId,
      }
      this.scenarios[id] = {
        scenario,
        meta: {
          createdAt: now,
          updatedAt: now,
          nodePositions: {},
        },
      }
      this.saveToStorage()
      return id
    },

    /**
     * Replace an existing user scenario. Built-in ids cannot be updated.
     */
    update(id: string, scenario: PreBuiltScenario, nodePositions?: Record<string, NodePosition>) {
      const existing = this.scenarios[id]
      if (!existing)
        return
      if (!id.startsWith('user-'))
        return
      existing.scenario = { ...scenario, id }
      existing.meta.updatedAt = Date.now()
      if (nodePositions)
        existing.meta.nodePositions = nodePositions
      this.saveToStorage()
    },

    /**
     * Update only the node-positions metadata (graph layout).
     */
    updatePositions(id: string, nodePositions: Record<string, NodePosition>) {
      const existing = this.scenarios[id]
      if (!existing)
        return
      existing.meta.nodePositions = nodePositions
      existing.meta.updatedAt = Date.now()
      this.saveToStorage()
    },

    /**
     * Fork a scenario (built-in or user) into a new editable user scenario.
     */
    duplicate(source: PreBuiltScenario, sourceId?: string): string {
      const id = generateUserId()
      const now = Date.now()
      const cloned = deepClone(source)
      cloned.id = id
      this.scenarios[id] = {
        scenario: cloned,
        meta: {
          createdAt: now,
          updatedAt: now,
          nodePositions: {},
          forkedFromId: sourceId ?? source.id,
        },
      }
      this.saveToStorage()
      return id
    },

    remove(id: string) {
      if (!id.startsWith('user-'))
        return
      delete this.scenarios[id]
      this.saveToStorage()
    },

    /**
     * Import a JSON string. Accepts either a single scenario or a wrapper
     * { scenario, meta? }. Always assigns a fresh user id.
     */
    importJson(json: string): { ok: true, id: string } | { ok: false, error: string } {
      let parsed: unknown
      try {
        parsed = JSON.parse(json)
      }
      catch (e) {
        return { ok: false, error: `Invalid JSON: ${(e as Error).message}` }
      }
      const obj = parsed as Record<string, unknown>
      const scenario = (obj && typeof obj === 'object' && 'scenario' in obj
        ? obj.scenario
        : obj) as PreBuiltScenario | undefined
      if (!scenario || typeof scenario !== 'object' || !scenario.nodes || !scenario.birthInfo) {
        return { ok: false, error: 'Missing required scenario fields (birthInfo, nodes).' }
      }
      const meta = (obj && 'meta' in obj ? obj.meta as Partial<UserScenarioMeta> : undefined)
      const id = generateUserId()
      const now = Date.now()
      const cloned = deepClone(scenario)
      cloned.id = id
      this.scenarios[id] = {
        scenario: cloned,
        meta: {
          createdAt: now,
          updatedAt: now,
          nodePositions: meta?.nodePositions ?? {},
          forkedFromId: meta?.forkedFromId,
        },
      }
      this.saveToStorage()
      return { ok: true, id }
    },

    /**
     * Export a scenario record as a pretty JSON string.
     */
    exportJson(id: string): string | null {
      const record = this.scenarios[id]
      if (!record)
        return null
      return JSON.stringify(record, null, 2)
    },
  },
})
