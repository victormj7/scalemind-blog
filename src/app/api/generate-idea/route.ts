import { NextRequest, NextResponse } from 'next/server'
import { generateIdea } from '@/lib/ideas'
import { validateNiche } from '@/lib/validation'
import type { MicroSaaSIdea } from '@/lib/ideas'

const FREE_LIMIT = 3
const usageMap   = new Map<string, { count: number; date: string }>()

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'
  )
}

// ─── Geração via OpenAI ───────────────────────────────────────────────────────

async function generateWithAI(niche?: string): Promise<MicroSaaSIdea | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const nicheText = niche ? `focada no nicho de ${niche}` : 'para qualquer nicho'

  const prompt = `Você é um especialista em MicroSaaS e negócios digitais no Brasil.
Gere UMA ideia de MicroSaaS ${nicheText}, prática e realista para o mercado brasileiro.

Responda APENAS com um JSON válido neste formato exato:
{
  "name": "Nome do produto (máx 30 chars)",
  "description": "Descrição em 1 frase clara (máx 120 chars)",
  "problem": "Problema específico que resolve (máx 150 chars)",
  "audience": "Público-alvo específico (máx 100 chars)",
  "monetization": "Modelo de preço em reais (máx 120 chars)",
  "difficulty": "Baixo",
  "mrpPotential": "Estimativa de receita mensal realista (máx 80 chars)",
  "tools": ["ferramenta1", "ferramenta2", "ferramenta3"]
}

Regras:
- difficulty deve ser exatamente "Baixo", "Médio" ou "Alto"
- tools deve ter 2 a 4 ferramentas no-code ou low-code
- mrpPotential deve ser realista para o Brasil
- Não repita ideias óbvias como "app de delivery" ou "e-commerce"`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages:    [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens:  400,
      }),
      signal: AbortSignal.timeout(8000), // timeout de 8s
    })

    if (!res.ok) return null

    const data  = await res.json()
    const text  = data.choices?.[0]?.message?.content ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null

    const idea = JSON.parse(match[0]) as MicroSaaSIdea

    // Validar campos obrigatórios
    if (!idea.name || !idea.description || !idea.problem) return null
    if (!['Baixo', 'Médio', 'Alto'].includes(idea.difficulty)) {
      idea.difficulty = 'Médio'
    }
    if (!Array.isArray(idea.tools)) idea.tools = ['Next.js', 'Supabase']

    return idea
  } catch {
    return null
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip    = getClientIP(req)
  const today = getToday()
  const usage = usageMap.get(ip)

  if (usage && usage.date === today && usage.count >= FREE_LIMIT) {
    return NextResponse.json({
      error:   'limit_reached',
      message: 'Você atingiu o limite diário de 3 ideias gratuitas.',
      limit:   FREE_LIMIT,
      used:    usage.count,
    }, { status: 429 })
  }

  let niche: string | undefined
  try {
    const body = await req.json()
    niche = validateNiche(body.niche)
  } catch {
    niche = undefined
  }

  // Tenta OpenAI primeiro, fallback para banco local
  const aiIdea    = await generateWithAI(niche)
  const idea      = aiIdea ?? generateIdea(niche)
  const source    = aiIdea ? 'ai' : 'local'

  // Atualizar contador
  if (!usage || usage.date !== today) {
    usageMap.set(ip, { count: 1, date: today })
  } else {
    usageMap.set(ip, { count: usage.count + 1, date: today })
  }

  const newUsage = usageMap.get(ip)!

  return NextResponse.json({
    idea,
    source,
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
  const used  = (usage && usage.date === today) ? usage.count : 0

  return NextResponse.json({
    used,
    limit:     FREE_LIMIT,
    remaining: Math.max(0, FREE_LIMIT - used),
    hasAI:     !!process.env.OPENAI_API_KEY,
  })
}
