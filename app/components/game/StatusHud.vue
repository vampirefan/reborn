<template>
  <div class="status-hud">
    <div class="hud-row hud-top">
      <div class="hud-left">
        <button class="hud-menu-btn" :title="$t('game.mainMenu')" @click="$emit('menu')">
          &#9776;
        </button>
        <span class="hud-era">{{ era }}</span>
        <span class="hud-divider">|</span>
        <span class="hud-location">{{ location }}</span>
      </div>
      <div class="hud-right">
        <span class="hud-age">{{ $t('hud.age') }}: {{ age }}</span>
        <span class="hud-divider">|</span>
        <span class="hud-health" :class="healthClass">
          &#9829; {{ health }}
        </span>
      </div>
    </div>
    <div v-if="stats" class="hud-row hud-stats">
      <span class="stat-item">{{ $t('hud.body') }} {{ stats.body }}</span>
      <span class="stat-item">{{ $t('hud.mind') }} {{ stats.mind }}</span>
      <span class="stat-item">{{ $t('hud.charisma') }} {{ stats.charisma }}</span>
      <span class="stat-item">{{ $t('hud.luck') }} {{ stats.luck }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerStats } from '~~/shared/types/player'

const props = defineProps<{
  era: string
  location: string
  age: number
  health: number
  stats?: PlayerStats
}>()

defineEmits<{
  menu: []
}>()

const healthClass = computed(() => {
  if (props.health > 60) return 'health-good'
  if (props.health > 30) return 'health-warn'
  return 'health-critical'
})
</script>

<style scoped>
.status-hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 0.6rem 1.5rem;
  background: var(--color-hud-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
  gap: 0.3rem;
}

.hud-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hud-left,
.hud-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hud-menu-btn {
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
}

.hud-menu-btn:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.hud-stats {
  justify-content: center;
  gap: 1.2rem;
  font-size: 0.78rem;
  opacity: 0.85;
}

.stat-item {
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
}

.hud-era {
  color: var(--color-accent);
  font-weight: 600;
}

.hud-location {
  color: var(--color-text-secondary);
}

.hud-age {
  color: var(--color-text-secondary);
}

.hud-divider {
  color: var(--color-border);
}

.hud-health {
  font-weight: 600;
}

.health-good {
  color: var(--color-health-good);
}
.health-warn {
  color: var(--color-health-warn);
}
.health-critical {
  color: var(--color-health-critical);
}
</style>
