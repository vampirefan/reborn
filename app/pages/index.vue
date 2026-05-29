<template>
  <div>
    <NuxtLayout name="game">
      <!-- Scene Background -->
      <GameSceneBackground
        :current-image="gameStore.currentImage"
        :loading="gameStore.imageLoading"
      />

      <!-- Status HUD (only when playing) -->
      <GameStatusHud
        v-if="gameStore.currentPlayer && gameStore.isAlive"
        :era="gameStore.currentPlayer.era"
        :location="locationDisplay"
        :age="gameStore.currentPlayer.age"
        :health="gameStore.currentPlayer.health"
        :stats="gameStore.currentPlayer.stats"
      />

      <!-- Title Screen -->
      <div v-if="gameStore.status === 'idle'" class="title-screen">
        <div class="title-content">
          <h1 class="game-title">{{ $t('game.title') }}</h1>
          <p class="game-subtitle">{{ $t('game.subtitle') }}</p>

          <div class="title-actions">
            <button
              v-if="hasSavedGame"
              class="btn-primary"
              @click="resumeGame"
            >
              {{ $t('game.continue') }}
            </button>
            <button
              class="btn-primary"
              @click="startNew"
            >
              {{ $t('game.newGame') }}
            </button>
            <button class="btn-secondary" @click="navigateTo('/settings')">
              {{ $t('settings.title') }}
            </button>
            <button class="btn-secondary" @click="navigateTo('/history')">
              {{ $t('history.pastLives') }}
            </button>
          </div>

          <p v-if="!settingsStore.hasLLMKey()" class="no-key-hint">
            {{ $t('errors.noApiKeyHint') }}
          </p>
        </div>
      </div>

      <!-- Birth Transition -->
      <GameBirthTransition
        :visible="gameStore.status === 'birth'"
        :era="gameStore.currentPlayer?.era"
        :year="gameStore.currentPlayer?.birthYear"
        :location="locationDisplay"
      />

      <!-- Main Game Area (Living/Choosing) -->
      <div v-if="gameStore.isAlive" class="game-area">
        <div class="narrative-container">
          <!-- Loading indicator -->
          <div v-if="gameStore.narrativeLoading" class="loading-indicator">
            <span class="loading-dot" />
            <span class="loading-dot" />
            <span class="loading-dot" />
          </div>

          <!-- Narrative Text -->
          <GameNarrativeDisplay
            v-else
            :text="gameStore.currentNarrative"
            :speed="settingsStore.textSpeed"
            @complete="showChoices = true"
          />

          <!-- Choices -->
          <GameChoicePanel
            :choices="gameStore.currentChoices"
            :visible="showChoices && !gameStore.narrativeLoading"
            :disabled="gameStore.narrativeLoading"
            @select="onChoice"
          />
        </div>
      </div>

      <!-- Death Transition -->
      <GameDeathTransition
        :visible="gameStore.status === 'death'"
        :name="gameStore.currentPlayer?.name || ''"
        :birth-year="gameStore.currentPlayer?.birthYear || 0"
        :death-year="gameStore.currentYear"
        :era="gameStore.currentPlayer?.era || ''"
        :age="gameStore.currentPlayer?.age || 0"
        :turns="gameStore.turnCount"
        :cause-of-death="deathCause"
        :narrative="gameStore.currentNarrative"
        @rebirth="onRebirth"
      />

      <!-- Navigation overlay -->
      <div v-if="gameStore.isAlive" class="nav-overlay">
        <button class="nav-btn" @click="knowledgePanelOpen = true" :title="$t('knowledge.title')">
          &#128214;
        </button>
        <button class="nav-btn" @click="navigateTo('/settings')">
          &#9881;
        </button>
      </div>

      <!-- Knowledge Panel -->
      <GameKnowledgePanel
        :visible="knowledgePanelOpen"
        @close="knowledgePanelOpen = false"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/gameStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useGameEngine } from '~/composables/useGameEngine'
import { usePersistence } from '~/composables/usePersistence'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { startNewLife, makeChoice, rebirth, resumeGame: resumeFromStorage } = useGameEngine()
const { initializeAll } = usePersistence()

const showChoices = ref(false)
const hasSavedGame = ref(false)
const deathCause = ref('')
const knowledgePanelOpen = ref(false)

const locationDisplay = computed(() => {
  if (!gameStore.currentPlayer) return ''
  const loc = gameStore.currentPlayer.location
  return [loc.city, loc.country].filter(Boolean).join(', ')
})

onMounted(() => {
  initializeAll()

  // If game is already active, we're returning from settings/history navigation
  if (gameStore.status !== 'idle') {
    hasSavedGame.value = true
    return
  }

  // Only on genuine first load
  hasSavedGame.value = gameStore.loadFromStorage()
  if (!hasSavedGame.value) {
    gameStore.setStatus('idle')
  }
})

async function startNew() {
  showChoices.value = false
  await startNewLife()
}

function resumeGame() {
  // Already loaded from storage in onMounted
  showChoices.value = true
}

async function onChoice(choiceId: string) {
  showChoices.value = false
  await makeChoice(choiceId)
}

async function onRebirth() {
  deathCause.value = ''
  showChoices.value = false
  await rebirth()
}

// Track death cause from last event
watch(() => gameStore.status, (status) => {
  if (status === 'death') {
    const lastEvent = gameStore.eventHistory[gameStore.eventHistory.length - 1]
    deathCause.value = lastEvent?.historicalEvent || 'The wheel of fate turns...'
    knowledgePanelOpen.value = false
  }
  if (status === 'rebirth') {
    knowledgePanelOpen.value = false
  }
})
</script>

<style scoped>
.title-screen {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-deep);
}

.title-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.game-title {
  font-family: var(--font-serif);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.game-subtitle {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 3rem;
  letter-spacing: 0.15em;
}

.title-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary {
  padding: 0.85rem 2rem;
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-size: 1rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-bg-deep);
}

.btn-primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.7rem 2rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.btn-secondary:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.no-key-hint {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  opacity: 0.8;
}

.game-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 45vh;
  overflow-y: auto;
}

.narrative-container {
  padding: 2rem 2rem 2.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.loading-indicator {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 2rem;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.nav-overlay {
  position: fixed;
  top: 0.75rem;
  right: 1rem;
  z-index: 200;
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  width: 36px;
  height: 36px;
  background: var(--color-hud-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent);
}
</style>
