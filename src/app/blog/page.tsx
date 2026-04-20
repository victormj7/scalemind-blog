import type { Metadata } from 'next'
import { getAllPosts, getPostsByCategory } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { AdBanner } from '@/components/ui/AdBanner'
import type { Category } from '@/types/post'
import Link from 'next/link'

const CATEGORIES: Category[] = ['MicroSaaS', 'Automação', 'Finanças', 'Renda Online']

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Todos os artigos sobre MicroSaaS, automação, finanças digitais e renda online.',
}

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria } = await searchParams
  const activeCategory = categoria as Category | undefined
  const posts = activeCategory ? getPostsByCategory(activeCategory) : getAllPosts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* AdSense Topo */}
      <AdBanner slot="top" className="mb-8" />

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}{activeCategory ? ` em ${activeCategory}` : ''}
      </p>

      {/* Filtro de categorias */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/blog"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Todos
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/blog?categoria=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Grid de posts */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">Nenhum artigo nesta categoria ainda.</p>
          <Link href="/blog" className="mt-4 inline-block text-brand-600 dark:text-brand-400 hover:underline">
            Ver todos os artigos
          </Link>
        </div>
      )}
    </div>
  )
}
