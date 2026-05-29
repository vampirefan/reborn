<template>
  <div class="settings-page">
    <header class="settings-header">
      <button class="back-btn" @click="navigateTo('/')">
        &larr; {{ $t('game.back') }}
      </button>
      <h1>{{ $t('settings.title') }}</h1>
    </header>

    <div class="settings-content">
      <!-- Language -->
      <section class="settings-section">
        <h2>{{ $t('settings.language') }}</h2>
        <div class="setting-row">
          <select v-model="language" class="setting-select" @change="onLanguageChange">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>

      <!-- LLM Provider -->
      <section class="settings-section">
        <h2>{{ $t('settings.llmProvider') }}</h2>
        <div class="setting-row">
          <label>{{ $t('settings.provider') }}</label>
          <select v-model="llmProvider" class="setting-select" @change="save">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="deepseek">DeepSeek</option>
            <option value="custom">Custom (OpenAI-compatible)</option>
          </select>
        </div>
        <div class="setting-row">
          <label>{{ $t('settings.apiKey') }}</label>
          <input
            v-model="llmApiKey"
            type="password"
            class="setting-input"
            :placeholder="$t('settings.apiKeyPlaceholder')"
            @change="save"
          >
        </div>
        <div class="setting-row">
          <label>{{ $t('settings.model') }}</label>
          <input
            v-model="llmModel"
            type="text"
            class="setting-input"
            placeholder="gpt-4o-mini"
            @change="save"
          >
        </div>
        <div class="setting-row">
          <label>{{ $t('settings.baseUrl') }}</label>
          <input
            v-model="llmBaseUrl"
            type="text"
            class="setting-input"
            placeholder="https://api.openai.com/v1"
            @change="save"
          >
        </div>
      </section>

      <!-- Image Provider -->
      <section class="settings-section">
        <h2>{{ $t('settings.imageProvider') }}</h2>
        <div class="setting-row">
          <label>{{ $t('settings.provider') }}</label>
          <select v-model="imageProvider" class="setting-select" @change="save">
            <option value="dalle">DALL-E</option>
            <option value="stability">Stability AI</option>
            <option value="custom">Custom</option>
            <option value="none">{{ $t('settings.disabled') }}</option>
          </select>
        </div>
        <div v-if="imageProvider !== 'none'" class="setting-row">
          <label>{{ $t('settings.apiKey') }}</label>
          <input
            v-model="imageApiKey"
            type="password"
            class="setting-input"
            :placeholder="$t('settings.apiKeyPlaceholder')"
            @change="save"
          >
        </div>
        <div v-if="imageProvider !== 'none'" class="setting-row">
          <label>{{ $t('settings.baseUrl') }}</label>
          <input
            v-model="imageBaseUrl"
            type="text"
            class="setting-input"
            placeholder="https://api.openai.com/v1"
            @change="save"
          >
        </div>
      </section>

      <!-- Display Settings -->
      <section class="settings-section">
        <h2>{{ $t('settings.display') }}</h2>
        <div class="setting-row">
          <label>{{ $t('settings.textSpeed') }}</label>
          <select v-model="textSpeed" class="setting-select" @change="save">
            <option value="slow">{{ $t('settings.slow') }}</option>
            <option value="normal">{{ $t('settings.normal') }}</option>
            <option value="fast">{{ $t('settings.fast') }}</option>
            <option value="instant">{{ $t('settings.instant') }}</option>
          </select>
        </div>
        <div class="setting-row">
          <label>{{ $t('settings.narrativeLength') }}</label>
          <select v-model="narrativeLength" class="setting-select" @change="save">
            <option value="short">{{ $t('settings.short') }}</option>
            <option value="medium">{{ $t('settings.medium') }}</option>
            <option value="long">{{ $t('settings.long') }}</option>
          </select>
        </div>
        <div class="setting-row">
          <label>{{ $t('settings.autoSave') }}</label>
          <input
            v-model="autoSave"
            type="checkbox"
            class="setting-checkbox"
            @change="save"
          >
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()
const { setLocale } = useI18n()

const language = ref(settingsStore.language)
const llmProvider = ref(settingsStore.llmProvider)
const llmApiKey = ref(settingsStore.llmApiKey)
const llmModel = ref(settingsStore.llmModel)
const llmBaseUrl = ref(settingsStore.llmBaseUrl)
const imageProvider = ref(settingsStore.imageProvider)
const imageApiKey = ref(settingsStore.imageApiKey)
const imageBaseUrl = ref(settingsStore.imageBaseUrl)
const textSpeed = ref(settingsStore.textSpeed)
const narrativeLength = ref(settingsStore.narrativeLength)
const autoSave = ref(settingsStore.autoSave)

function onLanguageChange() {
  setLocale(language.value)
  save()
}

function save() {
  settingsStore.updateSettings({
    language: language.value as 'zh' | 'en',
    llmProvider: llmProvider.value as any,
    llmApiKey: llmApiKey.value,
    llmModel: llmModel.value,
    llmBaseUrl: llmBaseUrl.value,
    imageProvider: imageProvider.value as any,
    imageApiKey: imageApiKey.value,
    imageBaseUrl: imageBaseUrl.value,
    textSpeed: textSpeed.value as any,
    narrativeLength: narrativeLength.value as any,
    autoSave: autoSave.value,
  })
}

onMounted(() => {
  settingsStore.loadFromStorage()
  language.value = settingsStore.language
  llmProvider.value = settingsStore.llmProvider
  llmApiKey.value = settingsStore.llmApiKey
  llmModel.value = settingsStore.llmModel
  llmBaseUrl.value = settingsStore.llmBaseUrl
  imageProvider.value = settingsStore.imageProvider
  imageApiKey.value = settingsStore.imageApiKey
  imageBaseUrl.value = settingsStore.imageBaseUrl
  textSpeed.value = settingsStore.textSpeed
  narrativeLength.value = settingsStore.narrativeLength
  autoSave.value = settingsStore.autoSave
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-deep);
  color: var(--color-text-primary);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.settings-header h1 {
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

.settings-section {
  margin-bottom: 2.5rem;
}

.settings-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.setting-row label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.setting-input,
.setting-select {
  flex: 1;
  max-width: 300px;
  padding: 0.6rem 0.8rem;
  background: var(--color-choice-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.setting-input:focus,
.setting-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.setting-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent);
}
</style>
