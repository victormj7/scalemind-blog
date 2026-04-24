import { NextRequest, NextResponse } from 'next/server'
import type { UserProfile, Ideia, ApiResponse } from '@/types/generator'

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

// ─── Mensagens para a IA ──────────────────────────────────────────────────────

const SYSTEM_MESSAGE = `Você é um especialista em criação de MicroSaaS lucrativos para o mercado brasileiro.

Sua missão é gerar ideias práticas, simples e com potencial real de gerar dinheiro.

Regras:
- Foque em problemas reais que pessoas pagam para resolver
- Seja específico com valores em reais (R$)
- Evite ideias genéricas como "app de delivery" ou "e-commerce"
- Adapte a complexidade ao nível do usuário
- Responda APENAS com JSON válido, sem texto fora do JSON`

function buildUserMessage(profile: UserProfile): string {
  const levelMap = {
    iniciante:     'iniciante sem conhecimento técnico',
    intermediario: 'intermediário com algum conhecimento digital',
    avancado:      'avançado que sabe programar ou tem experiência em negócios',
  }
  const objectiveMap = {
    'renda-extra':   'gerar renda extra de R$ 1.000 a R$ 5.000/mês',
    'criar-negocio': 'criar um negócio digital escalável',
    'escalar':       'escalar algo que já existe',
  }
  const timeMap = {
    pouco: 'até 1h por dia',
    medio: '1 a 3h por dia',
    total: 'dedicação total',
  }

  return `Gere uma ideia de MicroSaaS com base nesses dados:

Área: ${profile.area}
Nível: ${levelMap[profile.level]}
Objetivo: ${objectiveMap[profile.objective]}
Tempo disponível: ${timeMap[profile.time]}

Responda APENAS com este JSON:

{
  "nome": "Nome criativo do produto (máx 35 chars)",
  "descricao": "O que é o produto em 1-2 frases diretas (máx 200 chars)",
  "problema": "Problema específico e doloroso que resolve (máx 200 chars)",
  "publico": "Público-alvo muito específico (máx 120 chars)",
  "monetizacao": "Como cobrar com valores em R$ (máx 200 chars)",
  "receita": "Estimativa realista de receita mensal (máx 80 chars)",
  "passos": [
    "Passo 1 concreto com ação específica",
    "Passo 2 concreto com ação específica",
    "Passo 3 concreto com ação específica",
    "Passo 4 concreto com ação específica"
  ],
  "validacao": "Como validar em 7 dias sem gastar dinheiro (máx 200 chars)",
  "ia": "Como usar IA especificamente nessa ideia (máx 180 chars)",
  "automacao": "Como automatizar os processos principais (máx 180 chars)",
  "iniciante": "Como construir sem saber programar, ferramentas específicas (máx 220 chars)",
  "programador": "Stack técnica recomendada e diferenciais (máx 220 chars)",
  "dificuldade": "Baixo"
}

Regras obrigatórias:
- dificuldade deve ser exatamente "Baixo", "Médio" ou "Alto"
- passos deve ter exatamente 4 itens
- Todos os valores monetários em R$
- Seja direto e prático`
}

// ─── Geração via OpenAI ───────────────────────────────────────────────────────

async function gerarComIA(profile: UserProfile): Promise<Ideia | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_MESSAGE },
          { role: 'user',   content: buildUserMessage(profile) },
        ],
        temperature:     0.85,
        max_tokens:      800,
        response_format: { type: 'json_object' }, // força JSON puro
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return null

    const data  = await res.json()
    const text  = data.choices?.[0]?.message?.content ?? ''
    const ideia = JSON.parse(text) as Ideia

    // Validar campos obrigatórios
    if (!ideia.nome || !ideia.problema || !ideia.publico) return null
    if (!Array.isArray(ideia.passos) || ideia.passos.length === 0) return null
    if (!['Baixo', 'Médio', 'Alto'].includes(ideia.dificuldade)) {
      ideia.dificuldade = 'Médio'
    }

    return ideia
  } catch {
    return null
  }
}

// ─── Fallback local ───────────────────────────────────────────────────────────

function gerarFallback(profile: UserProfile): Ideia {
  const area = profile.area || 'seu nicho'
  const A    = area.charAt(0).toUpperCase() + area.slice(1)

  const banco: Record<string, Ideia> = {
    'renda-extra': {
      nome:        `${A}Templates`,
      descricao:   `Biblioteca de templates profissionais para ${area}: contratos, propostas e relatórios prontos para usar.`,
      problema:    `Profissionais de ${area} perdem horas criando documentos do zero para cada cliente, sem nenhum padrão.`,
      publico:     `Autônomos e freelancers de ${area} que atendem múltiplos clientes`,
      monetizacao: `Pacote único R$ 197. Assinatura R$ 47/mês com 2 templates novos por mês.`,
      receita:     'R$ 1.500 a R$ 6.000/mês',
      passos: [
        `Liste os 10 documentos mais usados em ${area}`,
        'Crie versões profissionais no Canva ou Notion',
        'Monte uma loja no Gumroad com preço de R$ 97 a R$ 297',
        'Divulgue em grupos do Facebook e LinkedIn do nicho',
      ],
      validacao:   `Ofereça 3 templates grátis em troca de e-mail. Se 50 pessoas baixarem em 7 dias, o mercado existe.`,
      ia:          `Use ChatGPT para gerar variações dos templates baseadas no nicho específico de cada cliente.`,
      automacao:   `Make envia o template certo automaticamente quando o cliente preenche um formulário.`,
      iniciante:   `Canva + Gumroad + Brevo para e-mails. Funciona em 3 dias sem código.`,
      programador: `Next.js + Supabase + Stripe. Editor de templates no browser com exportação em PDF.`,
      dificuldade: 'Baixo',
    },
    'criar-negocio': {
      nome:        `${A}Hub`,
      descricao:   `Marketplace vertical que conecta empresas com profissionais verificados de ${area}.`,
      problema:    `Empresas gastam semanas procurando profissionais de ${area}. Freelancers perdem tempo em plataformas genéricas.`,
      publico:     `Empresas que precisam de ${area} e profissionais que querem clientes qualificados`,
      monetizacao: `15% de comissão por projeto. Taxa de destaque R$ 97/mês para profissionais.`,
      receita:     'R$ 5.000 a R$ 25.000/mês',
      passos: [
        `Cadastre 20 profissionais verificados de ${area} na sua rede`,
        'Crie um formulário para empresas descreverem o que precisam',
        'Faça o match manualmente e cobre 15% do projeto',
        'Com R$ 5k em transações, construa a plataforma no Bubble.io',
      ],
      validacao:   `Feche 3 contratos manualmente antes de construir qualquer tecnologia.`,
      ia:          `IA faz match automático entre perfil do profissional e necessidade da empresa.`,
      automacao:   `Make automatiza onboarding, contratos, cobranças e avaliações pós-projeto.`,
      iniciante:   `Softr + Airtable + Stripe. Marketplace funcional em 2 semanas sem código.`,
      programador: `Next.js + Supabase + Stripe Connect para pagamentos entre partes.`,
      dificuldade: 'Médio',
    },
    'escalar': {
      nome:        `${A}Auto`,
      descricao:   `Sistema de automação para ${area} que elimina tarefas repetitivas e escala sem contratar.`,
      problema:    `Negócios de ${area} que crescem precisam contratar mais pessoas para tarefas repetitivas, aumentando custos.`,
      publico:     `Donos de negócios de ${area} que faturam R$ 10k+/mês e querem escalar`,
      monetizacao: `Setup R$ 997 + mensalidade R$ 297/mês. Com 30 clientes = R$ 8.910/mês recorrentes.`,
      receita:     'R$ 8.000 a R$ 40.000/mês',
      passos: [
        `Entreviste 5 donos de negócios de ${area} sobre o que mais consome tempo`,
        'Crie as 3 automações mais pedidas usando Make ou n8n',
        'Ofereça implementação por R$ 997 + manutenção R$ 297/mês',
        'Documente o processo e escale para 20 clientes',
      ],
      validacao:   `Implemente de graça para 2 negócios. Se economizarem 10h+/semana, o produto tem valor.`,
      ia:          `IA analisa os dados do negócio e sugere novas automações baseadas nos gargalos.`,
      automacao:   `Make ou n8n conectam CRM, financeiro, atendimento e marketing automaticamente.`,
      iniciante:   `Make + Airtable + Typeform. Implementação completa sem código em 1 semana.`,
      programador: `n8n self-hosted + Next.js dashboard + Supabase. Custo zero de plataforma.`,
      dificuldade: 'Médio',
    },
  }

  return banco[profile.objective] ?? banco['renda-extra']
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip    = getClientIP(req)
  const today = getToday()
  const usage = usageMap.get(ip)

  if (usage && usage.date === today && usage.count >= FREE_LIMIT) {
    return NextResponse.json({
      success: false,
      error:   'limit_reached',
      limit:   FREE_LIMIT,
      used:    usage.count,
    }, { status: 429 })
  }

  let profile: UserProfile
  try {
    const body = await req.json()
    profile = {
      area:      String(body.area ?? 'geral').slice(0, 100),
      level:     ['iniciante','intermediario','avancado'].includes(body.level) ? body.level : 'iniciante',
      objective: ['renda-extra','criar-negocio','escalar'].includes(body.objective) ? body.objective : 'renda-extra',
      time:      ['pouco','medio','total'].includes(body.time) ? body.time : 'pouco',
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Body inválido.' }, { status: 400 })
  }

  // Atualizar contador
  if (!usage || usage.date !== today) {
    usageMap.set(ip, { count: 1, date: today })
  } else {
    usageMap.set(ip, { count: usage.count + 1, date: today })
  }
  const newUsage = usageMap.get(ip)!

  // Tentar IA, fallback se falhar
  const aiIdeia = await gerarComIA(profile)
  const fallback = aiIdeia === null
  const ideia    = aiIdeia ?? gerarFallback(profile)

  const response: ApiResponse = {
    success:  true,
    fallback,
    source:   fallback ? 'local' : 'ai',
    data:     ideia,
    usage: {
      used:      newUsage.count,
      limit:     FREE_LIMIT,
      remaining: Math.max(0, FREE_LIMIT - newUsage.count),
    },
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
