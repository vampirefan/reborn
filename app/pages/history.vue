<template>
  <div class="history-page">
    <header class="history-header">
      <button class="back-btn" @click="navigateTo('/')">
        &larr; {{ $t('game.back') }}
      </button>
      <h1>{{ $t('history.pastLives') }}</h1>
    </header>

    <!-- Statistics -->
    <section v-if="historyStore.pastLives.length > 0" class="stats-section">
      <div class="stat-card">
        <span class="stat-number">{{ historyStore.statistics.totalLives }}</span>
        <span class="stat-label">{{ $t('history.totalLives') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ historyStore.statistics.totalYearsLived }}</span>
        <span class="stat-label">{{ $t('history.totalYears') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ historyStore.statistics.uniqueEras.length }}</span>
        <span class="stat-label">{{ $t('history.uniqueEras') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ historyStore.statistics.oldestAge }}</span>
        <span class="stat-label">{{ $t('history.oldestAge') }}</span>
      </div>
    </section>

    <!-- Achievements -->
    <section v-if="historyStore.achievements.length > 0" class="achievements-section">
      <h2>{{ $t('history.achievements') }}</h2>
      <div class="achievements-grid">
        <div
          v-for="achievement in historyStore.achievements"
          :key="achievement.id"
          class="achievement-badge"
        >
          <span class="achievement-icon">{{ achievement.icon }}</span>
          <span class="achievement-title">{{ $t(achievement.titleKey) }}</span>
        </div>
      </div>
    </section>

    <!-- Past Lives List -->
    <section class="lives-section">
      <div v-if="historyStore.pastLives.length === 0" class="empty-state">
        <p>{{ $t('history.noLives') }}</p>
      </div>
      <div
        v-for="life in historyStore.pastLives"
        :key="life.id"
        class="life-card"
      >
        <div class="life-header">
          <h3 class="life-name">{{ life.name }}</h3>
          <span class="life-years">{{ life.birthYear }} - {{ life.deathYear }} CE</span>
        </div>
        <div class="life-details">
          <span class="life-era">{{ life.era }}</span>
          <span class="life-divider">|</span>
          <span class="life-location">{{ life.location }}</span>
          <span class="life-divider">|</span>
          <span class="life-occupation">{{ life.occupation }}</span>
        </div>
        <p class="life-death">{{ life.causeOfDeath }}</p>
        <div v-if="life.keyEvents.length > 0" class="life-events">
          <span
            v-for="(event, i) in life.keyEvents.slice(0, 3)"
            :key="i"
            class="event-tag"
          >
            {{ event }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '~/stores/historyStore'

const historyStore = useHistoryStore()

onMounted(() => {
  historyStore.loadFromStorage()
})
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-deep);
  color: var(--color-text-primary);
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.history-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: var(--color-choice-bg);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-accent);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

.achievements-section {
  margin-bottom: 2rem;
}

.achievements-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

.achievements-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.achievement-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 0.85rem;
}

.achievement-icon {
  font-size: 1.1rem;
}

.lives-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}

.life-card {
  padding: 1.25rem;
  margin-bottom: 1rem;
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: border-color 0.2s;
}

.life-card:hover {
  border-color: var(--color-accent);
}

.life-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.life-name {
  font-size: 1.1rem;
  font-weight: 600;
  font-family: var(--font-serif);
}

.life-years {
  font-size: 0.85rem;
  color: var(--color-accent);
}

.life-details {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.life-divider {
  margin: 0 0.4rem;
  color: var(--color-border);
}

.life-death {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.life-events {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.event-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: var(--color-bg-mid);
  border-radius: 3px;
  color: var(--color-text-secondary);
}
</style>
