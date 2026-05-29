<template>
  <Transition name="birth-fade">
    <div v-if="visible" class="birth-transition">
      <div class="birth-content">
        <div class="birth-particles">
          <span v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)" />
        </div>
        <div class="birth-text">
          <p class="birth-subtitle">{{ $t('transitions.birthMessage') }}</p>
          <h1 v-if="era" class="birth-era">{{ era }}</h1>
          <p v-if="year" class="birth-year">{{ year }} {{ year < 0 ? 'BCE' : 'CE' }}</p>
          <p v-if="location" class="birth-location">{{ location }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  era?: string
  year?: number
  location?: string
}>()

function particleStyle(i: number) {
  const angle = (i / 20) * 360
  const delay = Math.random() * 2
  const distance = 100 + Math.random() * 200
  return {
    '--angle': `${angle}deg`,
    '--delay': `${delay}s`,
    '--distance': `${distance}px`,
  }
}
</script>

<style scoped>
.birth-transition {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-deep);
}

.birth-content {
  position: relative;
  text-align: center;
}

.birth-particles {
  position: absolute;
  inset: -100px;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 3px;
  background: var(--color-accent);
  border-radius: 50%;
  opacity: 0;
  animation: particle-float 3s ease-out var(--delay) infinite;
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -1));
  }
}

.birth-text {
  position: relative;
  z-index: 1;
}

.birth-subtitle {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.birth-era {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  font-family: var(--font-serif);
}

.birth-year {
  font-size: 1.5rem;
  color: var(--color-accent);
  margin-bottom: 0.25rem;
}

.birth-location {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.birth-fade-enter-active {
  transition: opacity 0.5s ease;
}
.birth-fade-leave-active {
  transition: opacity 1.5s ease;
}
.birth-fade-enter-from,
.birth-fade-leave-to {
  opacity: 0;
}
</style>
