import { NextRequest, NextResponse } from 'next/server'
import { validatePostPayload, ValidationError, safeCompare } from '@/lib/validation'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface PostPayload {
  title: string
  description?: string
  content: string
  category?: string
  image?: string
  featured?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')                        // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, '')         // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')           // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-')                    // espaços viram hífens
    .replace(/-+/g, '-')                     // múltiplos hífens viram um
    .slice(0, 80)                            // máximo 80 caracteres
}

function generateDate(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

function buildMdxContent(payload: PostPayload, slug: string): string {
  const date     = generateDate()
  const category = payload.category ?? 'Renda Online'
  const image    = payload.image    ?? 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80'
  const featured = payload.featured ?? false
  const desc     = payload.description ?? payload.title

  return `---
title: "${payload.title.replace(/"/g, "'")}"
description: "${desc.replace(/"/g, "'")}"
date: "${date}"
category: "${category}"
image: "${image}"
featured: ${featured}
---

${payload.content.trim()}
`
}

async function slugExistsOnGitHub(
  slug: string,
  owner: string,
  repo: string,
  token: string
): Promise<boolean> {
  const path = `content/posts/${slug}.mdx`
  const url  = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })

  return res.status === 200
}

async function commitFileToGitHub(
  slug: string,
  mdxContent: string,
  title: string,
  owner: string,
  repo: string,
  token: string
): Promise<{ url: string }> {
  const path    = `content/posts/${slug}.mdx`
  const apiUrl  = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const encoded = Buffer.from(mdxContent, 'utf-8').toString('base64')

  const body = {
    message: `feat: novo post "${title}"`,
    content: encoded,
    branch:  'main',
  }

  const res = await fetch(apiUrl, {
    method:  'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GitHub API error ${res.status}: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  return { url: data.content?.html_url ?? `https://github.com/${owner}/${repo}/blob/main/${path}` }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {

  // 1. Autenticação via API Key
  const apiKey     = process.env.API_KEY
  const headerKey  = req.headers.get('x-api-key')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API_KEY não configurada no servidor.' },
      { status: 500 }
    )
  }

  if (!safeCompare(headerKey ?? '', apiKey)) {
    return NextResponse.json(
      { error: 'Não autorizado.' },
      { status: 401 }
    )
  }

  // 2. Variáveis do GitHub
  const githubToken = process.env.GITHUB_TOKEN
  const githubOwner = process.env.GITHUB_OWNER
  const githubRepo  = process.env.GITHUB_REPO

  if (!githubToken || !githubOwner || !githubRepo) {
    return NextResponse.json(
      { error: 'Variáveis GITHUB_TOKEN, GITHUB_OWNER ou GITHUB_REPO não configuradas.' },
      { status: 500 }
    )
  }

  // 3. Parse e validação do body
  let payload: ReturnType<typeof validatePostPayload>
  try {
    const body = await req.json()
    payload = validatePostPayload(body)
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: err.message, field: err.field },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Body inválido. Envie um JSON válido.' },
      { status: 400 }
    )
  }

  // 4. Gerar slug
  const slug = generateSlug(payload.title)

  if (!slug) {
    return NextResponse.json(
      { error: 'Não foi possível gerar um slug válido a partir do título.' },
      { status: 400 }
    )
  }

  // 6. Verificar se slug já existe no GitHub
  const exists = await slugExistsOnGitHub(slug, githubOwner, githubRepo, githubToken)

  if (exists) {
    return NextResponse.json(
      { error: `Já existe um post com o slug "${slug}". Use um título diferente.` },
      { status: 409 }
    )
  }

  // 7. Construir conteúdo MDX
  const mdxContent = buildMdxContent(payload, slug)

  // 8. Commit no GitHub
  try {
    const { url } = await commitFileToGitHub(
      slug,
      mdxContent,
      payload.title,
      githubOwner,
      githubRepo,
      githubToken
    )

    return NextResponse.json({
      success: true,
      slug,
      url,
      message: `Post "${payload.title}" criado com sucesso. A Vercel vai publicar em ~2 minutos.`,
    }, { status: 201 })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: `Falha ao commitar no GitHub: ${message}` },
      { status: 500 }
    )
  }
}

// GET — lista os slugs existentes (útil para debug)
export async function GET(req: NextRequest) {
  const apiKey    = process.env.API_KEY
  const headerKey = req.headers.get('x-api-key')

  if (!safeCompare(headerKey ?? '', apiKey ?? '')) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const owner = process.env.GITHUB_OWNER
  const repo  = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) {
    return NextResponse.json({ error: 'Variáveis GitHub não configuradas.' }, { status: 500 })
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/content/posts`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Erro ao listar posts do GitHub.' }, { status: 500 })
  }

  const files = await res.json()
  const slugs = files
    .filter((f: { name: string }) => f.name.endsWith('.mdx'))
    .map((f: { name: string }) => f.name.replace('.mdx', ''))

  return NextResponse.json({ total: slugs.length, slugs })
}
