import { useUserScenariosStore } from '~/stores/userScenariosStore'

export function useScenarioImportExport() {
  const userStore = useUserScenariosStore()

  function downloadFile(filename: string, content: string) {
    if (!import.meta.client) return
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function exportToFile(id: string) {
    const json = userStore.exportJson(id)
    if (!json) return
    const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_')
    downloadFile(`reborn-scenario-${safeId}.json`, json)
  }

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  async function importFromFile(file: File): Promise<{ ok: true, id: string } | { ok: false, error: string }> {
    try {
      const text = await readFile(file)
      return userStore.importJson(text)
    }
    catch (e) {
      return { ok: false, error: (e as Error).message }
    }
  }

  return { exportToFile, importFromFile }
}
