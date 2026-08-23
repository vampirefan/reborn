/**
 * Lightweight image preloading helpers used to make scene transitions feel instant.
 * Safe to call on the server (becomes a no-op) and idempotent for already cached URLs.
 */
const preloaded = new Set<string>()

export function preloadImage(url: string): void {
  if (!url || !import.meta.client) return
  if (preloaded.has(url)) return
  preloaded.add(url)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

export function preloadImages(urls: Array<string | undefined | null>): void {
  for (const u of urls) {
    if (u) preloadImage(u)
  }
}
