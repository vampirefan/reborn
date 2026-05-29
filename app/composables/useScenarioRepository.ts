import { BUILT_IN_SCENARIOS, BUILT_IN_SCENARIO_IDS } from '~/data/scenarios'
import { useUserScenariosStore } from '~/stores/userScenariosStore'
import type { PreBuiltScenario } from '~/data/types'

/**
 * Unified read-only access to all scenarios (built-in + user-created).
 * The repository is the single source of truth used by the runtime and
 * the admin pages. Built-in scenarios are immutable; user scenarios live
 * in the userScenariosStore (localStorage-backed).
 */
export function useScenarioRepository() {
  const userStore = useUserScenariosStore()

  function ensureLoaded() {
    if (import.meta.client && !userStore.loaded) {
      userStore.loadFromStorage()
    }
  }

  function isBuiltIn(id: string): boolean {
    return BUILT_IN_SCENARIO_IDS.has(id)
  }

  function listAll(): PreBuiltScenario[] {
    ensureLoaded()
    return [...BUILT_IN_SCENARIOS, ...userStore.allScenarios]
  }

  function listBuiltIn(): readonly PreBuiltScenario[] {
    return BUILT_IN_SCENARIOS
  }

  function listUser(): PreBuiltScenario[] {
    ensureLoaded()
    return userStore.allScenarios
  }

  function getById(id: string): PreBuiltScenario | undefined {
    ensureLoaded()
    if (isBuiltIn(id)) {
      return BUILT_IN_SCENARIOS.find(s => s.id === id)
    }
    return userStore.byId(id)?.scenario
  }

  function getRandom(): PreBuiltScenario {
    const all = listAll()
    if (all.length === 0) {
      // Fallback to built-ins (should always exist)
      return BUILT_IN_SCENARIOS[0]!
    }
    const index = Math.floor(Math.random() * all.length)
    return all[index]!
  }

  return {
    isBuiltIn,
    listAll,
    listBuiltIn,
    listUser,
    getById,
    getRandom,
  }
}
