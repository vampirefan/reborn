<template>
  <aside class="side-panel">
    <header class="side-head">
      <h3>{{ $t('admin.edgeEditor') }}</h3>
      <button class="icon-btn" @click="$emit('close')">×</button>
    </header>

    <div class="side-body">
      <div class="route-info">
        <div class="route-pill">{{ source }}</div>
        <span class="arrow">→</span>
        <div class="route-pill">{{ target }}</div>
      </div>

      <label class="field">
        <span>{{ $t('admin.field.choiceId') }}</span>
        <input v-model="local.data.choiceId" type="text" @input="emitUpdate">
      </label>

      <label class="field">
        <span>{{ $t('admin.field.choiceText') }}</span>
        <input v-model="local.data.text" type="text" @input="onTextInput">
      </label>

      <label class="field">
        <span>{{ $t('admin.field.choiceTextEn') }}</span>
        <input v-model="local.data.textEn" type="text" @input="emitUpdate">
      </label>
    </div>

    <footer class="side-footer">
      <button class="danger-btn" @click="$emit('delete', local.id)">
        {{ $t('admin.deleteEdge') }}
      </button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { GraphEdge } from '~/utils/scenarioGraph'

const props = defineProps<{ modelValue: GraphEdge }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: GraphEdge): void
  (e: 'delete', id: string): void
  (e: 'close'): void
}>()

function clone(edge: GraphEdge): GraphEdge {
  return JSON.parse(JSON.stringify(edge))
}

const local = reactive<GraphEdge>(clone(props.modelValue))

watch(
  () => props.modelValue,
  (val) => Object.assign(local, clone(val)),
  { deep: true },
)

const source = props.modelValue.source
const target = props.modelValue.target

function onTextInput() {
  // Keep label in sync with text for graph display
  local.label = local.data.text
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', clone(local))
}
</script>

<style scoped>
.side-panel {
  width: 360px;
  height: 100%;
  background: var(--color-bg-deep);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.side-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.side-head h3 {
  font-size: 0.95rem;
  color: var(--color-accent);
}

.icon-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
}

.side-body {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: var(--color-choice-bg);
  border-radius: 4px;
}

.route-pill {
  background: var(--color-bg-mid);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--color-accent);
}

.arrow {
  color: var(--color-text-muted);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.field > span {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.field input {
  background: var(--color-bg-mid);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

.field input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.side-footer {
  padding: 0.8rem 1rem;
  border-top: 1px solid var(--color-border);
}

.danger-btn {
  width: 100%;
  background: transparent;
  color: #e74c3c;
  border: 1px solid #c0392b;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
