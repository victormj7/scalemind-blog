// Validação e sanitização de inputs para as APIs

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Remove tags HTML e caracteres perigosos
export function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return ''
  return input
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, '')           // remove HTML tags
    .replace(/[<>"'`]/g, '')           // remove caracteres XSS
    .trim()
}

// Valida e sanitiza payload de post
export function validatePostPayload(body: unknown): {
  title: string
  description: string
  content: string
  category: string
  image: string
  featured: boolean
} {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('body', 'Body deve ser um objeto JSON válido.')
  }

  const b = body as Record<string, unknown>

  const title = sanitizeString(b.title, 200)
  if (!title) throw new ValidationError('title', 'Campo "title" é obrigatório e não pode estar vazio.')
  if (title.length < 5) throw new ValidationError('title', 'Título deve ter pelo menos 5 caracteres.')

  const content = typeof b.content === 'string' ? b.content.slice(0, 50000).trim() : ''
  if (!content) throw new ValidationError('content', 'Campo "content" é obrigatório.')
  if (content.length < 50) throw new ValidationError('content', 'Conteúdo deve ter pelo menos 50 caracteres.')

  const VALID_CATEGORIES = ['MicroSaaS', 'Automação', 'Finanças', 'Renda Online']
  const category = sanitizeString(b.category, 50)
  const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'Renda Online'

  const image = typeof b.image === 'string' && b.image.startsWith('https://')
    ? b.image.slice(0, 500)
    : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80'

  const description = sanitizeString(b.description ?? title, 300)
  const featured    = b.featured === true

  return { title, description, content, category: safeCategory, image, featured }
}

// Valida niche do gerador de ideias
export function validateNiche(input: unknown): string | undefined {
  if (!input) return undefined
  const VALID_NICHES = ['marketing', 'saude', 'educacao', 'financas', 'geral']
  const niche = sanitizeString(input, 50).toLowerCase()
  return VALID_NICHES.includes(niche) ? niche : undefined
}

// Compara strings de forma segura (timing-safe para API keys)
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
