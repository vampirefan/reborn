export type LLMProviderType = 'openai' | 'anthropic' | 'deepseek' | 'custom'
export type ImageProviderType = 'dalle' | 'stability' | 'custom' | 'none'
export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant'
export type NarrativeLength = 'short' | 'medium' | 'long'

export interface AppSettings {
  language: 'zh' | 'en'
  llmProvider: LLMProviderType
  llmApiKey: string
  llmModel: string
  llmBaseUrl: string
  imageProvider: ImageProviderType
  imageApiKey: string
  imageModel: string
  imageBaseUrl: string
  textSpeed: TextSpeed
  narrativeLength: NarrativeLength
  autoSave: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'zh',
  llmProvider: 'openai',
  llmApiKey: '',
  llmModel: 'gpt-4o-mini',
  llmBaseUrl: 'https://api.openai.com/v1',
  imageProvider: 'dalle',
  imageApiKey: '',
  imageModel: 'dall-e-3',
  imageBaseUrl: 'https://api.openai.com/v1',
  textSpeed: 'normal',
  narrativeLength: 'medium',
  autoSave: true,
}
