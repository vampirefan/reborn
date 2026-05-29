import { useSettingsStore } from '~/stores/settingsStore'
import { useScenarioRepository } from '~/composables/useScenarioRepository'
import { getImageByTag } from '~/data/images'
import type { PreBuiltScenario, ScenarioNode } from '~/data/types'

interface FallbackState {
  currentScenario: PreBuiltScenario | null
  currentNodeId: string | null
}

const state: FallbackState = {
  currentScenario: null,
  currentNodeId: null,
}

export function useFallbackContent() {
  const settingsStore = useSettingsStore()
  const repository = useScenarioRepository()

  function shouldUseFallback(): boolean {
    return !settingsStore.hasLLMKey()
  }

  function startFallbackLife() {
    const scenario = repository.getRandom()
    state.currentScenario = scenario
    state.currentNodeId = scenario.startNodeId
    return {
      scenario,
      node: scenario.nodes[scenario.startNodeId],
    }
  }

  function resumeFallbackLife(scenarioId: string, nodeId: string) {
    const scenario = repository.getById(scenarioId)
    if (!scenario) return null
    state.currentScenario = scenario
    state.currentNodeId = nodeId
    return {
      scenario,
      node: scenario.nodes[nodeId],
    }
  }

  function advanceToNode(nodeId: string): ScenarioNode | null {
    if (!state.currentScenario) return null
    const node = state.currentScenario.nodes[nodeId]
    if (!node) return null
    state.currentNodeId = nodeId
    return node
  }

  function getCurrentNode(): ScenarioNode | null {
    if (!state.currentScenario || !state.currentNodeId) return null
    return state.currentScenario.nodes[state.currentNodeId]
  }

  function getNodeNarrative(node: ScenarioNode, lang: 'zh' | 'en'): string {
    return lang === 'en' ? node.narrativeEn : node.narrative
  }

  function getNodeChoices(node: ScenarioNode, lang: 'zh' | 'en') {
    return node.choices.map(c => ({
      id: c.id,
      text: lang === 'en' ? c.textEn : c.text,
      _nextNodeId: c.nextNodeId,
    }))
  }

  function getSceneImageUrl(imageTag: string): string {
    const entry = getImageByTag(imageTag)
    return entry.path
  }

  function getCurrentScenarioId(): string | null {
    return state.currentScenario?.id ?? null
  }

  function getCurrentNodeId(): string | null {
    return state.currentNodeId
  }

  return {
    shouldUseFallback,
    startFallbackLife,
    resumeFallbackLife,
    advanceToNode,
    getCurrentNode,
    getNodeNarrative,
    getNodeChoices,
    getSceneImageUrl,
    getCurrentScenarioId,
    getCurrentNodeId,
  }
}
