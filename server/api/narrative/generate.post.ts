import { generateWithLLM } from '~~/server/utils/llm-providers'
import type { ChatMessage } from '~~/shared/types/narrative'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { messages, provider, apiKey, model, baseUrl } = body as {
    messages: ChatMessage[]
    provider: string
    apiKey: string
    model: string
    baseUrl: string
  }

  if (!apiKey) {
    throw createError({ statusCode: 400, message: 'API key is required' })
  }

  if (!messages || messages.length === 0) {
    throw createError({ statusCode: 400, message: 'Messages are required' })
  }

  try {
    const result = await generateWithLLM(messages, provider, {
      apiKey,
      model,
      baseUrl,
      temperature: 0.85,
      maxTokens: 2000,
    })

    return { content: result }
  }
  catch (error: any) {
    throw createError({
      statusCode: 502,
      message: error.message || 'Failed to generate narrative',
    })
  }
})
