import { useSettingsStore } from '~/stores/settingsStore'

export default defineNuxtPlugin(() => {
  const settingsStore = useSettingsStore()
  settingsStore.loadFromStorage()
})
