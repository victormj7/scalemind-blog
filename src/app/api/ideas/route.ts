import { NextRequest, NextResponse } from 'next/server'
import { saveIdea, listIdeas, deleteIdea } from '@/lib/db'

function getEmail(req: NextRequest): string | null {
  const email = req.headers.get('x-user-email')?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

// POST /api/ideas — salvar ideia
export async function POST(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })

  let body: { profile: unknown; idea: unknown }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const id = await saveIdea(email, body.profile as never, body.idea as never)
  if (!id) return NextResponse.json({ error: 'Erro ao salvar. Tente novamente.' }, { status: 500 })

  return NextResponse.json({ ok: true, id })
}

// GET /api/ideas?email=... — listar ideias
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase() ?? ''
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ideas: [] })
  }

  const ideas = await listIdeas(email)
  return NextResponse.json({ ideas })
}

// DELETE /api/ideas?id=... — deletar ideia
export async function DELETE(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })

  const id = req.nextUrl.searchParams.get('id') ?? ''
  if (!id) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })

  const ok = await deleteIdea(email, id)
  return NextResponse.json({ ok })
}
