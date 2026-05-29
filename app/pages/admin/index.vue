<template>
  <div class="admin-page">
    <header class="admin-header">
      <button class="back-btn" @click="navigateTo('/')">
        &larr; {{ $t('game.back') }}
      </button>
      <h1>{{ $t('admin.title') }}</h1>
      <div class="header-actions">
        <button class="primary-btn" @click="onCreate">
          + {{ $t('admin.create') }}
        </button>
        <label class="secondary-btn">
          {{ $t('admin.import') }}
          <input
            type="file"
            accept="application/json,.json"
            class="hidden-input"
            @change="onImport"
          >
        </label>
      </div>
    </header>

    <p v-if="importMessage" class="import-msg" :class="{ error: importError }">
      {{ importMessage }}
    </p>

    <!-- Built-in scenarios (read-only, fork to edit) -->
    <section class="scenario-section">
      <h2>{{ $t('admin.builtInList') }}</h2>
      <p class="section-hint">{{ $t('admin.builtInHint') }}</p>
      <div class="scenario-grid">
        <article
          v-for="s in builtIns"
          :key="s.id"
          class="scenario-card built-in"
        >
          <header class="card-head">
            <h3>{{ lang === 'en' ? s.birthInfo.nameEn : s.birthInfo.name }}</h3>
            <span class="badge">{{ $t('admin.readOnly') }}</span>
          </header>
          <p class="card-meta">
            {{ lang === 'en' ? s.birthInfo.eraEn : s.birthInfo.era }}
            ·
            {{ lang === 'en' ? s.birthInfo.occupationEn : s.birthInfo.occupation }}
          </p>
          <p class="card-stats">
            {{ Object.keys(s.nodes).length }} {{ $t('admin.nodes') }}
          </p>
          <div class="card-actions">
            <button class="link-btn" @click="onFork(s.id)">
              {{ $t('admin.fork') }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- User scenarios (editable) -->
    <section class="scenario-section">
      <h2>{{ $t('admin.userList') }}</h2>
      <div v-if="userList.length === 0" class="empty-state">
        <p>{{ $t('admin.noUserScenarios') }}</p>
      </div>
      <div v-else class="scenario-grid">
        <article
          v-for="r in userList"
          :key="r.scenario.id"
          class="scenario-card"
        >
          <header class="card-head">
            <h3>
              {{ lang === 'en' ? r.scenario.birthInfo.nameEn : r.scenario.birthInfo.name }}
            </h3>
          </header>
          <p class="card-meta">
            {{ lang === 'en' ? r.scenario.birthInfo.eraEn : r.scenario.birthInfo.era }}
            ·
            {{ lang === 'en' ? r.scenario.birthInfo.occupationEn : r.scenario.birthInfo.occupation }}
          </p>
          <p class="card-stats">
            {{ Object.keys(r.scenario.nodes).length }} {{ $t('admin.nodes') }}
            <span class="dot">·</span>
            {{ formatDate(r.meta.updatedAt) }}
          </p>
          <div class="card-actions">
            <button class="link-btn" @click="onEdit(r.scenario.id)">
              {{ $t('admin.edit') }}
            </button>
            <button class="link-btn" @click="onExport(r.scenario.id)">
              {{ $t('admin.export') }}
            </button>
            <button class="link-btn" @click="onDuplicate(r.scenario)">
              {{ $t('admin.duplicate') }}
            </button>
            <button class="link-btn danger" @click="onDelete(r.scenario.id)">
              {{ $t('admin.delete') }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserScenariosStore } from '~/stores/userScenariosStore'
import { useScenarioRepository } from '~/composables/useScenarioRepository'
import { useScenarioImportExport } from '~/composables/useScenarioImportExport'
import { useSettingsStore } from '~/stores/settingsStore'
import type { PreBuiltScenario } from '~/data/types'

const userStore = useUserScenariosStore()
const repository = useScenarioRepository()
const importExport = useScenarioImportExport()
const settings = useSettingsStore()
const { t } = useI18n()

const importMessage = ref('')
const importError = ref(false)

const lang = computed(() => settings.language)
const builtIns = computed(() => repository.listBuiltIn())
const userList = computed(() => userStore.list)

onMounted(() => {
  userStore.loadFromStorage()
  settings.loadFromStorage()
})

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString()
}

function onCreate() {
  const id = userStore.create()
  navigateTo(`/admin/edit/${id}`)
}

function onEdit(id: string) {
  navigateTo(`/admin/edit/${id}`)
}

function onFork(id: string) {
  const source = repository.getById(id)
  if (!source) return
  const newId = userStore.duplicate(source, id)
  navigateTo(`/admin/edit/${newId}`)
}

function onDuplicate(scenario: PreBuiltScenario) {
  userStore.duplicate(scenario, scenario.id)
}

function onDelete(id: string) {
  if (!confirm(t('admin.confirmDelete'))) return
  userStore.remove(id)
}

function onExport(id: string) {
  importExport.exportToFile(id)
}

async function onImport(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const result = await importExport.importFromFile(file)
  if (result.ok) {
    importError.value = false
    importMessage.value = t('admin.importSuccess')
  }
  else {
    importError.value = true
    importMessage.value = `${t('admin.importFailed')}: ${result.error}`
  }
  input.value = ''
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-deep);
  color: var(--color-text-primary);
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
}

.back-btn:hover {
  background: var(--color-choice-bg);
}

.primary-btn {
  background: var(--color-accent);
  color: var(--color-bg-deep);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
}

.secondary-btn {
  background: var(--color-choice-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.hidden-input {
  display: none;
}

.import-msg {
  padding: 0.6rem 1rem;
  border-radius: 4px;
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.import-msg.error {
  border-color: #c0392b;
  color: #e74c3c;
}

.scenario-section {
  margin-bottom: 2.5rem;
}

.scenario-section h2 {
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
  color: var(--color-accent);
}

.section-hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.scenario-card {
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scenario-card.built-in {
  opacity: 0.95;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.card-head h3 {
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-serif);
}

.badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  background: var(--color-bg-mid);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-meta {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.card-stats {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.dot {
  margin: 0 0.4rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.link-btn:hover {
  background: var(--color-bg-mid);
}

.link-btn.danger {
  color: #e74c3c;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
  background: var(--color-choice-bg);
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}
</style>
