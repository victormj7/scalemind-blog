import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { AdBanner } from '@/components/ui/AdBanner'
import { BlogClient } from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog — Todos os Artigos',
  description: 'Todos os artigos sobre MicroSaaS, automação, finanças digitais e renda online. Conteúdo gratuito e prático.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <AdBanner slot="top" className="mb-8" />

      {/* Header da página */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Todos os artigos
        </h1>
        <p className="text-gray-600 text-lg">
          <span className="font-bold text-sky-600">{posts.length} artigos</span> sobre MicroSaaS, automação, finanças e renda online.
          Tudo gratuito, tudo prático.
        </p>
      </div>

      <BlogClient posts={posts} />
    </div>
  )
}
