<template>
  <div class="historical-map-page">
    <!-- Map Container (client-only for Leaflet) -->
    <ClientOnly>
      <MapCanvas
        :selected-id="selectedId"
        @select="onMapSelect"
      />
    </ClientOnly>

    <!-- Top Header Bar -->
    <div class="map-header">
      <button class="header-btn" @click="navigateTo('/')">
        <span class="btn-icon">&#10005;</span>
      </button>
      <div class="header-title">
        <span class="title-ornament">&#9830;</span>
        <h1>{{ $t('map.entry') }}</h1>
        <span class="title-ornament">&#9830;</span>
      </div>
      <div class="header-badge">
        {{ scenarios.length }} {{ $t('map.scenarios') }}
      </div>
    </div>

    <!-- Compass Rose -->
    <div class="compass-rose">
      <svg viewBox="0 0 80 80" class="compass-svg">
        <circle cx="40" cy="40" r="38" fill="none" stroke="var(--color-accent)" stroke-width="0.5" opacity="0.4" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="var(--color-accent)" stroke-width="0.3" opacity="0.3" />
        <polygon points="40,4 43,36 40,32 37,36" fill="var(--color-accent)" opacity="0.9" />
        <polygon points="40,76 43,44 40,48 37,44" fill="var(--color-accent)" opacity="0.4" />
        <polygon points="76,40 44,37 48,40 44,43" fill="var(--color-accent)" opacity="0.4" />
        <polygon points="4,40 36,37 32,40 36,43" fill="var(--color-accent)" opacity="0.4" />
        <polygon points="65,15 45,37 47,35 43,35" fill="var(--color-accent)" opacity="0.2" />
        <polygon points="15,65 35,43 33,45 37,45" fill="var(--color-accent)" opacity="0.2" />
        <polygon points="65,65 45,43 47,45 43,45" fill="var(--color-accent)" opacity="0.2" />
        <polygon points="15,15 35,37 33,35 37,35" fill="var(--color-accent)" opacity="0.2" />
        <circle cx="40" cy="40" r="3" fill="var(--color-accent)" opacity="0.6" />
        <text x="40" y="16" text-anchor="middle" fill="var(--color-accent)" font-size="7" font-weight="bold" opacity="0.8">N</text>
      </svg>
    </div>

    <!-- Left Sidebar: Scenario List -->
    <div class="map-sidebar">
      <div class="sidebar-header">
        <h2>{{ $t('map.timeline') }}</h2>
      </div>
      <div class="sidebar-list">
        <div
          v-for="(s, idx) in sortedScenarios"
          :key="s.id"
          class="scenario-item"
          :class="{ active: selectedId === s.id }"
          @click="selectScenario(s.id)"
        >
          <div class="item-era-dot" :style="{ background: getEraColor(s.birthInfo.birthYear) }"></div>
          <div class="item-info">
            <div class="item-name">{{ s.birthInfo.name }}</div>
            <div class="item-meta">
              <span class="item-year">{{ formatYear(s.birthInfo.birthYear) }}</span>
              <span class="item-sep">·</span>
              <span class="item-city">{{ s.birthInfo.location.city || s.birthInfo.location.country }}</span>
            </div>
          </div>
          <div class="item-era-label">{{ s.birthInfo.era }}</div>
        </div>
      </div>
    </div>

    <!-- Right Detail Panel -->
    <div v-if="selectedScenario" class="detail-panel">
      <div class="panel-header">
        <div class="panel-ornament">&#9830;</div>
        <button class="panel-close" @click="selectedId = null">&#10005;</button>
      </div>

      <div class="panel-body">
          <div class="panel-portrait">
            <div class="portrait-frame" :style="{ borderColor: getEraColor(selectedScenario.birthInfo.birthYear) }">
              <span class="portrait-icon">{{ getEraIcon(selectedScenario.birthInfo.birthYear) }}</span>
            </div>
          </div>

          <h2 class="panel-name">{{ selectedScenario.birthInfo.name }}</h2>
          <p class="panel-name-en">{{ selectedScenario.birthInfo.nameEn }}</p>

          <div class="panel-divider"></div>

          <div class="panel-stats">
            <div class="stat-row">
              <span class="stat-label">{{ $t('map.era') }}</span>
              <span class="stat-value era-value">{{ selectedScenario.birthInfo.era }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ $t('map.birthYear') }}</span>
              <span class="stat-value">{{ formatYear(selectedScenario.birthInfo.birthYear) }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ $t('map.region') }}</span>
              <span class="stat-value">{{ selectedScenario.birthInfo.location.region }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ $t('map.location') }}</span>
              <span class="stat-value">{{ selectedScenario.birthInfo.location.city || selectedScenario.birthInfo.location.country }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ $t('map.occupation') }}</span>
              <span class="stat-value">{{ selectedScenario.birthInfo.occupation }}</span>
            </div>
          </div>

          <div class="panel-divider"></div>

          <div class="panel-traits">
            <span
              v-for="trait in selectedScenario.birthInfo.traits"
              :key="trait"
              class="trait-tag"
            >{{ trait }}</span>
          </div>

          <button class="btn-start" @click="startScenario(selectedScenario.id)">
            {{ $t('map.startJourney') }}
          </button>
        </div>
      </div>

    <!-- Bottom Timeline Bar -->
    <div class="bottom-timeline">
      <div class="timeline-track">
        <div class="timeline-line"></div>
        <div
          v-for="s in sortedScenarios"
          :key="s.id"
          class="timeline-marker"
          :class="{ active: selectedId === s.id }"
          :style="{ left: getTimelinePosition(s.birthInfo.birthYear), background: getEraColor(s.birthInfo.birthYear) }"
          :title="`${s.birthInfo.name} - ${formatYear(s.birthInfo.birthYear)}`"
          @click="selectScenario(s.id)"
        ></div>
      </div>
      <div class="timeline-labels">
        <span>3000 BC</span>
        <span>1000 BC</span>
        <span>1</span>
        <span>1000</span>
        <span>2000</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapCanvas from '~/components/map/MapCanvas.client.vue'
import { BUILT_IN_SCENARIOS } from '~/data/scenarios'
import type { PreBuiltScenario } from '~/data/types'

const selectedId = ref<string | null>(null)
const scenarios = BUILT_IN_SCENARIOS

const sortedScenarios = computed(() =>
  [...scenarios].sort((a, b) => a.birthInfo.birthYear - b.birthInfo.birthYear)
)

const selectedScenario = computed(() =>
  scenarios.find(s => s.id === selectedId.value) || null
)

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`
  if (year === 0) return '1 AD'
  return `${year} AD`
}

function getEraColor(year: number): string {
  if (year < -500) return '#DAA520'
  if (year < 500) return '#CD853F'
  if (year < 1000) return '#20B2AA'
  if (year < 1500) return '#3CB371'
  if (year < 1700) return '#4682B4'
  if (year < 1900) return '#6495ED'
  return '#708090'
}

function getEraIcon(year: number): string {
  if (year < -500) return '𓂀'
  if (year < 500) return '🏛'
  if (year < 1000) return '⚔'
  if (year < 1500) return '🏯'
  if (year < 1700) return '⛵'
  if (year < 1900) return '📜'
  return '⚙'
}

function getTimelinePosition(year: number): string {
  const minYear = -3000
  const maxYear = 2000
  const pct = ((year - minYear) / (maxYear - minYear)) * 100
  return `${Math.max(2, Math.min(98, pct))}%`
}

function selectScenario(id: string) {
  selectedId.value = id
}

function onMapSelect(id: string) {
  selectedId.value = id
}

function startScenario(id: string) {
  navigateTo(`/?scenario=${id}`)
}
</script>

<style scoped>
.historical-map-page {
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  overflow: hidden;
}

/* ===== Header Bar ===== */
.map-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.8) 80%, transparent 100%);
  border-bottom: 1px solid rgba(200, 164, 92, 0.15);
}

.header-btn {
  width: 34px;
  height: 34px;
  background: transparent;
  border: 1px solid rgba(200, 164, 92, 0.3);
  border-radius: 4px;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.header-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.btn-icon { font-size: 0.8rem; }

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.header-title h1 {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  margin: 0;
}
.title-ornament {
  color: var(--color-accent);
  opacity: 0.4;
  font-size: 0.6rem;
}

.header-badge {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  padding: 0.3rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  letter-spacing: 0.03em;
}

/* ===== Compass Rose ===== */
.compass-rose {
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
  width: 70px;
  height: 70px;
  opacity: 0.6;
  pointer-events: none;
}

/* ===== Left Sidebar ===== */
.map-sidebar {
  position: absolute;
  top: 52px;
  left: 0;
  bottom: 56px;
  width: 280px;
  z-index: 1000;
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.92) 0%, rgba(20, 18, 12, 0.88) 100%);
  border-right: 1px solid rgba(200, 164, 92, 0.12);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
}

.sidebar-header {
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid rgba(200, 164, 92, 0.1);
}
.sidebar-header h2 {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  margin: 0;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.scenario-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}
.scenario-item:hover {
  background: rgba(200, 164, 92, 0.05);
  border-left-color: rgba(200, 164, 92, 0.3);
}
.scenario-item.active {
  background: rgba(200, 164, 92, 0.08);
  border-left-color: var(--color-accent);
}

.item-era-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px currentColor;
}

.item-info {
  flex: 1;
  min-width: 0;
}
.item-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-meta {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  display: flex;
  gap: 0.3rem;
  margin-top: 2px;
}
.item-sep { opacity: 0.4; }

.item-era-label {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  opacity: 0.6;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ===== Detail Panel ===== */
.detail-panel {
  position: absolute;
  top: 52px;
  right: 0;
  bottom: 56px;
  width: 320px;
  z-index: 1000;
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(25, 20, 12, 0.92) 100%);
  border-left: 1px solid rgba(200, 164, 92, 0.15);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: panel-slide-in 0.3s ease forwards;
}

@keyframes panel-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(200, 164, 92, 0.1);
}
.panel-ornament {
  color: var(--color-accent);
  opacity: 0.4;
  font-size: 0.6rem;
}
.panel-close {
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s;
}
.panel-close:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.panel-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.panel-portrait {
  margin-bottom: 1rem;
}
.portrait-frame {
  width: 80px;
  height: 80px;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(200, 164, 92, 0.05);
  box-shadow: 0 0 20px rgba(200, 164, 92, 0.1);
}
.portrait-icon {
  font-size: 2rem;
}

.panel-name {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin: 0;
  letter-spacing: 0.05em;
}
.panel-name-en {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-top: 0.25rem;
  font-style: italic;
}

.panel-divider {
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 164, 92, 0.3), transparent);
  margin: 1.25rem 0;
}

.panel-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}
.stat-value {
  font-size: 0.85rem;
  color: var(--color-text-primary);
  font-weight: 500;
}
.era-value {
  color: var(--color-accent);
}

.panel-traits {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.trait-tag {
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-accent);
  border: 1px solid rgba(200, 164, 92, 0.25);
  border-radius: 12px;
  background: rgba(200, 164, 92, 0.05);
  letter-spacing: 0.03em;
}

.btn-start {
  width: 100%;
  padding: 0.8rem 1.5rem;
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-family: var(--font-serif);
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
}
.btn-start:hover {
  background: var(--color-accent);
  color: var(--color-bg-deep);
}

/* ===== Bottom Timeline ===== */
.bottom-timeline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 56px;
  background: linear-gradient(0deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.8) 80%, transparent 100%);
  border-top: 1px solid rgba(200, 164, 92, 0.1);
  padding: 10px 2rem 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-track {
  position: relative;
  height: 16px;
  margin: 0 1rem;
}
.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(200, 164, 92, 0.2);
  transform: translateY(-50%);
}

.timeline-marker {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 0 8px rgba(200, 164, 92, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.timeline-marker:hover,
.timeline-marker.active {
  width: 14px;
  height: 14px;
  box-shadow: 0 0 14px rgba(200, 164, 92, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 0.65rem;
  color: var(--color-text-muted);
  opacity: 0.5;
  letter-spacing: 0.03em;
}

/* ===== Transitions ===== */
</style>

<style>
/* Global Leaflet tooltip styling (unscoped) */
.custom-tooltip {
  background: rgba(10, 10, 15, 0.92) !important;
  border: 1px solid rgba(200, 164, 92, 0.3) !important;
  border-radius: 4px !important;
  padding: 0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
}
.custom-tooltip .leaflet-tooltip-tip {
  display: none !important;
}
.map-tooltip {
  padding: 0.5rem 0.75rem;
  font-family: 'Noto Serif SC', 'Source Serif Pro', Georgia, serif;
  font-size: 0.82rem;
  color: #e8e6e3;
  text-align: center;
  line-height: 1.4;
}
.tooltip-year {
  font-size: 0.7rem;
  color: #c8a45c;
  font-family: 'Inter', sans-serif;
}

/* Marker glow animation */
.marker-glow {
  animation: marker-pulse 3s ease-in-out infinite;
}
@keyframes marker-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Leaflet control overrides */
.leaflet-control-zoom {
  border: 1px solid rgba(200, 164, 92, 0.2) !important;
  border-radius: 4px !important;
  overflow: hidden;
}
.leaflet-control-zoom a {
  background: rgba(10, 10, 15, 0.85) !important;
  color: #c8a45c !important;
  border-color: rgba(200, 164, 92, 0.1) !important;
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
  font-size: 14px !important;
}
.leaflet-control-zoom a:hover {
  background: rgba(200, 164, 92, 0.15) !important;
}
</style>
