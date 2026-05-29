import type { ChatMessage } from './narrative'

export interface LLMProvider {
  id: string
  name: string
  generateChat(messages: ChatMessage[], options: LLMOptions): Promise<string>
}

export interface LLMOptions {
  apiKey: string
  model: string
  baseUrl: string
  temperature?: number
  maxTokens?: number
}

export interface ImageProvider {
  id: string
  name: string
  generateImage(prompt: string, options: ImageGenOptions): Promise<ImageGenResult>
}

export interface ImageGenOptions {
  apiKey: string
  model: string
  baseUrl: string
  size?: string
  style?: string
  quality?: string
}

export interface ImageGenResult {
  url?: string
  base64?: string
}
