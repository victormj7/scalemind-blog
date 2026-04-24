/**
 * Rate limiter com TTL automático.
 * Substitui o Map simples sem adicionar dependências externas.
 *
 * Quando escalar: trocar RateLimiter por Upstash Redis
 * mantendo a mesma interface pública (check / increment).
 */

interface Entry {
  count:   number
  resetAt: number  // timestamp em ms
}

export class RateLimiter {
  private store = new Map<string, Entry>()
  private cleanupInterval: ReturnType<typeof setInterval>

  constructor(
    private readonly max:      number,
    private readonly windowMs: number,
  ) {
    // Limpa entradas expiradas a cada 10 minutos
    this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000)
  }

  /** Verifica se a chave está dentro do limite */
  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now   = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetAt) {
      return { allowed: true, remaining: this.max - 1, resetAt: now + this.windowMs }
    }

    const remaining = Math.max(0, this.max - entry.count)
    return { allowed: entry.count < this.max, remaining, resetAt: entry.resetAt }
  }

  /** Incrementa o contador e retorna o estado atualizado */
  increment(key: string): { count: number; resetAt: number } {
    const now   = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetAt) {
      const newEntry = { count: 1, resetAt: now + this.windowMs }
      this.store.set(key, newEntry)
      return newEntry
    }

    entry.count++
    return { count: entry.count, resetAt: entry.resetAt }
  }

  /** Retorna o estado atual sem incrementar */
  get(key: string): { count: number; resetAt: number } | null {
    const entry = this.store.get(key)
    if (!entry || Date.now() > entry.resetAt) return null
    return { count: entry.count, resetAt: entry.resetAt }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store) {
      if (now > entry.resetAt) this.store.delete(key)
    }
  }
}

// Instâncias singleton — uma por tipo de limite
// Janela de 24h para o gerador de ideias
export const ideaLimiter = new RateLimiter(3, 24 * 60 * 60 * 1000)
