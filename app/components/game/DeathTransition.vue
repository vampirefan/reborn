<template>
  <Transition name="death-fade">
    <div v-if="visible" class="death-transition">
      <div class="death-content">
        <div class="death-vignette" />
        <div class="death-info">
          <p class="death-message">{{ $t('transitions.deathMessage') }}</p>
          <h2 class="death-name">{{ name }}</h2>
          <p class="death-years">{{ birthYear }} - {{ deathYear }} CE</p>
          <p class="death-era">{{ era }}</p>
          <p class="death-cause">{{ causeOfDeath }}</p>

          <div class="death-summary">
            <div class="summary-stat">
              <span class="stat-value">{{ age }}</span>
              <span class="stat-label">{{ $t('hud.age') }}</span>
            </div>
            <div class="summary-stat">
              <span class="stat-value">{{ turns }}</span>
              <span class="stat-label">{{ $t('game.events') }}</span>
            </div>
          </div>

          <div v-if="narrative" class="death-narrative">
            <p>{{ narrative }}</p>
          </div>

          <button class="rebirth-button" @click="$emit('rebirth')">
            {{ $t('game.rebirth') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  name: string
  birthYear: number
  deathYear: number
  era: string
  age: number
  turns: number
  causeOfDeath: string
  narrative: string
}>()

defineEmits<{
  rebirth: []
}>()
</script>

<style scoped>
.death-transition {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-deep);
}

.death-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.death-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
}

.death-info {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.death-message {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.death-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  font-family: var(--font-serif);
}

.death-years {
  font-size: 1.25rem;
  color: var(--color-accent);
  margin-bottom: 0.25rem;
}

.death-era {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.death-cause {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin-bottom: 2rem;
}

.death-summary {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.death-narrative {
  margin-bottom: 2rem;
  padding: 1rem;
  border-left: 2px solid var(--color-border);
  text-align: left;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.rebirth-button {
  padding: 0.85rem 2.5rem;
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-size: 1rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.rebirth-button:hover {
  background: var(--color-accent);
  color: var(--color-bg-deep);
}

.death-fade-enter-active {
  transition: opacity 2s ease;
}
.death-fade-leave-active {
  transition: opacity 0.5s ease;
}
.death-fade-enter-from,
.death-fade-leave-to {
  opacity: 0;
}
</style>
