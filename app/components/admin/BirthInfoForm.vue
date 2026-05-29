<template>
  <div class="birth-form">
    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.name') }}</span>
        <input v-model="local.name" type="text" @input="emitUpdate">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.nameEn') }}</span>
        <input v-model="local.nameEn" type="text" @input="emitUpdate">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.birthYear') }}</span>
        <input v-model.number="local.birthYear" type="number" @input="emitUpdate">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.health') }}</span>
        <input v-model.number="local.health" type="number" min="0" max="100" @input="emitUpdate">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.era') }}</span>
        <input v-model="local.era" type="text" @input="emitUpdate">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.eraEn') }}</span>
        <input v-model="local.eraEn" type="text" @input="emitUpdate">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.region') }}</span>
        <input v-model="local.location.region" type="text" @input="emitUpdate">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.regionEn') }}</span>
        <input v-model="local.location.regionEn" type="text" @input="emitUpdate">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.country') }}</span>
        <input v-model="local.location.country" type="text" @input="emitUpdate">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.countryEn') }}</span>
        <input v-model="local.location.countryEn" type="text" @input="emitUpdate">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.city') }}</span>
        <input v-model="cityZh" type="text" @input="onCityInput">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.cityEn') }}</span>
        <input v-model="cityEn" type="text" @input="onCityInput">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.occupation') }}</span>
        <input v-model="local.occupation" type="text" @input="emitUpdate">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.occupationEn') }}</span>
        <input v-model="local.occupationEn" type="text" @input="emitUpdate">
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.socialStatus') }}</span>
        <select v-model="local.socialStatus" @change="emitUpdate">
          <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
    </div>

    <div class="form-row">
      <label class="field">
        <span>{{ $t('admin.field.traits') }}</span>
        <input v-model="traitsZh" type="text" :placeholder="commaPlaceholder" @input="onTraitsInput">
      </label>
      <label class="field">
        <span>{{ $t('admin.field.traitsEn') }}</span>
        <input v-model="traitsEn" type="text" :placeholder="commaPlaceholder" @input="onTraitsInput">
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { ScenarioBirthInfo } from '~/data/types'

const props = defineProps<{ modelValue: ScenarioBirthInfo }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: ScenarioBirthInfo): void }>()

const statusOptions = ['peasant', 'merchant', 'noble', 'royal', 'clergy', 'military', 'scholar', 'artisan', 'outcast'] as const

const commaPlaceholder = '逗号 / comma 分隔'

function clone(b: ScenarioBirthInfo): ScenarioBirthInfo {
  return JSON.parse(JSON.stringify(b))
}

const local = reactive<ScenarioBirthInfo>(clone(props.modelValue))
const cityZh = ref(local.location.city ?? '')
const cityEn = ref(local.location.cityEn ?? '')
const traitsZh = ref(local.traits.join(', '))
const traitsEn = ref(local.traitsEn.join(', '))

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(local, clone(val))
    cityZh.value = val.location.city ?? ''
    cityEn.value = val.location.cityEn ?? ''
    traitsZh.value = val.traits.join(', ')
    traitsEn.value = val.traitsEn.join(', ')
  },
  { deep: true },
)

function onCityInput() {
  local.location.city = cityZh.value.trim() || undefined
  local.location.cityEn = cityEn.value.trim() || undefined
  emitUpdate()
}

function onTraitsInput() {
  local.traits = traitsZh.value.split(',').map(s => s.trim()).filter(Boolean)
  local.traitsEn = traitsEn.value.split(',').map(s => s.trim()).filter(Boolean)
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', clone(local))
}
</script>

<style scoped>
.birth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
.field select {
  background: var(--color-bg-mid);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: var(--color-accent);
}
</style>
