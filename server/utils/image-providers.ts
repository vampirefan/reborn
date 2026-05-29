import type { ImageGenOptions, ImageGenResult } from '~~/shared/types/providers'

async function generateWithDallE(
  prompt: string,
  options: ImageGenOptions,
): Promise<ImageGenResult> {
  const url = `${options.baseUrl}/images/generations`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || 'dall-e-3',
      prompt,
      n: 1,
      size: options.size || '1792x1024',
      quality: options.quality || 'standard',
      style: options.style || 'vivid',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Image API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return { url: data.data[0]?.url }
}

async function generateWithStability(
  prompt: string,
  options: ImageGenOptions,
): Promise<ImageGenResult> {
  const url = `${options.baseUrl}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.apiKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt, weight: 1 }],
      cfg_scale: 7,
      height: 1024,
      width: 1792,
      samples: 1,
      steps: 30,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Stability API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return { base64: data.artifacts[0]?.base64 }
}

export async function generateImage(
  prompt: string,
  provider: string,
  options: ImageGenOptions,
): Promise<ImageGenResult> {
  switch (provider) {
    case 'stability':
      return generateWithStability(prompt, options)
    case 'dalle':
    case 'custom':
    default:
      return generateWithDallE(prompt, options)
  }
}
