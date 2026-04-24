import { NextRequest, NextResponse } from 'next/server'

// ─── Rate limiting em memória (Edge Runtime) ─────────────────────────────────
// Nota: em produção com múltiplas instâncias, use Upstash Redis
// https://upstash.com — plano gratuito: 10.000 req/dia

interface RateEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateEntry>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/generate-idea': { max: 10,  windowMs: 60 * 60 * 1000 },  // 10/hora por IP
  '/api/posts':         { max: 20,  windowMs: 60 * 60 * 1000 },  // 20/hora (protegido por API key)
  '/api/':              { max: 100, windowMs: 60 * 1000 },        // 100/min para outras rotas
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function checkRateLimit(key: string, max: number, windowMs: number): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now   = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs }
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt }
}

// Limpar entradas expiradas periodicamente
function cleanupStore() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) rateLimitStore.delete(key)
  }
}

// ─── Middleware principal ─────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getClientIP(req)

  // Limpar store a cada 1000 requests
  if (Math.random() < 0.001) cleanupStore()

  // Só aplica rate limiting nas rotas de API
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Encontrar limite para a rota
  const routeConfig =
    RATE_LIMITS[pathname] ??
    Object.entries(RATE_LIMITS).find(([route]) => pathname.startsWith(route))?.[1] ??
    RATE_LIMITS['/api/']

  const key    = `${ip}:${pathname}`
  const result = checkRateLimit(key, routeConfig.max, routeConfig.windowMs)

  // Headers de rate limit (padrão da indústria)
  const headers = new Headers()
  headers.set('X-RateLimit-Limit',     String(routeConfig.max))
  headers.set('X-RateLimit-Remaining', String(result.remaining))
  headers.set('X-RateLimit-Reset',     String(Math.ceil(result.resetAt / 1000)))

  if (!result.allowed) {
    return NextResponse.json(
      {
        error:   'rate_limit_exceeded',
        message: 'Muitas requisições. Tente novamente em alguns minutos.',
        resetAt: new Date(result.resetAt).toISOString(),
      },
      { status: 429, headers }
    )
  }

  const response = NextResponse.next()
  headers.forEach((value, key) => response.headers.set(key, value))
  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
