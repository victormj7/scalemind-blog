import { NextRequest, NextResponse } from 'next/server'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type EventName =
  | 'idea_generated'
  | 'upgrade_click'
  | 'limit_reached'
  | 'waitlist_signup'
  | 'page_view'

interface TrackEvent {
  event:     EventName
  timestamp: number
  ip:        string
  data?:     Record<string, unknown>
}

// ─── Store em memória com limite de tamanho ───────────────────────────────────
// Para produção: substituir por Supabase ou PostHog
// Mantém apenas os últimos 1.000 eventos para não vazar memória

const MAX_EVENTS = 1000
const events: TrackEvent[] = []

// Contadores agregados — persistem entre requests mesmo sem banco
const counters: Record<string, number> = {
  idea_generated:  0,
  upgrade_click:   0,
  limit_reached:   0,
  waitlist_signup: 0,
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'
  )
}

// ─── POST — registrar evento ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { event: EventName; data?: Record<string, unknown> }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const validEvents: EventName[] = [
    'idea_generated', 'upgrade_click', 'limit_reached', 'waitlist_signup', 'page_view'
  ]

  if (!validEvents.includes(body.event)) {
    return NextResponse.json({ error: 'Evento inválido.' }, { status: 400 })
  }

  const event: TrackEvent = {
    event:     body.event,
    timestamp: Date.now(),
    ip:        getClientIP(req),
    data:      body.data,
  }

  // Adiciona ao array com limite de tamanho
  if (events.length >= MAX_EVENTS) events.shift()
  events.push(event)

  // Incrementa contador agregado
  if (counters[body.event] !== undefined) {
    counters[body.event]++
  }

  // Log estruturado — visível nos logs da Vercel
  console.log(JSON.stringify({
    type:      'TRACK',
    event:     event.event,
    timestamp: new Date(event.timestamp).toISOString(),
    data:      event.data ?? {},
  }))

  return NextResponse.json({ ok: true })
}

// ─── GET — dashboard simples de métricas ─────────────────────────────────────

export async function GET(req: NextRequest) {
  // Proteger com API key
  const key = req.headers.get('x-api-key')
  if (key !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const last24h = Date.now() - 24 * 60 * 60 * 1000
  const recent  = events.filter(e => e.timestamp > last24h)

  // Agrupa por evento nas últimas 24h
  const last24hCounts = recent.reduce<Record<string, number>>((acc, e) => {
    acc[e.event] = (acc[e.event] ?? 0) + 1
    return acc
  }, {})

  // Taxa de conversão: upgrade_clicks / limit_reached
  const conversionRate = counters.limit_reached > 0
    ? ((counters.upgrade_click / counters.limit_reached) * 100).toFixed(1) + '%'
    : 'N/A'

  return NextResponse.json({
    totals:         counters,
    last24h:        last24hCounts,
    conversionRate,
    totalEvents:    events.length,
    recentEvents:   events.slice(-20).reverse(), // últimos 20
  })
}
