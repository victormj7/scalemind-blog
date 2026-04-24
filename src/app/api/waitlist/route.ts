import { NextRequest, NextResponse } from 'next/server'

// Store em memória com deduplicação por e-mail
// Para produção: substituir por Supabase
const waitlist = new Map<string, { email: string; timestamp: number; source: string }>()

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: { email: string; source?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const email  = String(body.email ?? '').trim().toLowerCase().slice(0, 200)
  const source = String(body.source ?? 'unknown').slice(0, 50)

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  const alreadyIn = waitlist.has(email)

  if (!alreadyIn) {
    waitlist.set(email, { email, timestamp: Date.now(), source })

    // Log estruturado — visível nos logs da Vercel e fácil de exportar
    console.log(JSON.stringify({
      type:      'WAITLIST',
      email,
      source,
      timestamp: new Date().toISOString(),
      total:     waitlist.size,
    }))
  }

  return NextResponse.json({
    ok:       true,
    new:      !alreadyIn,
    position: waitlist.size,
    message:  alreadyIn
      ? 'Você já está na lista!'
      : `Você é o #${waitlist.size} na lista de espera.`,
  })
}

// GET protegido — ver lista completa
export async function GET(req: NextRequest) {
  const key = req.headers.get('x-api-key')
  if (key !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const list = Array.from(waitlist.values())
    .sort((a, b) => a.timestamp - b.timestamp)

  return NextResponse.json({
    total: list.length,
    list:  list.map(({ email, source, timestamp }) => ({
      email,
      source,
      date: new Date(timestamp).toISOString(),
    })),
  })
}
