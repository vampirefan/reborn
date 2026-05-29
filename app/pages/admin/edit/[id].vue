<template>
  <div class="editor-page">
    <ClientOnly>
      <template v-if="loaded && scenario">
        <EditorToolbar
          :title="lang === 'en' ? scenario.birthInfo.nameEn : scenario.birthInfo.name"
          :dirty="dirty"
          :issues="issues"
          @back="onBack"
          @save="onSave"
          @add-node="onAddNode"
          @auto-layout="onAutoLayout"
          @validate="onValidate"
          @export="onExport"
          @clear-issues="issues = null"
        />

        <div class="layout">
          <!-- Birth info side -->
          <section class="left-pane">
            <h3 class="pane-title">{{ $t('admin.birthInfo') }}</h3>
            <BirthInfoForm v-model="birthInfo" />
          </section>

          <!-- Graph -->
          <section class="canvas-pane">
            <GraphCanvas
              v-model:model-nodes="graphNodes"
              v-model:model-edges="graphEdges"
              :selected-node-id="selectedNodeId"
              :selected-edge-id="selectedEdgeId"
              @select-node="onSelectNode"
              @select-edge="onSelectEdge"
            />
          </section>

          <!-- Right side panel -->
          <section v-if="selectedNode" class="right-pane">
            <NodeSidePanel
              :model-value="selectedNode.data"
              :is-start="selectedNode.id === startNodeId"
              @update:model-value="onNodeUpdate"
              @rename="onNodeRename"
              @set-start="onSetStart"
              @delete="onDeleteNode"
              @close="selectedNodeId = null"
            />
          </section>
          <section v-else-if="selectedEdge" class="right-pane">
            <EdgeSidePanel
              :model-value="selectedEdge"
              @update:model-value="onEdgeUpdate"
              @delete="onDeleteEdge"
              @close="selectedEdgeId = null"
            />
          </section>
        </div>
      </template>
      <template v-else>
        <div class="loading">{{ $t('admin.loading') }}</div>
      </template>

      <template #fallback>
        <div class="loading">{{ $t('admin.loading') }}</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserScenariosStore } from '~/stores/userScenariosStore'
import { useScenarioImportExport } from '~/composables/useScenarioImportExport'
import { useScenarioValidator, type ValidationResult } from '~/composables/useScenarioValidator'
import { useSettingsStore } from '~/stores/settingsStore'
import {
  scenarioToGraph,
  graphToScenario,
  autoLayout,
  parseEdgeId,
  type GraphNode,
  type GraphEdge,
} from '~/utils/scenarioGraph'
import type { PreBuiltScenario, ScenarioBirthInfo, ScenarioNode } from '~/data/types'

import EditorToolbar from '~/components/admin/EditorToolbar.vue'
import BirthInfoForm from '~/components/admin/BirthInfoForm.vue'
import GraphCanvas from '~/components/admin/GraphCanvas.vue'
import NodeSidePanel from '~/components/admin/NodeSidePanel.vue'
import EdgeSidePanel from '~/components/admin/EdgeSidePanel.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserScenariosStore()
const importExport = useScenarioImportExport()
const validator = useScenarioValidator()
const settings = useSettingsStore()

const id = computed(() => String(route.params.id))
const loaded = ref(false)
const dirty = ref(false)
const issues = ref<ValidationResult | null>(null)

const scenario = ref<PreBuiltScenario | null>(null)
const birthInfo = ref<ScenarioBirthInfo>(emptyBirthInfo())
const startNodeId = ref<string>('')
const graphNodes = ref<GraphNode[]>([])
const graphEdges = ref<GraphEdge[]>([])
const selectedNodeId = ref<string | null>(null)
const selectedEdgeId = ref<string | null>(null)

function emptyBirthInfo(): ScenarioBirthInfo {
  return {
    name: '',
    nameEn: '',
    birthYear: 1000,
    era: '',
    eraEn: '',
    location: { region: '', regionEn: '', country: '', countryEn: '' },
    occupation: '',
    occupationEn: '',
    socialStatus: 'peasant',
    traits: [],
    traitsEn: [],
    health: 100,
  }
}

const lang = computed(() => settings.language)
const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null
  return graphNodes.value.find(n => n.id === selectedNodeId.value) ?? null
})
const selectedEdge = computed(() => {
  if (!selectedEdgeId.value) return null
  return graphEdges.value.find(e => e.id === selectedEdgeId.value) ?? null
})

onMounted(() => {
  settings.loadFromStorage()
  userStore.loadFromStorage()
  loadScenario()
  loaded.value = true
})

function loadScenario() {
  const record = userStore.byId(id.value)
  if (!record) {
    router.replace('/admin')
    return
  }
  scenario.value = JSON.parse(JSON.stringify(record.scenario))
  birthInfo.value = JSON.parse(JSON.stringify(record.scenario.birthInfo))
  startNodeId.value = record.scenario.startNodeId
  const graph = scenarioToGraph(record.scenario, record.meta.nodePositions)
  graphNodes.value = graph.nodes
  graphEdges.value = graph.edges
  dirty.value = false
}

watch(graphNodes, () => { dirty.value = true }, { deep: true })
watch(graphEdges, () => { dirty.value = true }, { deep: true })
watch(birthInfo, () => { dirty.value = true }, { deep: true })

function onSelectNode(id: string | null) {
  selectedNodeId.value = id
  if (id) selectedEdgeId.value = null
}

function onSelectEdge(id: string | null) {
  selectedEdgeId.value = id
  if (id) selectedNodeId.value = null
}

function onNodeUpdate(updated: ScenarioNode) {
  const idx = graphNodes.value.findIndex(n => n.id === selectedNodeId.value)
  if (idx < 0) return
  const old = graphNodes.value[idx]!
  graphNodes.value = [
    ...graphNodes.value.slice(0, idx),
    {
      ...old,
      data: { ...updated, isStart: old.data.isStart },
    },
    ...graphNodes.value.slice(idx + 1),
  ]
}

function onNodeRename(oldId: string, newId: string) {
  if (graphNodes.value.some(n => n.id === newId)) {
    alert('Node id already exists')
    return
  }
  // Update node id in nodes
  graphNodes.value = graphNodes.value.map((n) => {
    if (n.id === oldId) return { ...n, id: newId, data: { ...n.data, id: newId } }
    return n
  })
  // Update edges referencing this node, plus edges originating here
  graphEdges.value = graphEdges.value.map((e) => {
    let next = e
    if (e.source === oldId) {
      next = { ...next, source: newId, id: `${newId}::${next.data.choiceId}` }
    }
    if (next.target === oldId) {
      next = { ...next, target: newId }
    }
    return next
  })
  if (startNodeId.value === oldId) startNodeId.value = newId
  selectedNodeId.value = newId
}

function onSetStart(id: string) {
  startNodeId.value = id
  graphNodes.value = graphNodes.value.map(n => ({
    ...n,
    data: { ...n.data, isStart: n.id === id },
  }))
  dirty.value = true
}

function onDeleteNode(id: string) {
  if (id === startNodeId.value) return
  if (!confirm('Delete this node and all its edges?')) return
  graphNodes.value = graphNodes.value.filter(n => n.id !== id)
  graphEdges.value = graphEdges.value.filter(e => e.source !== id && e.target !== id)
  selectedNodeId.value = null
}

function onEdgeUpdate(updated: GraphEdge) {
  const idx = graphEdges.value.findIndex(e => e.id === selectedEdgeId.value)
  if (idx < 0) return
  // If choice id changed, recompute edge id
  const newId = `${updated.source}::${updated.data.choiceId}`
  const next: GraphEdge = { ...updated, id: newId, label: updated.data.text }
  graphEdges.value = [
    ...graphEdges.value.slice(0, idx),
    next,
    ...graphEdges.value.slice(idx + 1),
  ]
  selectedEdgeId.value = newId
}

function onDeleteEdge(id: string) {
  graphEdges.value = graphEdges.value.filter(e => e.id !== id)
  selectedEdgeId.value = null
}

function onAddNode() {
  const baseId = 'node'
  let counter = 1
  while (graphNodes.value.some(n => n.id === `${baseId}_${counter}`)) counter++
  const newId = `${baseId}_${counter}`
  graphNodes.value = [
    ...graphNodes.value,
    {
      id: newId,
      position: { x: 100, y: 100 },
      type: 'scenarioNode',
      data: {
        id: newId,
        narrative: '',
        narrativeEn: '',
        choices: [],
        stateMutations: {},
        imageTag: 'default',
        metadata: { year: birthInfo.value.birthYear },
        isStart: false,
      },
    },
  ]
  selectedNodeId.value = newId
}

function onAutoLayout() {
  const built = buildScenarioFromGraph()
  const positions = autoLayout(built.scenario)
  graphNodes.value = graphNodes.value.map(n => ({
    ...n,
    position: positions[n.id] ?? n.position,
  }))
}

function buildScenarioFromGraph(): { scenario: PreBuiltScenario, positions: Record<string, { x: number, y: number }> } {
  if (!scenario.value) throw new Error('Scenario not loaded')
  const base: PreBuiltScenario = {
    ...scenario.value,
    birthInfo: birthInfo.value,
    startNodeId: startNodeId.value,
  }
  return graphToScenario(base, graphNodes.value, graphEdges.value)
}

function onValidate(): boolean {
  const built = buildScenarioFromGraph()
  const result = validator.validate(built.scenario)
  issues.value = result
  if (!result.ok) {
    const lines = result.errors.map(e => `• ${lang.value === 'en' ? e.messageEn : e.message}`)
    alert(`${result.errors.length} error(s):\n${lines.join('\n')}`)
  }
  return result.ok
}

function onSave() {
  const built = buildScenarioFromGraph()
  const result = validator.validate(built.scenario)
  issues.value = result
  if (!result.ok) {
    const lines = result.errors.map(e => `• ${lang.value === 'en' ? e.messageEn : e.message}`)
    alert(`Cannot save:\n${lines.join('\n')}`)
    return
  }
  userStore.update(id.value, built.scenario, built.positions)
  dirty.value = false
}

function onExport() {
  importExport.exportToFile(id.value)
}

function onBack() {
  if (dirty.value && !confirm('Discard unsaved changes?')) return
  router.push('/admin')
}

// Keep edge labels synced when graph edges arrive externally without label
watch(graphEdges, (edges) => {
  let changed = false
  const synced = edges.map((e) => {
    if (e.label !== e.data.text) {
      changed = true
      return { ...e, label: e.data.text }
    }
    return e
  })
  if (changed) graphEdges.value = synced
}, { deep: false })

// Suppress unused warnings
void parseEdgeId
</script>

<style scoped>
.editor-page {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-deep);
  color: var(--color-text-primary);
  overflow: hidden;
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr auto;
  min-height: 0;
}

.left-pane {
  border-right: 1px solid var(--color-border);
  padding: 1rem;
  overflow-y: auto;
}

.pane-title {
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.canvas-pane {
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.right-pane {
  min-height: 0;
}

.loading {
  padding: 3rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 60vh auto;
  }

  .left-pane,
  .right-pane {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
