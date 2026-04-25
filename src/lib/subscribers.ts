// Store em memória com deduplicação — persiste enquanto o processo estiver vivo
const subscribers = new Set<string>()

export function addSubscriber(email: string): boolean {
  if (subscribers.has(email)) return false
  subscribers.add(email)
  return true
}

export function getSubscribers(): string[] {
  return Array.from(subscribers)
}

export function hasSubscriber(email: string): boolean {
  return subscribers.has(email)
}
