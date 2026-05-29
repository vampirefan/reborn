import type { ChatMessage, LLMOptions } from '~~/shared/types/narrative'

interface ProviderConfig {
  apiKey: string
  model: string
  baseUrl: string
  temperature?: number
  maxTokens?: number
}

async function callOpenAICompatible(
  messages: ChatMessage[],
  config: ProviderConfig,
): Promise<string> {
  const url = `${config.baseUrl}/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature ?? 0.8,
      max_tokens: config.maxTokens ?? 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LLM API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

async function callAnthropic(
  messages: ChatMessage[],
  config: ProviderConfig,
): Promise<string> {
  const systemMessage = messages.find(m => m.role === 'system')
  const nonSystemMessages = messages.filter(m => m.role !== 'system')

  const url = `${config.baseUrl}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens ?? 2000,
      system: systemMessage?.content || '',
      messages: nonSystemMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data.content[0]?.text || ''
}

export async function generateWithLLM(
  messages: ChatMessage[],
  provider: string,
  options: LLMOptions,
): Promise<string> {
  const config: ProviderConfig = {
    apiKey: options.apiKey,
    model: options.model,
    baseUrl: options.baseUrl,
    temperature: options.temperature,
    maxTokens: options.maxTokens,
  }

  switch (provider) {
    case 'anthropic':
      return callAnthropic(messages, config)
    case 'openai':
    case 'deepseek':
    case 'custom':
    default:
      return callOpenAICompatible(messages, config)
  }
}
