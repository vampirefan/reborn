import { generateImage } from '~~/server/utils/image-providers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { prompt, provider, apiKey, model, baseUrl, size, style } = body as {
    prompt: string
    provider: string
    apiKey: string
    model: string
    baseUrl: string
    size?: string
    style?: string
  }

  if (!apiKey) {
    throw createError({ statusCode: 400, message: 'API key is required' })
  }

  if (!prompt) {
    throw createError({ statusCode: 400, message: 'Prompt is required' })
  }

  try {
    const result = await generateImage(prompt, provider, {
      apiKey,
      model,
      baseUrl,
      size,
      style,
    })

    return result
  }
  catch (error: any) {
    throw createError({
      statusCode: 502,
      message: error.message || 'Failed to generate image',
    })
  }
})
