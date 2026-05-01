import { NextRequest, NextResponse } from 'next/server'
import type { Ideia, UserProfile } from '@/types/generator'

const TOPIC_PROMPTS: Record<string, string> = {
  'primeiro-cliente': 'Onde e como conseguir o primeiro cliente pagante para essa ideia. Seja específico: canais, abordagem, script de mensagem, onde encontrar o público.',
  'precificacao':     'Como precificar esse produto/serviço. Inclua: modelo de preço recomendado, valores em R$, como justificar o preço, estratégia de upsell.',
  'stack-tecnica':    'Stack técnica completa para construir isso. Inclua: ferramentas no-code para iniciantes E stack de código para devs, custos mensais estimados.',
  'marketing':        'Estratégia de marketing inicial com orçamento zero. Canais específicos, tipo de conteúdo, frequência, como gerar os primeiros 100 leads.',
  'automacao':        'Como automatizar os processos principais com IA e no-code. Ferramentas específicas (Make, n8n, Zapier), fluxos concretos, economia de tempo estimada.',
  'riscos':           'Principais riscos e obstáculos para essa ideia. Para cada risco: como mitigar, sinais de alerta, plano B.',
}

export async function POST(req: NextRequest) {
  let ideia: Ideia, topic: string, profile: UserProfile
  try {
    const body = await req.json()
    ideia   = body.ideia
    topic   = String(body.topic ?? '')
    profile = body.profile
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const topicPrompt = TOPIC_PROMPTS[topic]
  if (!topicPrompt || !ideia?.nome) {
    return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ result: 'IA não disponível no momento. Tente novamente mais tarde.' })
  }

  const prompt = `Você é um copiloto de negócios especialista no mercado brasileiro.

Ideia: ${ideia.nome}
Descrição: ${ideia.descricao}
Público: ${ideia.publico}
Receita estimada: ${ideia.receita}
Nível do usuário: ${profile.level}
Área: ${profile.area}

Tarefa: ${topicPrompt}

Responda em português, de forma direta e prática. Máximo 250 palavras. Use listas quando ajudar a clareza. Sem introduções genéricas.`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages:    [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens:  400,
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return NextResponse.json({ result: 'Erro ao consultar IA. Tente novamente.' })

    const data   = await res.json()
    const result = data.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ result: 'Erro de conexão com a IA. Tente novamente.' })
  }
}
