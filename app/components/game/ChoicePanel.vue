<template>
  <Transition name="choices-slide">
    <div v-if="choices.length > 0 && visible" class="choice-panel">
      <button
        v-for="choice in choices"
        :key="choice.id"
        class="choice-button"
        :class="{ 'is-historical': choice.isHistorical }"
        :disabled="disabled"
        @click="$emit('select', choice.id)"
      >
        <span class="choice-marker">&#9657;</span>
        <span class="choice-text">{{ choice.text }}</span>
        <span v-if="choice.isHistorical" class="historical-badge" :title="$t('game.historicalTip')">
          &#9733; {{ $t('game.historical') }}
        </span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Choice } from '~~/shared/types/game'

defineProps<{
  choices: Choice[]
  visible: boolean
  disabled: boolean
}>()

defineEmits<{
  select: [choiceId: string]
}>()
</script>

<style scoped>
.choice-panel {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.choice-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.2rem;
  background: var(--color-choice-bg);
  border: 1px solid var(--color-choice-border);
  border-radius: 6px;
  color: var(--color-text-primary);
  font-size: var(--font-size-choice);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.choice-button:hover:not(:disabled) {
  background: var(--color-choice-hover);
  border-color: var(--color-accent);
  transform: translateX(4px);
}

.choice-button:active:not(:disabled) {
  transform: translateX(2px);
}

.choice-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.choice-marker {
  color: var(--color-accent);
  font-size: 1rem;
  flex-shrink: 0;
}

.choice-text {
  flex: 1;
}

.choice-button.is-historical {
  border-color: var(--color-accent);
  background: linear-gradient(
    90deg,
    var(--color-choice-bg) 0%,
    rgba(218, 165, 32, 0.08) 100%
  );
}

.historical-badge {
  flex-shrink: 0;
  margin-left: auto;
  padding: 0.18rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-bg-deep);
  background: var(--color-accent);
  border-radius: 999px;
  white-space: nowrap;
}

.choices-slide-enter-active {
  transition: all 0.4s ease-out;
}
.choices-slide-leave-active {
  transition: all 0.2s ease-in;
}
.choices-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.choices-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
