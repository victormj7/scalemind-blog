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
  const area = profile.area || 'geral'

  // Banco de ideias por objetivo
  const byObjective: Record<string, IdeaFull[]> = {
    'renda-extra': [
      {
        name:        `${area.charAt(0).toUpperCase() + area.slice(1)}Templates`,
        tagline:     `Templates prontos que profissionais de ${area} pagam para usar todo dia`,
        problem:     `Profissionais de ${area} perdem horas criando documentos do zero. Cada cliente exige um formato diferente e não existe padrão.`,
        audience:    `Autônomos e freelancers de ${area} que atendem múltiplos clientes`,
        potential:   'R$ 1.500 a R$ 6.000/mês',
        difficulty:  'Baixo',
        description: `Biblioteca de templates profissionais para ${area}: contratos, propostas, relatórios e checklists prontos para usar e personalizar.`,
        howToApply:  `Crie 10 templates dos documentos mais usados em ${area}. Venda como pacote único ou assinatura com novos templates mensais.`,
        stepByStep:  [
          `Liste os 10 documentos que você mais cria ou vê sendo criados em ${area}`,
          'Crie versões profissionais no Canva, Notion ou Google Docs',
          'Monte uma loja no Gumroad ou Hotmart com preço de R$ 97 a R$ 297',
          'Divulgue em grupos do Facebook e LinkedIn do nicho',
        ],
        validation:      'Ofereça 3 templates grátis em troca de e-mail. Se 50 pessoas baixarem em 7 dias, o mercado existe.',
        monetization:    'Pacote único R$ 197. Assinatura mensal R$ 47/mês com 2 templates novos por mês. Meta: 100 assinantes = R$ 4.700/mês.',
        scalability:     'Expanda para outros nichos similares. Contrate criadores de conteúdo para produzir templates em escala.',
        aiUsage:         'Use ChatGPT para gerar variações dos templates automaticamente baseadas no nicho do cliente.',
        automationUsage: 'Make envia automaticamente o template certo quando o cliente preenche um formulário com suas necessidades.',
        noCodeVersion:   'Canva + Gumroad + Brevo para e-mails. Funciona em 3 dias sem código.',
        devVersion:      'Next.js + Supabase + Stripe. Editor de templates no browser com exportação em PDF.',
      },
      {
        name:        'MentorIA',
        tagline:     `Respostas de especialista em ${area} disponíveis 24h por dia`,
        problem:     `Iniciantes em ${area} têm dúvidas simples mas não têm acesso a mentores. Contratar um consultor custa R$ 200+/hora.`,
        audience:    `Pessoas que estão começando em ${area} e precisam de orientação prática`,
        potential:   'R$ 2.000 a R$ 8.000/mês',
        difficulty:  'Baixo',
        description: `Chatbot especializado em ${area} que responde dúvidas, sugere próximos passos e entrega conteúdo personalizado por assinatura mensal.`,
        howToApply:  `Treine um chatbot com as 100 perguntas mais frequentes de ${area}. Venda acesso por assinatura mensal.`,
        stepByStep:  [
          `Colete as 100 dúvidas mais comuns de iniciantes em ${area}`,
          'Configure um chatbot no Typebot ou Botpress com essas respostas',
          'Adicione uma área de membros no Hotmart ou Kiwify',
          'Cobre R$ 37/mês pelo acesso ilimitado ao chatbot',
        ],
        validation:      'Crie um grupo no WhatsApp e responda dúvidas manualmente por 2 semanas. Se as mesmas perguntas se repetirem, automatize.',
        monetization:    'Assinatura R$ 37/mês. Com 200 assinantes = R$ 7.400/mês. Upsell para mentoria individual R$ 297/mês.',
        scalability:     'Adicione novos nichos. O mesmo sistema funciona para qualquer área de conhecimento.',
        aiUsage:         'Integre com OpenAI para respostas dinâmicas e personalizadas baseadas no histórico do usuário.',
        automationUsage: 'Make envia conteúdo semanal personalizado baseado nas dúvidas que o usuário fez no mês.',
        noCodeVersion:   'Typebot + Hotmart + Brevo. Sem código, funciona em 1 semana.',
        devVersion:      'Next.js + OpenAI API + Supabase para histórico. Adicione memória de conversas.',
      },
    ],
    'criar-negocio': [
      {
        name:        `${area.charAt(0).toUpperCase() + area.slice(1)}Hub`,
        tagline:     `A plataforma que conecta quem precisa com quem entende de ${area}`,
        problem:     `Empresas gastam semanas procurando profissionais qualificados de ${area}. Freelancers perdem tempo em plataformas genéricas com muita concorrência.`,
        audience:    `Empresas que precisam de serviços de ${area} e profissionais que querem clientes qualificados`,
        potential:   'R$ 5.000 a R$ 25.000/mês',
        difficulty:  'Médio',
        description: `Marketplace vertical especializado em ${area}: conecta empresas com profissionais verificados, com sistema de avaliação e pagamento integrado.`,
        howToApply:  `Comece como curador manual: conecte 10 empresas com 10 profissionais de ${area}. Cobre 15% de comissão. Automatize depois.`,
        stepByStep:  [
          `Cadastre 20 profissionais verificados de ${area} na sua rede`,
          'Crie um formulário simples para empresas descreverem o que precisam',
          'Faça o match manualmente e cobre 15% do valor do projeto',
          'Com R$ 5k em transações, invista em uma plataforma no Bubble.io',
        ],
        validation:      'Feche 3 contratos manualmente antes de construir qualquer tecnologia. Se funcionar, automatize.',
        monetization:    '15% de comissão por projeto. Taxa de destaque R$ 97/mês para profissionais. Meta: R$ 50k em transações = R$ 7.500/mês.',
        scalability:     'Expanda para cidades e depois para outros nichos. Adicione cursos e certificações para profissionais.',
        aiUsage:         'IA faz o match automático entre perfil do profissional e necessidade da empresa com score de compatibilidade.',
        automationUsage: 'Make automatiza onboarding, contratos, cobranças e avaliações pós-projeto.',
        noCodeVersion:   'Softr + Airtable + Stripe. Marketplace funcional em 2 semanas sem código.',
        devVersion:      'Next.js + Supabase + Stripe Connect para pagamentos entre partes.',
      },
    ],
    'escalar': [
      {
        name:        `${area.charAt(0).toUpperCase() + area.slice(1)}Auto`,
        tagline:     `Automatize os processos repetitivos de ${area} e escale sem contratar`,
        problem:     `Negócios de ${area} que crescem precisam contratar mais pessoas para tarefas repetitivas. Isso aumenta custo e complexidade operacional.`,
        audience:    `Donos de negócios de ${area} que faturam R$ 10k+/mês e querem escalar sem aumentar equipe`,
        potential:   'R$ 8.000 a R$ 40.000/mês',
        difficulty:  'Médio',
        description: `Sistema de automação personalizado para ${area}: automatiza atendimento, cobranças, relatórios e processos operacionais do negócio.`,
        howToApply:  `Mapeie os 5 processos mais repetitivos de negócios de ${area}. Crie automações prontas e venda como serviço mensal.`,
        stepByStep:  [
          `Entreviste 5 donos de negócios de ${area} sobre o que mais consome tempo`,
          'Crie as 3 automações mais pedidas usando Make ou n8n',
          'Ofereça implementação por R$ 997 + manutenção R$ 297/mês',
          'Documente o processo e escale para 20 clientes',
        ],
        validation:      'Implemente de graça para 2 negócios de ${area}. Se economizarem 10h+/semana, o produto tem valor real.',
        monetization:    'Setup R$ 997 + mensalidade R$ 297/mês. Com 30 clientes = R$ 8.910/mês recorrentes.',
        scalability:     'Crie um produto SaaS com as automações mais populares. Venda como self-service por R$ 197/mês.',
        aiUsage:         'IA analisa os dados do negócio e sugere novas automações baseadas nos gargalos identificados.',
        automationUsage: 'Make ou n8n conectam todas as ferramentas do negócio: CRM, financeiro, atendimento e marketing.',
        noCodeVersion:   'Make + Airtable + Typeform. Implementação completa sem código em 1 semana.',
        devVersion:      'n8n self-hosted + Next.js dashboard + Supabase. Controle total e custo zero de plataforma.',
      },
    ],
  }

  const pool = byObjective[profile.objective] ?? byObjective['renda-extra']
  return pool[Math.floor(Math.random() * pool.length)]
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
