import { NextRequest, NextResponse } from 'next/server'
import { generateIdea } from '@/lib/ideas'

// Rate limiting em memória (reseta quando o servidor reinicia)
// Para produção real, use Redis ou Supabase
const usageMap = new Map<string, { count: number; date: string }>()

const FREE_LIMIT = 3

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    req.headers.get('x-real-ip') ??
    'anonymous'
  )
}

export async function POST(req: NextRequest) {
  const ip    = getClientIP(req)
  const today = getToday()

  // Verificar uso do dia
  const usage = usageMap.get(ip)

  if (usage && usage.date === today && usage.count >= FREE_LIMIT) {
    return NextResponse.json({
      error:   'limit_reached',
      message: 'Você atingiu o limite diário de 3 ideias gratuitas.',
      limit:   FREE_LIMIT,
      used:    usage.count,
    }, { status: 429 })
  }

  // Parse do body
  let niche: string | undefined
  try {
    const body = await req.json()
    niche = body.niche
  } catch {
    niche = undefined
  }

  // Gerar ideia
  const idea = generateIdea(niche)

  // Atualizar contador
  if (!usage || usage.date !== today) {
    usageMap.set(ip, { count: 1, date: today })
  } else {
    usageMap.set(ip, { count: usage.count + 1, date: today })
  }

  const newUsage = usageMap.get(ip)!

  return NextResponse.json({
    idea,
    usage: {
      used:      newUsage.count,
      limit:     FREE_LIMIT,
      remaining: Math.max(0, FREE_LIMIT - newUsage.count),
    },
  })
}

export async function GET(req: NextRequest) {
  const ip    = getClientIP(req)
  const today = getToday()
  const usage = usageMap.get(ip)

  const used = (usage && usage.date === today) ? usage.count : 0

  return NextResponse.json({
    used,
    limit:     FREE_LIMIT,
    remaining: Math.max(0, FREE_LIMIT - used),
  })
}
