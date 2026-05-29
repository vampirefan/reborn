import { useSettingsStore } from '~/stores/settingsStore'

export function useImageGen() {
  const settings = useSettingsStore()

  async function generateSceneImage(prompt: string): Promise<string | null> {
    if (settings.imageProvider === 'none' || !settings.imageApiKey) {
      return null
    }

    try {
      const { data, error } = await useFetch('/api/image/generate', {
        method: 'POST',
        body: {
          prompt: `Historical scene, cinematic painting style, dramatic lighting: ${prompt}`,
          provider: settings.imageProvider,
          apiKey: settings.imageApiKey,
          model: settings.imageModel,
          baseUrl: settings.imageBaseUrl,
          size: '1792x1024',
          style: 'vivid',
        },
      })

      if (error.value) {
        console.warn('Image generation failed:', error.value)
        return null
      }

      const result = data.value as any
      if (result?.url) return result.url
      if (result?.base64) return `data:image/png;base64,${result.base64}`

      return null
    }
    catch (err) {
      console.warn('Image generation error:', err)
      return null
    }
  }

  return { generateSceneImage }
}
