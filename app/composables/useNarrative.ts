import type { NarrativeResponse } from '~~/shared/types/narrative'
import { useSettingsStore } from '~/stores/settingsStore'

export function useNarrative() {
  const settings = useSettingsStore()

  async function callNarrative(systemPrompt: string, userMessage: string): Promise<NarrativeResponse> {
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userMessage },
    ]

    const { data, error } = await useFetch('/api/narrative/generate', {
      method: 'POST',
      body: {
        messages,
        provider: settings.llmProvider,
        apiKey: settings.llmApiKey,
        model: settings.llmModel,
        baseUrl: settings.llmBaseUrl,
      },
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to generate narrative')
    }

    const content = (data.value as any)?.content || ''

    // Parse JSON from the LLM response
    return parseNarrativeResponse(content)
  }

  function parseNarrativeResponse(content: string): NarrativeResponse {
    // Try to extract JSON from the response
    let jsonStr = content.trim()

    // Handle cases where LLM wraps JSON in markdown code blocks
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    // Try to find JSON object in the response
    const objMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objMatch) {
      jsonStr = objMatch[0]
    }

    try {
      const parsed = JSON.parse(jsonStr)
      return {
        narrative: parsed.narrative || '',
        choices: parsed.choices || [],
        stateMutations: parsed.stateMutations || {},
        imagePrompt: parsed.imagePrompt || '',
        metadata: parsed.metadata || {},
        ...(parsed.birthInfo ? { birthInfo: parsed.birthInfo } : {}),
      } as NarrativeResponse & { birthInfo?: any }
    }
    catch {
      // Fallback: treat entire content as narrative
      return {
        narrative: content.substring(0, 500),
        choices: [
          { id: 'c1', text: 'Continue...' },
        ],
        stateMutations: { ageAdvance: 1 },
        imagePrompt: '',
        metadata: { year: 0 },
      }
    }
  }

  return { callNarrative }
}
