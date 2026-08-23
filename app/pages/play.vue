<template>
  <div class="map-page">
    <div class="map-content">
      <h1 class="map-title">{{ $t('map.entry') }}</h1>
      <p class="map-subtitle">{{ $t('knowledge.journeyBegins') }}</p>
      <div class="map-placeholder">
        <span class="map-icon">&#127758;</span>
        <p>{{ $t('errors.generationFailed') }}</p>
      </div>
      <button class="btn-back" @click="navigateTo('/')">
        {{ $t('game.back') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.map-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-deep);
}

.map-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.map-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.map-subtitle {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.map-placeholder {
  padding: 3rem 2rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.map-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.map-placeholder p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.btn-back {
  padding: 0.7rem 2rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.btn-back:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
