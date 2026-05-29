<template>
  <div class="graph-canvas-wrapper">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-edge-options="{ type: 'smoothstep', animated: false }"
      :fit-view-on-init="true"
      class="canvas"
      @connect="onConnect"
      @node-click="onNodeClick"
      @edge-click="onEdgeClick"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
      @pane-click="onPaneClick"
    >
      <Background pattern-color="#444" :gap="20" />
      <Controls />
      <MiniMap pannable zoomable />

      <template #node-scenarioNode="nodeProps">
        <div
          class="node-card"
          :class="{
            'is-start': nodeProps.data.isStart,
            'is-death': nodeProps.data.metadata?.isDeath,
            'is-selected': selectedNodeId === nodeProps.id,
          }"
        >
          <Handle type="target" :position="Position.Left" />
          <div class="node-head">
            <span class="node-id">{{ nodeProps.id }}</span>
            <span v-if="nodeProps.data.isStart" class="node-tag start">{{ $t('admin.startNode') }}</span>
            <span v-if="nodeProps.data.metadata?.isDeath" class="node-tag death">{{ $t('admin.deathNode') }}</span>
          </div>
          <p class="node-text">{{ truncate(lang === 'en' ? nodeProps.data.narrativeEn : nodeProps.data.narrative) }}</p>
          <Handle type="source" :position="Position.Right" />
        </div>
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { VueFlow, Position, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { Handle } from '@vue-flow/core'
import type { GraphNode, GraphEdge } from '~/utils/scenarioGraph'
import { makeEdgeId } from '~/utils/scenarioGraph'
import { useSettingsStore } from '~/stores/settingsStore'

const props = defineProps<{
  modelNodes: GraphNode[]
  modelEdges: GraphEdge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelNodes', v: GraphNode[]): void
  (e: 'update:modelEdges', v: GraphEdge[]): void
  (e: 'select-node', id: string | null): void
  (e: 'select-edge', id: string | null): void
}>()

const settings = useSettingsStore()
const lang = computed(() => settings.language)

// Internal mirror so Vue Flow can mutate freely; we sync up on changes.
const nodes = ref<GraphNode[]>(JSON.parse(JSON.stringify(props.modelNodes)))
const edges = ref<GraphEdge[]>(JSON.parse(JSON.stringify(props.modelEdges)))

watch(
  () => props.modelNodes,
  (val) => { nodes.value = JSON.parse(JSON.stringify(val)) },
  { deep: false },
)
watch(
  () => props.modelEdges,
  (val) => { edges.value = JSON.parse(JSON.stringify(val)) },
  { deep: false },
)

const { findNode } = useVueFlow()

function truncate(s: string | undefined, max = 60): string {
  if (!s) return ''
  return s.length > max ? `${s.slice(0, max)}…` : s
}

function syncOut() {
  emit('update:modelNodes', nodes.value as GraphNode[])
  emit('update:modelEdges', edges.value as GraphEdge[])
}

function onNodeClick({ node }: { node: { id: string } }) {
  emit('select-node', node.id)
  emit('select-edge', null)
}

function onEdgeClick({ edge }: { edge: { id: string } }) {
  emit('select-edge', edge.id)
  emit('select-node', null)
}

function onPaneClick() {
  emit('select-node', null)
  emit('select-edge', null)
}

function onConnect(params: { source: string, target: string }) {
  const choiceId = `c_${Date.now().toString(36)}`
  const newEdge: GraphEdge = {
    id: makeEdgeId(params.source, choiceId),
    source: params.source,
    target: params.target,
    label: '...',
    data: { choiceId, text: '...', textEn: '...' },
  }
  edges.value = [...edges.value, newEdge]
  syncOut()
}

function onNodesChange() {
  // Vue Flow has already mutated `nodes` via v-model
  syncOut()
}

function onEdgesChange() {
  syncOut()
}

defineExpose({ findNode })
</script>

<style scoped>
.graph-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.canvas {
  width: 100%;
  height: 100%;
  background: var(--color-bg-mid);
}

.node-card {
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  width: 220px;
  font-size: 0.85rem;
  color: var(--color-text-primary);
}

.node-card.is-start {
  border-color: var(--color-accent);
}

.node-card.is-death {
  border-color: #c0392b;
}

.node-card.is-selected {
  box-shadow: 0 0 0 2px var(--color-accent);
}

.node-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.node-id {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--color-accent);
}

.node-tag {
  font-size: 0.65rem;
  padding: 0.05rem 0.4rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.node-tag.start {
  background: var(--color-accent);
  color: var(--color-bg-deep);
}

.node-tag.death {
  background: #c0392b;
  color: #fff;
}

.node-text {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
</style>
