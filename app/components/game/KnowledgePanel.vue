<template>
  <Teleport to="body">
    <Transition name="panel-backdrop">
      <div v-if="visible" class="panel-backdrop" @click="$emit('close')" />
    </Transition>
    <Transition name="panel-slide">
      <div v-if="visible" class="knowledge-panel">
        <div class="panel-header">
          <h2 class="panel-title">{{ $t('knowledge.title') }}</h2>
          <button class="panel-close" @click="$emit('close')">&times;</button>
        </div>

        <div class="panel-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'encyclopedia' }"
            @click="activeTab = 'encyclopedia'"
          >
            {{ $t('knowledge.encyclopedia') }}
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'timeline' }"
            @click="activeTab = 'timeline'"
          >
            {{ $t('knowledge.timeline') }}
          </button>
        </div>

        <div class="panel-content">
          <!-- Encyclopedia Tab -->
          <div v-if="activeTab === 'encyclopedia'" class="encyclopedia-section">
            <div v-if="context" class="context-header">
              <div class="context-era">{{ context.era }}</div>
              <div class="context-meta">
                <span>{{ context.year }} CE</span>
                <span class="meta-divider">|</span>
                <span>{{ context.location }}</span>
              </div>
            </div>

            <div v-if="encyclopedia" class="encyclopedia-text">
              {{ encyclopedia }}
            </div>

            <div v-else class="encyclopedia-empty">
              <div v-if="currentEvent" class="fallback-event">
                <span class="event-label">{{ $t('knowledge.event') }}</span>
                <span class="event-text">{{ currentEvent }}</span>
              </div>
              <p class="no-encyclopedia">{{ $t('knowledge.noEncyclopedia') }}</p>
            </div>
          </div>

          <!-- Timeline Tab -->
          <div v-if="activeTab === 'timeline'" class="timeline-section">
            <div v-if="timeline.length === 0" class="timeline-empty">
              {{ $t('knowledge.journeyBegins') }}
            </div>
            <div v-else class="timeline-list" ref="timelineRef">
              <div
                v-for="(entry, index) in timeline"
                :key="index"
                class="timeline-entry"
                :class="{ current: entry.isCurrent }"
              >
                <div class="timeline-dot" />
                <div class="timeline-line" v-if="index < timeline.length - 1" />
                <div class="timeline-content">
                  <div class="timeline-year">
                    {{ entry.year }} CE
                    <span class="timeline-age">({{ $t('hud.age') }} {{ entry.playerAge }})</span>
                  </div>
                  <div v-if="entry.historicalEvent" class="timeline-event">
                    {{ entry.historicalEvent }}
                  </div>
                  <div v-if="entry.npcsMet && entry.npcsMet.length > 0" class="timeline-npcs">
                    {{ $t('knowledge.npcsMet') }}: {{ entry.npcsMet.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useKnowledgePanel } from '~/composables/useKnowledgePanel'
import { useGameStore } from '~/stores/gameStore'

defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()

const activeTab = ref<'encyclopedia' | 'timeline'>('encyclopedia')
const timelineRef = ref<HTMLElement | null>(null)

const { getCurrentEncyclopedia, getTimeline, getCurrentContext } = useKnowledgePanel()
const gameStore = useGameStore()

const encyclopedia = computed(() => getCurrentEncyclopedia())
const timeline = computed(() => getTimeline())
const context = computed(() => getCurrentContext())
const currentEvent = computed(() => {
  const events = gameStore.eventHistory
  if (events.length === 0) return null
  return events[events.length - 1].historicalEvent
})

watch(activeTab, (tab) => {
  if (tab === 'timeline') {
    nextTick(() => {
      if (timelineRef.value) {
        timelineRef.value.scrollTop = timelineRef.value.scrollHeight
      }
    })
  }
})
</script>

<style scoped>
.panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: 149;
  background: rgba(0, 0, 0, 0.4);
}

.knowledge-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 150;
  width: min(380px, 85vw);
  display: flex;
  flex-direction: column;
  background: var(--color-hud-bg);
  backdrop-filter: blur(16px);
  border-left: 1px solid var(--color-border);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-accent);
  margin: 0;
}

.panel-close {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
}
.panel-close:hover {
  color: var(--color-text-primary);
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  flex: 1;
  padding: 0.65rem 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.tab-btn:hover {
  color: var(--color-text-primary);
}
.tab-btn.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

/* Encyclopedia */
.context-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.context-era {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 0.25rem;
}

.context-meta {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.meta-divider {
  margin: 0 0.4rem;
  color: var(--color-border);
}

.encyclopedia-text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-primary);
}

.encyclopedia-empty {
  color: var(--color-text-secondary);
}

.fallback-event {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-left: 2px solid var(--color-accent);
  background: rgba(200, 164, 92, 0.05);
}

.event-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-text {
  font-size: 0.9rem;
  color: var(--color-text-primary);
}

.no-encyclopedia {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin-top: 0.5rem;
}

/* Timeline */
.timeline-empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem 0;
  font-style: italic;
}

.timeline-list {
  position: relative;
}

.timeline-entry {
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 1.25rem;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 0.35rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.timeline-entry.current .timeline-dot {
  background: var(--color-accent);
  border-color: var(--color-accent);
  box-shadow: 0 0 6px rgba(200, 164, 92, 0.4);
}

.timeline-line {
  position: absolute;
  left: 3.5px;
  top: 14px;
  bottom: 0;
  width: 1px;
  background: var(--color-border);
}

.timeline-content {
  padding-left: 0.5rem;
}

.timeline-year {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.15rem;
}

.timeline-age {
  font-weight: 400;
  color: var(--color-text-secondary);
  margin-left: 0.25rem;
}

.timeline-entry.current .timeline-year {
  color: var(--color-accent);
}

.timeline-event {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.timeline-npcs {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.2rem;
}

/* Transitions */
.panel-slide-enter-active {
  transition: transform 0.3s ease-out;
}
.panel-slide-leave-active {
  transition: transform 0.2s ease-in;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}

.panel-backdrop-enter-active {
  transition: opacity 0.3s ease;
}
.panel-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.panel-backdrop-enter-from,
.panel-backdrop-leave-to {
  opacity: 0;
}
</style>
