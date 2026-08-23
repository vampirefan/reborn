import { useGameStore } from '~/stores/gameStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useHistoryStore } from '~/stores/historyStore'
import { useNarrative } from '~/composables/useNarrative'
import { useImageGen } from '~/composables/useImageGen'
import { useFallbackContent } from '~/composables/useFallbackContent'
import { useScenarioRepository } from '~/composables/useScenarioRepository'
import { preloadImage } from '~/composables/usePreload'
import { buildBirthPrompt, buildNarrativePrompt } from '~~/server/utils/prompts'
import type { PastLife } from '~~/shared/types/history'
import type { PlayerStats, SocialStatus } from '~~/shared/types/player'

function generateInitialStats(socialStatus: SocialStatus): PlayerStats {
  const roll = () => Math.floor(Math.random() * 8) + 5 // 5-12
  const stats: PlayerStats = { body: roll(), mind: roll(), charisma: roll(), luck: roll() }

  // Apply class modifiers
  switch (socialStatus) {
    case 'noble':
    case 'royal':
      stats.charisma += 2; stats.mind += 1; break
    case 'military':
      stats.body += 2; stats.luck += 1; break
    case 'scholar':
    case 'clergy':
      stats.mind += 2; stats.charisma += 1; break
    case 'merchant':
      stats.charisma += 1; stats.luck += 1; break
    case 'peasant':
    case 'artisan':
      stats.body += 2; break
    case 'outcast':
      stats.luck += 2; break
  }

  // Clamp to [1, 20]
  stats.body = Math.max(1, Math.min(20, stats.body))
  stats.mind = Math.max(1, Math.min(20, stats.mind))
  stats.charisma = Math.max(1, Math.min(20, stats.charisma))
  stats.luck = Math.max(1, Math.min(20, stats.luck))

  return stats
}

export function useGameEngine() {
  const gameStore = useGameStore()
  const settingsStore = useSettingsStore()
  const historyStore = useHistoryStore()
  const { callNarrative } = useNarrative()
  const { generateSceneImage } = useImageGen()
  const fallback = useFallbackContent()

  async function startNewLife() {
    gameStore.reset()
    gameStore.setStatus('birth')
    gameStore.setNarrativeLoading(true)

    try {
      // Use fallback pre-built content when no LLM key is configured
      if (fallback.shouldUseFallback()) {
        await startFallbackLife()
        return
      }

      const prompt = buildBirthPrompt(settingsStore.language)
      const response = await callNarrative(prompt, 'Generate a new random life for me. Be creative and surprising.')
      const birthInfo = (response as any).birthInfo

      if (birthInfo) {
        gameStore.setPlayer({
          id: crypto.randomUUID(),
          name: birthInfo.name,
          age: 5,
          birthYear: birthInfo.birthYear,
          era: birthInfo.era,
          location: birthInfo.location,
          occupation: birthInfo.occupation,
          socialStatus: birthInfo.socialStatus,
          health: birthInfo.health || 90,
          stats: generateInitialStats(birthInfo.socialStatus || 'peasant'),
          traits: birthInfo.traits || [],
          relationships: [],
        })
      }
      else {
        gameStore.setPlayer({
          id: crypto.randomUUID(),
          name: 'Unknown',
          age: 5,
          birthYear: 1000,
          era: 'Medieval',
          location: { region: 'Europe', country: 'Unknown', city: 'Unknown' },
          occupation: 'Peasant',
          socialStatus: 'peasant',
          health: 90,
          stats: generateInitialStats('peasant'),
          traits: [],
          relationships: [],
        })
      }

      gameStore.setNarrative(response.narrative)
      gameStore.setChoices(response.choices)
      gameStore.setStatus('choosing')

      // Generate image async
      if (response.imagePrompt) {
        gameStore.setImageLoading(true)
        generateSceneImage(response.imagePrompt).then((url) => {
          if (url) gameStore.setImage(url)
          gameStore.setImageLoading(false)
        })
      }

      // Record first event
      gameStore.addEvent({
        id: crypto.randomUUID(),
        turn: 0,
        year: gameStore.currentYear,
        playerAge: gameStore.currentPlayer!.age,
        narrative: response.narrative,
        choiceMade: null,
        historicalEvent: response.metadata.historicalEvent,
        npcsMet: response.metadata.npcsMet,
      })

      if (settingsStore.autoSave) {
        gameStore.saveToStorage()
      }
    }
    catch (error: any) {
      // If AI call fails, fall back to pre-built content
      try {
        await startFallbackLife()
      }
      catch {
        gameStore.setNarrative(`Error: ${error.message}. Please check your API key in Settings.`)
        gameStore.setStatus('living')
      }
    }
    finally {
      gameStore.setNarrativeLoading(false)
    }
  }

  async function startFallbackLife(scenarioId?: string) {
    const result = scenarioId
      ? fallback.startScenarioLife(scenarioId)
      : fallback.startFallbackLife()
    if (!result) return
    const { scenario, node } = result
    const lang = settingsStore.language
    const birthInfo = scenario.birthInfo

    gameStore.setPlayer({
      id: crypto.randomUUID(),
      name: lang === 'en' ? birthInfo.nameEn : birthInfo.name,
      age: 0,
      birthYear: birthInfo.birthYear,
      era: lang === 'en' ? birthInfo.eraEn : birthInfo.era,
      location: {
        region: lang === 'en' ? birthInfo.location.regionEn : birthInfo.location.region,
        country: lang === 'en' ? birthInfo.location.countryEn : birthInfo.location.country,
        city: lang === 'en' ? (birthInfo.location.cityEn || '') : (birthInfo.location.city || ''),
      },
      occupation: lang === 'en' ? birthInfo.occupationEn : birthInfo.occupation,
      socialStatus: birthInfo.socialStatus,
      health: birthInfo.health,
      stats: generateInitialStats(birthInfo.socialStatus),
      traits: lang === 'en' ? birthInfo.traitsEn : birthInfo.traits,
      relationships: [],
    })

    const narrative = fallback.getNodeNarrative(node, lang)
    const choices = fallback.getNodeChoices(node, lang)

    gameStore.setNarrative(narrative)
    gameStore.setChoices(choices.map(c => ({ id: c.id, text: c.text, isHistorical: c.isHistorical })))
    gameStore.setStatus('choosing')

    // Set pre-built image (multi-tag rotation)
    const imageUrl = fallback.getSceneImageUrl(node)
    gameStore.setImage(imageUrl)

    // Preload images for all choices' next nodes so the next scene paints fast
    for (const c of node.choices) {
      const next = scenario.nodes[c.nextNodeId]
      if (next) preloadImage(fallback.getSceneImageUrl(next))
    }

    // Apply initial state mutations
    if (node.stateMutations.ageAdvance) {
      gameStore.applyMutations(node.stateMutations)
    }

    // Record first event
    gameStore.addEvent({
      id: crypto.randomUUID(),
      turn: 0,
      year: gameStore.currentYear,
      playerAge: gameStore.currentPlayer!.age,
      narrative,
      choiceMade: null,
      historicalEvent: node.metadata.historicalEvent,
      npcsMet: node.metadata.npcsMet,
    })

    if (settingsStore.autoSave) {
      gameStore.saveToStorage()
    }
  }

  async function makeChoice(choiceId: string) {
    const choice = gameStore.currentChoices.find(c => c.id === choiceId)
    if (!choice || !gameStore.currentPlayer) return

    gameStore.setStatus('living')
    gameStore.setNarrativeLoading(true)
    gameStore.setChoices([])

    try {
      // Use fallback if in fallback mode (scenario is active)
      if (fallback.shouldUseFallback() || fallback.getCurrentScenarioId()) {
        await makeFallbackChoice(choiceId, choice.text)
        return
      }

      const player = gameStore.currentPlayer
      const prompt = buildNarrativePrompt(
        {
          player: {
            name: player.name,
            age: player.age,
            era: player.era,
            location: `${player.location.city || ''}, ${player.location.country}, ${player.location.region}`,
            occupation: player.occupation,
            socialStatus: player.socialStatus,
            health: player.health,
            stats: player.stats,
            traits: player.traits,
            relationships: player.relationships.map(r => `${r.name} (${r.role})`),
          },
          year: gameStore.currentYear,
          recentEvents: gameStore.eventHistory.slice(-3).map(e => e.narrative.substring(0, 150)),
          contextSummary: gameStore.contextSummary,
          turnCount: gameStore.turnCount,
        },
        settingsStore.language,
        settingsStore.narrativeLength,
      )

      const response = await callNarrative(prompt, `I choose: "${choice.text}"`)

      // Check for death
      if (response.metadata.isDeath) {
        await handleDeath(response.narrative, response.metadata.causeOfDeath || 'Unknown causes')
        return
      }

      // Apply state mutations
      gameStore.applyMutations(response.stateMutations)
      gameStore.setNarrative(response.narrative)
      gameStore.setChoices(response.choices)
      gameStore.setStatus('choosing')

      // Generate image async
      if (response.imagePrompt) {
        gameStore.setImageLoading(true)
        generateSceneImage(response.imagePrompt).then((url) => {
          if (url) gameStore.setImage(url)
          gameStore.setImageLoading(false)
        })
      }

      // Record event
      gameStore.addEvent({
        id: crypto.randomUUID(),
        turn: gameStore.turnCount,
        year: gameStore.currentYear,
        playerAge: gameStore.currentPlayer!.age,
        narrative: response.narrative,
        choiceMade: choice.text,
        historicalEvent: response.metadata.historicalEvent,
        npcsMet: response.metadata.npcsMet,
      })

      // Update context summary
      updateContextSummary()

      if (settingsStore.autoSave) {
        gameStore.saveToStorage()
      }
    }
    catch (error: any) {
      gameStore.setNarrative(`Error: ${error.message}`)
      gameStore.setChoices([{ id: 'retry', text: 'Try again' }])
      gameStore.setStatus('choosing')
    }
    finally {
      gameStore.setNarrativeLoading(false)
    }
  }

  async function makeFallbackChoice(choiceId: string, choiceText: string) {
    const currentNode = fallback.getCurrentNode()
    if (!currentNode) return

    // Find the choice and get next node id
    const choiceData = currentNode.choices.find(c => c.id === choiceId)
    if (!choiceData) return

    const nextNode = fallback.advanceToNode(choiceData.nextNodeId)
    if (!nextNode) return

    const lang = settingsStore.language
    const narrative = fallback.getNodeNarrative(nextNode, lang)
    const choices = fallback.getNodeChoices(nextNode, lang)

    // Apply state mutations
    gameStore.applyMutations(nextNode.stateMutations)

    // Check for death (no choices = death node)
    if (nextNode.metadata.isDeath || choices.length === 0) {
      const causeOfDeath = nextNode.metadata.causeOfDeath || 'Unknown causes'
      await handleDeath(narrative, causeOfDeath)
      return
    }

    gameStore.setNarrative(narrative)
    gameStore.setChoices(choices.map(c => ({ id: c.id, text: c.text, isHistorical: c.isHistorical })))
    gameStore.setStatus('choosing')

    // Set historical note for the choice just made (if any)
    if (choiceData.historicalNote) {
      const note = lang === 'en' ? choiceData.historicalNote.textEn : choiceData.historicalNote.text
      gameStore.setHistoricalNote(note)
    }
    else {
      gameStore.setHistoricalNote(null)
    }

    // Set pre-built image (multi-tag rotation)
    const imageUrl = fallback.getSceneImageUrl(nextNode)
    gameStore.setImage(imageUrl)

    // Preload images for next nodes
    const scenarioId = fallback.getCurrentScenarioId()
    if (scenarioId) {
      const repo = useScenarioRepository()
      const scenario = repo.getById(scenarioId)
      if (scenario) {
        for (const c of nextNode.choices) {
          const upcoming = scenario.nodes[c.nextNodeId]
          if (upcoming) preloadImage(fallback.getSceneImageUrl(upcoming))
        }
      }
    }

    // Record event
    gameStore.addEvent({
      id: crypto.randomUUID(),
      turn: gameStore.turnCount,
      year: gameStore.currentYear,
      playerAge: gameStore.currentPlayer!.age,
      narrative,
      choiceMade: choiceText,
      historicalEvent: nextNode.metadata.historicalEvent,
      npcsMet: nextNode.metadata.npcsMet,
    })

    updateContextSummary()

    if (settingsStore.autoSave) {
      gameStore.saveToStorage()
    }

    gameStore.setNarrativeLoading(false)
  }

  async function handleDeath(narrative: string, causeOfDeath: string) {
    gameStore.setStatus('death')
    gameStore.setNarrative(narrative)
    gameStore.setChoices([])

    const player = gameStore.currentPlayer!
    const life: PastLife = {
      id: player.id,
      name: player.name,
      birthYear: player.birthYear,
      deathYear: player.birthYear + player.age,
      era: player.era,
      location: `${player.location.city || player.location.country}, ${player.location.region}`,
      occupation: player.occupation,
      causeOfDeath,
      keyEvents: gameStore.eventHistory
        .filter(e => e.historicalEvent)
        .map(e => e.historicalEvent!),
      achievements: [],
      totalTurns: gameStore.turnCount,
      createdAt: Date.now(),
    }

    historyStore.recordLife(life)
    gameStore.clearSave()
  }

  function updateContextSummary() {
    const events = gameStore.eventHistory.slice(-5)
    const summary = events
      .map(e => `[Age ${e.playerAge}] ${e.narrative.substring(0, 100)}`)
      .join('\n')
    gameStore.setContextSummary(summary)
  }

  async function rebirth() {
    gameStore.setStatus('rebirth')
    // Brief pause for transition animation
    await new Promise(resolve => setTimeout(resolve, 1500))
    await startNewLife()
  }

  function resumeGame(): boolean {
    return gameStore.loadFromStorage()
  }

  async function startSelectedLife(scenarioId: string) {
    gameStore.reset()
    gameStore.setStatus('birth')
    gameStore.setNarrativeLoading(true)
    try {
      await startFallbackLife(scenarioId)
    }
    finally {
      gameStore.setNarrativeLoading(false)
    }
  }

  return {
    startNewLife,
    startSelectedLife,
    makeChoice,
    rebirth,
    resumeGame,
  }
}
