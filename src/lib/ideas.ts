export interface MicroSaaSIdea {
  name: string
  description: string
  problem: string
  audience: string
  monetization: string
  difficulty: 'Baixo' | 'Médio' | 'Alto'
  mrpPotential: string // receita recorrente mensal estimada
  tools: string[]
}

const IDEAS_BY_NICHE: Record<string, MicroSaaSIdea[]> = {
  geral: [
    {
      name: 'LinkBio Pro',
      description: 'Página de links personalizável para criadores de conteúdo com analytics integrado.',
      problem: 'Criadores perdem cliques por não ter uma página de links profissional.',
      audience: 'Influenciadores, criadores de conteúdo, freelancers',
      monetization: 'Assinatura mensal R$ 29/mês. Plano gratuito com limite de links.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 3.000 a R$ 15.000/mês com 100-500 assinantes',
      tools: ['Bubble.io', 'Stripe', 'Vercel'],
    },
    {
      name: 'PropostaRápida',
      description: 'Gerador de propostas comerciais profissionais em PDF com templates por nicho.',
      problem: 'Freelancers perdem horas criando propostas do zero para cada cliente.',
      audience: 'Freelancers, agências, consultores',
      monetization: 'R$ 47/mês ou R$ 397/ano. Plano gratuito com 3 propostas/mês.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 5.000 a R$ 20.000/mês com 100-400 assinantes',
      tools: ['Next.js', 'Supabase', 'PDF-lib'],
    },
    {
      name: 'AgendaBot',
      description: 'Sistema de agendamento com confirmação automática via WhatsApp para pequenos negócios.',
      problem: 'Salões, clínicas e consultórios perdem clientes por falta de confirmação de agendamentos.',
      audience: 'Salões de beleza, clínicas, consultórios, personal trainers',
      monetization: 'R$ 97/mês por estabelecimento. Setup único de R$ 197.',
      difficulty: 'Médio',
      mrpPotential: 'R$ 10.000 a R$ 50.000/mês com 100-500 clientes',
      tools: ['Softr', 'Airtable', 'Twilio', 'Stripe'],
    },
    {
      name: 'ReviewBoost',
      description: 'Ferramenta que automatiza pedidos de avaliação no Google para negócios locais.',
      problem: 'Negócios locais têm poucas avaliações no Google e perdem clientes para concorrentes.',
      audience: 'Restaurantes, lojas, clínicas, academias',
      monetization: 'R$ 67/mês. Plano anual com desconto de 30%.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 7.000 a R$ 30.000/mês com 100-450 clientes',
      tools: ['Make', 'Twilio', 'Google Business API'],
    },
    {
      name: 'ContratoFácil',
      description: 'Plataforma de contratos digitais com assinatura eletrônica para autônomos brasileiros.',
      problem: 'Autônomos não têm contratos profissionais e ficam desprotegidos juridicamente.',
      audience: 'Freelancers, MEIs, prestadores de serviço',
      monetization: 'R$ 37/mês ou R$ 297/ano. 5 contratos gratuitos/mês.',
      difficulty: 'Médio',
      mrpPotential: 'R$ 8.000 a R$ 40.000/mês com 200-1000 assinantes',
      tools: ['Next.js', 'Supabase', 'DocuSign API'],
    },
  ],
  marketing: [
    {
      name: 'CopyIA',
      description: 'Gerador de copies para anúncios no Facebook e Instagram com IA, focado no mercado brasileiro.',
      problem: 'Gestores de tráfego perdem horas criando textos para anúncios.',
      audience: 'Gestores de tráfego, agências de marketing, infoprodutores',
      monetization: 'R$ 97/mês. Plano gratuito com 10 copies/mês.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 10.000 a R$ 50.000/mês com 100-500 assinantes',
      tools: ['Next.js', 'OpenAI API', 'Stripe'],
    },
    {
      name: 'HashtagPro',
      description: 'Gerador de hashtags estratégicas para Instagram com análise de engajamento por nicho.',
      problem: 'Criadores usam hashtags aleatórias e perdem alcance orgânico.',
      audience: 'Criadores de conteúdo, social media managers, marcas',
      monetization: 'R$ 27/mês. Plano gratuito com 5 buscas/dia.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 3.000 a R$ 15.000/mês com 100-500 assinantes',
      tools: ['Next.js', 'Instagram API', 'Supabase'],
    },
    {
      name: 'RelatorioAuto',
      description: 'Relatórios automáticos de marketing digital enviados por e-mail toda semana para clientes.',
      problem: 'Agências perdem horas criando relatórios manuais para cada cliente.',
      audience: 'Agências de marketing, gestores de tráfego',
      monetization: 'R$ 197/mês por agência. Inclui até 10 clientes.',
      difficulty: 'Médio',
      mrpPotential: 'R$ 20.000 a R$ 100.000/mês com 100-500 agências',
      tools: ['Make', 'Google Looker Studio', 'Stripe'],
    },
  ],
  saude: [
    {
      name: 'NutriPlano',
      description: 'Gerador de planos alimentares personalizados para nutricionistas com exportação em PDF.',
      problem: 'Nutricionistas perdem 2-3 horas por paciente criando planos alimentares manualmente.',
      audience: 'Nutricionistas, personal trainers, coaches de saúde',
      monetization: 'R$ 127/mês por profissional. Plano gratuito com 5 planos/mês.',
      difficulty: 'Médio',
      mrpPotential: 'R$ 15.000 a R$ 60.000/mês com 100-500 profissionais',
      tools: ['Bubble.io', 'Supabase', 'PDF generation'],
    },
    {
      name: 'LembraMed',
      description: 'Sistema de lembretes de medicamentos via WhatsApp para pacientes idosos.',
      problem: 'Idosos esquecem de tomar medicamentos, causando complicações de saúde.',
      audience: 'Familiares de idosos, clínicas geriátricas, planos de saúde',
      monetization: 'R$ 29/mês por família. Plano anual R$ 249.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 5.000 a R$ 30.000/mês com 200-1000 famílias',
      tools: ['Make', 'Twilio', 'Airtable'],
    },
  ],
  educacao: [
    {
      name: 'QuizMaker',
      description: 'Criador de quizzes e avaliações online para professores e criadores de cursos.',
      problem: 'Professores perdem tempo criando avaliações e não têm como acompanhar resultados facilmente.',
      audience: 'Professores, criadores de cursos online, escolas',
      monetization: 'R$ 47/mês. Plano gratuito com 3 quizzes ativos.',
      difficulty: 'Médio',
      mrpPotential: 'R$ 5.000 a R$ 25.000/mês com 100-500 professores',
      tools: ['Next.js', 'Supabase', 'Stripe'],
    },
    {
      name: 'CertificadoAuto',
      description: 'Gerador automático de certificados de conclusão para cursos online.',
      problem: 'Criadores de cursos emitem certificados manualmente, um por um.',
      audience: 'Criadores de cursos, escolas online, empresas de treinamento',
      monetization: 'R$ 67/mês. Plano gratuito com 20 certificados/mês.',
      difficulty: 'Baixo',
      mrpPotential: 'R$ 7.000 a R$ 35.000/mês com 100-500 clientes',
      tools: ['Next.js', 'Canvas API', 'Supabase'],
    },
  ],
  financas: [
    {
      name: 'FluxoCerto',
      description: 'Controle de fluxo de caixa simplificado para MEIs e pequenos negócios.',
      problem: 'MEIs não têm controle financeiro e não sabem se estão lucrando.',
      audience: 'MEIs, autônomos, pequenos empreendedores',
      monetization: 'R$ 37/mês. Plano gratuito com 30 lançamentos/mês.',
      difficulty: 'Médio',
      mrpPotential: 'R$ 10.000 a R$ 50.000/mês com 300-1500 assinantes',
      tools: ['Next.js', 'Supabase', 'Stripe'],
    },
    {
      name: 'CobrançaFácil',
      description: 'Sistema de cobrança automática com boleto e PIX para prestadores de serviço.',
      problem: 'Freelancers e autônomos têm dificuldade para cobrar clientes de forma profissional.',
      audience: 'Freelancers, prestadores de serviço, MEIs',
      monetization: '1% por transação + R$ 29/mês de mensalidade.',
      difficulty: 'Alto',
      mrpPotential: 'R$ 20.000 a R$ 100.000/mês com volume de transações',
      tools: ['Next.js', 'Stripe', 'Supabase', 'Asaas API'],
    },
  ],
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateIdea(niche?: string): MicroSaaSIdea {
  const key = niche?.toLowerCase().trim() ?? 'geral'

  // Tenta encontrar o nicho exato, senão usa geral
  const nicheIdeas = IDEAS_BY_NICHE[key] ?? IDEAS_BY_NICHE['geral']

  // Mistura com algumas ideias gerais para variedade
  const pool = key !== 'geral'
    ? [...nicheIdeas, ...IDEAS_BY_NICHE['geral']]
    : nicheIdeas

  return getRandomItem(pool)
}

export function getAvailableNiches(): string[] {
  return Object.keys(IDEAS_BY_NICHE).filter(k => k !== 'geral')
}
