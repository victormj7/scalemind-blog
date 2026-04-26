import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostMeta, Category } from '@/types/post'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Sanitiza slug para evitar path traversal */
function sanitizeSlug(slug: string): string {
  return path.basename(slug).replace(/[^a-z0-9-]/gi, '')
}

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min de leitura`
}

function sanitizeDate(date: string): string {
  const today = new Date().toISOString().split('T')[0]
  return date > today ? today : date
}

function parsePost(filename: string): PostMeta {
  const slug = filename.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(POSTS_DIR, path.basename(filename)), 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title,
    description: data.description,
    date: sanitizeDate(String(data.date ?? new Date().toISOString().split('T')[0])),
    category: data.category as Category,
    image: data.image ?? '/images/default-cover.jpg',
    readingTime: estimateReadingTime(content),
    featured: data.featured ?? false,
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Retorna todos os posts ordenados por data (mais recente primeiro) */
export function getAllPosts(): PostMeta[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))

  return files
    .map(parsePost)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** Retorna um post completo com conteúdo (HTML bruto do markdown) */
export function getPostBySlug(slug: string): Post | null {
  const extensions = ['mdx', 'md']
  let raw: string | null = null

  const safeSlug = sanitizeSlug(slug)

  for (const ext of extensions) {
    const filepath = path.join(POSTS_DIR, `${safeSlug}.${ext}`)
    if (fs.existsSync(filepath)) {
      raw = fs.readFileSync(filepath, 'utf-8')
      break
    }
  }

  if (!raw) return null

  const { data, content } = matter(raw)

  return {
    slug: safeSlug,
    title: data.title,
    description: data.description,
    date: sanitizeDate(String(data.date ?? new Date().toISOString().split('T')[0])),
    category: data.category as Category,
    image: data.image ?? '/images/default-cover.jpg',
    readingTime: estimateReadingTime(content),
    featured: data.featured ?? false,
    content,
  }
}

/** Retorna posts de uma categoria específica */
export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}

/** Retorna todos os slugs — usado pelo generateStaticParams do Next.js */
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

/** Retorna posts em destaque */
export function getFeaturedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.featured)
}

/** Retorna posts recentes (últimos N) */
export function getRecentPosts(limit = 6): PostMeta[] {
  return getAllPosts().slice(0, limit)
}
