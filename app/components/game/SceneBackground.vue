<template>
  <div class="scene-background">
    <!-- Always-rendered placeholder ensures the screen is never fully black -->
    <div class="scene-placeholder" />
    <Transition name="scene-fade" mode="out-in">
      <img
        v-if="currentImage"
        :key="currentImage"
        :src="currentImage"
        alt=""
        class="scene-image"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      >
    </Transition>
    <div v-if="loading" class="scene-loading">
      <div class="loading-shimmer" />
    </div>
    <div class="scene-overlay" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentImage: string | null
  loading: boolean
}>()
</script>

<style scoped>
.scene-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.scene-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  inset: 0;
}

.scene-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    160deg,
    var(--color-bg-mid) 0%,
    var(--color-bg-deep) 50%,
    var(--color-bg-surface, var(--color-bg-mid)) 100%
  );
  animation: gradient-shift 8s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.scene-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0.7) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
}

.scene-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-bg-deep) 25%,
    var(--color-bg-mid) 50%,
    var(--color-bg-deep) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.scene-fade-enter-active,
.scene-fade-leave-active {
  transition: opacity 0.8s ease;
}
.scene-fade-enter-from,
.scene-fade-leave-to {
  opacity: 0;
}
</style>
