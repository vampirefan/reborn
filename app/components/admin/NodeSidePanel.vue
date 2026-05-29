<template>
  <aside class="side-panel">
    <header class="side-head">
      <h3>{{ $t('admin.nodeEditor') }}</h3>
      <button class="icon-btn" @click="$emit('close')">×</button>
    </header>

    <div class="side-body">
      <label class="field">
        <span>{{ $t('admin.field.nodeId') }}</span>
        <input v-model="local.id" type="text" :disabled="isStart" @change="onIdChange">
        <small v-if="isStart">{{ $t('admin.startNodeIdLocked') }}</small>
      </label>

      <label class="field">
        <span>{{ $t('admin.field.narrative') }}</span>
        <textarea v-model="local.narrative" rows="4" @input="emitUpdate" />
      </label>

      <label class="field">
        <span>{{ $t('admin.field.narrativeEn') }}</span>
        <textarea v-model="local.narrativeEn" rows="4" @input="emitUpdate" />
      </label>

      <label class="field">
        <span>{{ $t('admin.field.imageTag') }}</span>
        <input v-model="local.imageTag" type="text" @input="emitUpdate">
      </label>

      <div class="form-row">
        <label class="field">
          <span>{{ $t('admin.field.year') }}</span>
          <input
            v-model.number="metaYear"
            type="number"
            @input="onMetaInput"
          >
        </label>
        <label class="field checkbox">
          <input type="checkbox" :checked="!!local.metadata.isDeath" @change="onIsDeathChange">
          <span>{{ $t('admin.field.isDeath') }}</span>
        </label>
      </div>

      <fieldset class="mutations">
        <legend>{{ $t('admin.field.stateMutations') }}</legend>
        <div class="form-row">
          <label class="field">
            <span>health</span>
            <input v-model.number="muts.health" type="number" @input="onMutsInput">
          </label>
          <label class="field">
            <span>body</span>
            <input v-model.number="muts.body" type="number" @input="onMutsInput">
          </label>
        </div>
        <div class="form-row">
          <label class="field">
            <span>mind</span>
            <input v-model.number="muts.mind" type="number" @input="onMutsInput">
          </label>
          <label class="field">
            <span>charisma</span>
            <input v-model.number="muts.charisma" type="number" @input="onMutsInput">
          </label>
        </div>
        <label class="field">
          <span>luck</span>
          <input v-model.number="muts.luck" type="number" @input="onMutsInput">
        </label>
      </fieldset>

      <details class="encyclopedia">
        <summary>{{ $t('admin.field.encyclopedia') }}</summary>
        <label class="field">
          <span>{{ $t('admin.field.encyclopediaText') }}</span>
          <textarea v-model="encZh" rows="3" @input="onEncInput" />
        </label>
        <label class="field">
          <span>{{ $t('admin.field.encyclopediaTextEn') }}</span>
          <textarea v-model="encEn" rows="3" @input="onEncInput" />
        </label>
      </details>
    </div>

    <footer class="side-footer">
      <button class="primary-btn" @click="$emit('set-start', local.id)" :disabled="isStart">
        {{ $t('admin.makeStart') }}
      </button>
      <button class="danger-btn" @click="$emit('delete', local.id)" :disabled="isStart">
        {{ $t('admin.deleteNode') }}
      </button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { ScenarioNode } from '~/data/types'

const props = defineProps<{
  modelValue: ScenarioNode
  isStart: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: ScenarioNode): void
  (e: 'rename', oldId: string, newId: string): void
  (e: 'set-start', id: string): void
  (e: 'delete', id: string): void
  (e: 'close'): void
}>()

function clone(n: ScenarioNode): ScenarioNode {
  return JSON.parse(JSON.stringify(n))
}

const local = reactive<ScenarioNode>(clone(props.modelValue))
const metaYear = ref<number>(local.metadata?.year ?? 0)
const muts = reactive<Record<string, number | undefined>>({
  health: local.stateMutations?.health,
  body: local.stateMutations?.body,
  mind: local.stateMutations?.mind,
  charisma: local.stateMutations?.charisma,
  luck: local.stateMutations?.luck,
})
const encZh = ref(local.encyclopedia?.text ?? '')
const encEn = ref(local.encyclopedia?.textEn ?? '')

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(local, clone(val))
    metaYear.value = val.metadata?.year ?? 0
    muts.health = val.stateMutations?.health
    muts.body = val.stateMutations?.body
    muts.mind = val.stateMutations?.mind
    muts.charisma = val.stateMutations?.charisma
    muts.luck = val.stateMutations?.luck
    encZh.value = val.encyclopedia?.text ?? ''
    encEn.value = val.encyclopedia?.textEn ?? ''
  },
  { deep: true },
)

function onIdChange() {
  const newId = local.id.trim()
  if (!newId || newId === props.modelValue.id) {
    local.id = props.modelValue.id
    return
  }
  emit('rename', props.modelValue.id, newId)
}

function onMetaInput() {
  local.metadata = { ...local.metadata, year: metaYear.value }
  emitUpdate()
}

function onIsDeathChange(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  local.metadata = { ...local.metadata, isDeath: checked || undefined }
  emitUpdate()
}

function onMutsInput() {
  const m: Record<string, number> = {}
  for (const k of Object.keys(muts)) {
    const v = muts[k]
    if (typeof v === 'number' && !Number.isNaN(v)) m[k] = v
  }
  local.stateMutations = m
  emitUpdate()
}

function onEncInput() {
  const z = encZh.value.trim()
  const e = encEn.value.trim()
  if (!z && !e) {
    local.encyclopedia = undefined
  }
  else {
    local.encyclopedia = { text: z, textEn: e }
  }
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
  overflow: hidden;
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
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

.field input,
.field textarea,
.field select {
  background: var(--color-bg-mid);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.field small {
  color: var(--color-text-muted);
  font-size: 0.7rem;
}

.field.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
}

.field.checkbox input {
  width: auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.mutations {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mutations legend {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  padding: 0 0.4rem;
}

.encyclopedia summary {
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.encyclopedia {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.side-footer {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid var(--color-border);
}

.primary-btn,
.danger-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

.primary-btn {
  background: var(--color-accent);
  color: var(--color-bg-deep);
}

.primary-btn:disabled,
.danger-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-btn {
  background: transparent;
  color: #e74c3c;
  border: 1px solid #c0392b;
}
</style>
