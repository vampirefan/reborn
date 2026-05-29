<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <button class="back-btn" @click="$emit('back')">
        &larr; {{ $t('admin.backToList') }}
      </button>
      <span class="title-block">
        <span class="title">{{ title }}</span>
        <span v-if="dirty" class="dirty-dot" :title="$t('admin.unsaved')">●</span>
      </span>
    </div>

    <div class="toolbar-right">
      <button class="ghost-btn" @click="$emit('add-node')">
        + {{ $t('admin.addNode') }}
      </button>
      <button class="ghost-btn" @click="$emit('auto-layout')">
        {{ $t('admin.autoLayout') }}
      </button>
      <button class="ghost-btn" @click="$emit('validate')">
        {{ $t('admin.validate') }}
      </button>
      <button class="ghost-btn" @click="$emit('export')">
        {{ $t('admin.export') }}
      </button>
      <button class="primary-btn" :disabled="!dirty" @click="$emit('save')">
        {{ $t('admin.save') }}
      </button>
    </div>
  </div>

  <div v-if="issues" class="issue-bar" :class="{ 'has-error': issues.errors.length > 0 }">
    <span v-if="issues.errors.length === 0 && issues.warnings.length === 0">
      ✓ {{ $t('admin.validationOk') }}
    </span>
    <span v-else>
      <strong>{{ issues.errors.length }}</strong> {{ $t('admin.errors') }}
      ·
      <strong>{{ issues.warnings.length }}</strong> {{ $t('admin.warnings') }}
    </span>
    <button class="link-btn" @click="$emit('clear-issues')">×</button>
  </div>
</template>

<script setup lang="ts">
import type { ValidationResult } from '~/composables/useScenarioValidator'

defineProps<{
  title: string
  dirty: boolean
  issues: ValidationResult | null
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'save'): void
  (e: 'add-node'): void
  (e: 'auto-layout'): void
  (e: 'validate'): void
  (e: 'export'): void
  (e: 'clear-issues'): void
}>()
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background: var(--color-bg-deep);
  border-bottom: 1px solid var(--color-border);
  gap: 1rem;
  flex-wrap: wrap;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
}

.back-btn:hover {
  background: var(--color-choice-bg);
}

.title-block {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.title {
  font-size: 0.95rem;
  font-weight: 500;
  font-family: var(--font-serif);
}

.dirty-dot {
  color: var(--color-accent);
  font-size: 0.7rem;
}

.ghost-btn {
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
}

.ghost-btn:hover {
  border-color: var(--color-accent);
}

.primary-btn {
  background: var(--color-accent);
  color: var(--color-bg-deep);
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 3px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.issue-bar {
  padding: 0.5rem 1rem;
  background: var(--color-choice-bg);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.issue-bar.has-error {
  background: rgba(192, 57, 43, 0.15);
  color: #e74c3c;
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1rem;
  cursor: pointer;
}
</style>
