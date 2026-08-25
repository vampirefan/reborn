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
        @menu="showQuitConfirm = true"
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
            <button
              class="btn-primary"
              @click="navigateTo('/play')"
            >
              {{ $t('map.entry') }}
            </button>
            <button class="btn-secondary" @click="navigateTo('/settings')">
              {{ $t('settings.title') }}
            </button>
            <button class="btn-secondary" @click="navigateTo('/history')">
              {{ $t('history.pastLives') }}
            </button>
            <button class="btn-secondary" @click="navigateTo('/admin')">
              {{ $t('admin.entry') }}
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

          <!-- Historical note (after picking an isHistorical choice) -->
          <Transition name="historical-fade">
            <div
              v-if="gameStore.historicalNote && showChoices"
              class="historical-note"
            >
              <span class="historical-note-label">&#9733; {{ $t('knowledge.historicalNote') }}</span>
              <span class="historical-note-text">{{ gameStore.historicalNote }}</span>
            </div>
          </Transition>

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
        <button class="nav-btn" @click="navigateTo('/settings')" :title="$t('settings.title')">
          &#9881;
        </button>
      </div>

      <!-- Quit to menu confirmation dialog -->
      <Transition name="fade">
        <div v-if="showQuitConfirm" class="confirm-overlay" @click.self="showQuitConfirm = false">
          <div class="confirm-dialog">
            <h3 class="confirm-title">{{ $t('game.confirmQuitTitle') }}</h3>
            <p class="confirm-text">{{ $t('game.confirmQuit') }}</p>
            <div class="confirm-actions">
              <button class="btn-confirm" @click="returnToMainMenu">{{ $t('game.confirm') }}</button>
              <button class="btn-cancel" @click="showQuitConfirm = false">{{ $t('game.cancel') }}</button>
            </div>
          </div>
        </div>
      </Transition>

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
const { startNewLife, startSelectedLife, makeChoice, rebirth, resumeGame: resumeFromStorage } = useGameEngine()
const { initializeAll } = usePersistence()

const showChoices = ref(false)
const hasSavedGame = ref(false)
const deathCause = ref('')
const knowledgePanelOpen = ref(false)
const showQuitConfirm = ref(false)

const locationDisplay = computed(() => {
  if (!gameStore.currentPlayer) return ''
  const loc = gameStore.currentPlayer.location
  return [loc.city, loc.country].filter(Boolean).join(', ')
})

onMounted(async () => {
  initializeAll()

  // Check if we're coming from the map with a scenario selection
  const route = useRoute()
  const scenarioId = route.query.scenario as string | null
  if (scenarioId && gameStore.status === 'idle') {
    await startSelectedLife(scenarioId)
    // Clean up the URL
    navigateTo('/', { replace: true })
    return
  }

  // If game is already active in memory (SPA back-navigation from settings/history), keep it
  if (gameStore.status !== 'idle') {
    hasSavedGame.value = true
    return
  }

  // Fresh page load (refresh): always show the title screen.
  // Only check whether a save exists — restore it when the user clicks "继续旅程".
  hasSavedGame.value = gameStore.hasSave()
  gameStore.setStatus('idle')
})

async function startNew() {
  showChoices.value = false
  await startNewLife()
}

function resumeGame() {
  // Load the saved game on explicit user action
  if (gameStore.loadFromStorage()) {
    showChoices.value = true
  }
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

function returnToMainMenu() {
  showQuitConfirm.value = false
  knowledgePanelOpen.value = false
  showChoices.value = false
  gameStore.saveToStorage()
  gameStore.setStatus('idle')
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
  top: 4.5rem;
  right: 1rem;
  z-index: 150;
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

.historical-note {
  margin: 1rem 0 0.25rem;
  padding: 0.65rem 1rem;
  border-left: 3px solid var(--color-accent);
  background: rgba(218, 165, 32, 0.06);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.historical-note-label {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.historical-note-text {
  font-style: italic;
}

.historical-fade-enter-active {
  transition: all 0.5s ease;
}
.historical-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

/* Confirm dialog */
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: var(--color-bg-deep);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  max-width: 360px;
  width: 90%;
  text-align: center;
}

.confirm-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.confirm-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-confirm {
  padding: 0.6rem 1.5rem;
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.btn-confirm:hover {
  background: var(--color-accent);
  color: var(--color-bg-deep);
}

.btn-cancel {
  padding: 0.6rem 1.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.btn-cancel:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
