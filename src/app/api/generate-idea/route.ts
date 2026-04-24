import { NextRequest, NextResponse } from 'next/server'
import type { UserProfile, IdeaFull, IdeaPreview, GenerateResponse } from '@/types/generator'

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

// ─── Prompt personalizado por perfil ─────────────────────────────────────────

function buildPrompt(profile: UserProfile): string {
  const levelMap = {
    iniciante:     'iniciante (sem conhecimento técnico)',
    intermediario: 'intermediário (algum conhecimento digital)',
    avancado:      'avançado (sabe programar ou tem experiência em negócios)',
  }
  const objectiveMap = {
    'renda-extra':    'gerar uma renda extra de R$ 1.000 a R$ 5.000/mês',
    'criar-negocio':  'criar um negócio digital escalável',
    'escalar':        'escalar algo que já existe ou tem experiência',
  }
  const timeMap = {
    pouco: 'pouco tempo disponível (até 1h por dia)',
    medio: 'tempo moderado (1 a 3h por dia)',
    total: 'dedicação total ao projeto',
  }

  return `Você é um especialista em MicroSaaS, negócios digitais e empreendedorismo no Brasil.

Crie UMA ideia de MicroSaaS altamente personalizada para este perfil:
- Área de interesse: ${profile.area}
- Nível: ${levelMap[profile.level]}
- Objetivo: ${objectiveMap[profile.objective]}
- Tempo disponível: ${timeMap[profile.time]}

A ideia deve ser:
- Prática e executável para o perfil descrito
- Focada no mercado brasileiro
- Realista em termos de receita e dificuldade
- Diferente de ideias genéricas como "app de delivery" ou "e-commerce"

Responda APENAS com um JSON válido neste formato:
{
  "name": "Nome criativo do produto (máx 35 chars)",
  "tagline": "Frase de impacto que gera curiosidade (máx 80 chars)",
  "problem": "Problema específico e doloroso que resolve (máx 200 chars)",
  "audience": "Público-alvo muito específico (máx 120 chars)",
  "potential": "Estimativa realista de receita mensal (máx 60 chars)",
  "difficulty": "Baixo",
  "description": "Explicação detalhada do produto em 2-3 frases (máx 300 chars)",
  "howToApply": "Como aplicar na prática de forma concreta (máx 300 chars)",
  "stepByStep": [
    "Passo 1 concreto e acionável",
    "Passo 2 concreto e acionável",
    "Passo 3 concreto e acionável",
    "Passo 4 concreto e acionável"
  ],
  "validation": "Como validar a ideia em 7 dias sem gastar dinheiro (máx 250 chars)",
  "monetization": "Formas reais de monetização com valores em reais (máx 250 chars)",
  "scalability": "Como escalar de R$ 1k para R$ 10k/mês (máx 200 chars)",
  "aiUsage": "Como usar IA especificamente nessa ideia (máx 200 chars)",
  "automationUsage": "Como automatizar processos dessa ideia (máx 200 chars)",
  "noCodeVersion": "Como construir sem saber programar, com ferramentas específicas (máx 250 chars)",
  "devVersion": "Como construir sabendo programar, com stack recomendada (máx 250 chars)"
}

Regras obrigatórias:
- difficulty deve ser exatamente "Baixo", "Médio" ou "Alto"
- stepByStep deve ter exatamente 4 itens
- Todos os valores monetários em reais (R$)
- A ideia deve ser adequada para o nível ${profile.level}
- Considere o tempo disponível: ${timeMap[profile.time]}`
}

// ─── Fallback local personalizado ────────────────────────────────────────────

function generateLocalIdea(profile: UserProfile): IdeaFull {
  const ideas: IdeaFull[] = [
    {
      name:        'ChecklistPro',
      tagline:     'Checklists profissionais que seus clientes vão pagar para usar',
      problem:     `Profissionais de ${profile.area} perdem tempo criando processos do zero para cada cliente, sem padronização.`,
      audience:    `Profissionais autônomos e pequenas empresas de ${profile.area}`,
      potential:   'R$ 2.000 a R$ 8.000/mês',
      difficulty:  'Baixo',
      description: `Plataforma de checklists e processos digitais para profissionais de ${profile.area}. Cada checklist é vendido como template ou assinatura.`,
      howToApply:  'Crie 5 checklists dos processos mais comuns da sua área. Venda como templates digitais ou como assinatura mensal.',
      stepByStep:  [
        `Identifique os 5 processos mais repetitivos em ${profile.area}`,
        'Crie os checklists no Notion ou Google Docs',
        'Monte uma landing page no Carrd ou Framer',
        'Venda por R$ 47/mês ou R$ 297/ano',
      ],
      validation:      'Ofereça gratuitamente para 5 profissionais da área e peça feedback. Se 3 de 5 usarem toda semana, valide.',
      monetization:    'Assinatura mensal R$ 47/mês, plano anual R$ 397. Venda de templates avulsos R$ 97 cada.',
      scalability:     'Expanda para outros nichos. Com 200 assinantes = R$ 9.400/mês recorrentes.',
      aiUsage:         'Use ChatGPT para gerar novos checklists automaticamente baseados em casos de uso enviados pelos usuários.',
      automationUsage: 'Automatize envio de lembretes semanais via Make + e-mail quando checklists ficam incompletos.',
      noCodeVersion:   'Notion + Gumroad para venda + Brevo para e-mails. Zero código, funciona em 1 semana.',
      devVersion:      'Next.js + Supabase + Stripe. Adicione colaboração em tempo real e analytics de uso.',
    },
    {
      name:        'RelatórioFácil',
      tagline:     'Relatórios profissionais em minutos, não em horas',
      problem:     `Profissionais de ${profile.area} perdem 3-5 horas por semana criando relatórios manuais para clientes.`,
      audience:    `Prestadores de serviço e consultores de ${profile.area}`,
      potential:   'R$ 3.000 a R$ 12.000/mês',
      difficulty:  'Médio',
      description: `Gerador automático de relatórios profissionais para ${profile.area}. O usuário preenche dados básicos e recebe um PDF pronto.`,
      howToApply:  'Crie um formulário que coleta os dados do período e gera automaticamente um relatório em PDF com gráficos.',
      stepByStep:  [
        `Mapeie quais dados os profissionais de ${profile.area} precisam reportar`,
        'Crie um template de relatório no Canva ou Google Slides',
        'Automatize a geração com Make + Google Slides API',
        'Cobre R$ 97/mês por cliente ilimitado',
      ],
      validation:      'Faça manualmente para 3 clientes de graça. Se economizarem 2h+/semana, o produto tem valor.',
      monetization:    'R$ 97/mês por usuário. Plano agência R$ 297/mês para até 20 clientes.',
      scalability:     'Adicione integrações com ferramentas da área. Com 100 usuários = R$ 9.700/mês.',
      aiUsage:         'Use IA para gerar análises e insights automáticos baseados nos dados inseridos.',
      automationUsage: 'Make automatiza coleta de dados de múltiplas fontes e dispara geração do relatório toda semana.',
      noCodeVersion:   'Typeform + Make + Google Slides + Zapier. Funciona sem código.',
      devVersion:      'Next.js + Puppeteer para PDF + Supabase. Adicione dashboard com histórico.',
    },
  ]

  return ideas[Math.floor(Math.random() * ideas.length)]
}

// ─── Handlers ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip    = getClientIP(req)
  const today = getToday()
  const usage = usageMap.get(ip)

  if (usage && usage.date === today && usage.count >= FREE_LIMIT) {
    return NextResponse.json({
      error:   'limit_reached',
      message: 'Limite diário atingido.',
      limit:   FREE_LIMIT,
      used:    usage.count,
    }, { status: 429 })
  }

  let profile: UserProfile
  try {
    const body = await req.json()
    profile = {
      area:      String(body.area      ?? 'geral').slice(0, 100),
      level:     ['iniciante','intermediario','avancado'].includes(body.level) ? body.level : 'iniciante',
      objective: ['renda-extra','criar-negocio','escalar'].includes(body.objective) ? body.objective : 'renda-extra',
      time:      ['pouco','medio','total'].includes(body.time) ? body.time : 'pouco',
    }
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  // Atualizar contador
  if (!usage || usage.date !== today) {
    usageMap.set(ip, { count: 1, date: today })
  } else {
    usageMap.set(ip, { count: usage.count + 1, date: today })
  }
  const newUsage = usageMap.get(ip)!

  // Tentar OpenAI
  let full: IdeaFull | null = null
  let source: 'ai' | 'local' = 'local'

  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:       'gpt-4o-mini',
          messages:    [{ role: 'user', content: buildPrompt(profile) }],
          temperature: 0.85,
          max_tokens:  900,
        }),
        signal: AbortSignal.timeout(10000),
      })

      if (res.ok) {
        const data  = await res.json()
        const text  = data.choices?.[0]?.message?.content ?? ''
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
          const parsed = JSON.parse(match[0]) as IdeaFull
          if (parsed.name && parsed.problem && Array.isArray(parsed.stepByStep)) {
            if (!['Baixo','Médio','Alto'].includes(parsed.difficulty)) parsed.difficulty = 'Médio'
            full   = parsed
            source = 'ai'
          }
        }
      }
    } catch { /* fallback */ }
  }

  if (!full) full = generateLocalIdea(profile)

  // Montar preview (visível para todos)
  const preview: IdeaPreview = {
    name:       full.name,
    tagline:    full.tagline,
    problem:    full.problem,
    audience:   full.audience,
    potential:  full.potential,
    difficulty: full.difficulty,
  }

  const response: GenerateResponse = {
    preview,
    full:      null, // plano gratuito não recebe full
    isPremium: false,
    source,
    usage: {
      used:      newUsage.count,
      limit:     FREE_LIMIT,
      remaining: Math.max(0, FREE_LIMIT - newUsage.count),
    },
  }

  // Premium: retorna ideia completa (verificar token futuro)
  const premiumToken = req.headers.get('x-premium-token')
  if (premiumToken === process.env.PREMIUM_TOKEN) {
    response.full      = full
    response.isPremium = true
  }

  return NextResponse.json(response)
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
