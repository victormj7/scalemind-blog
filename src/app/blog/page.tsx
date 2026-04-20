import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { AdBanner } from '@/components/ui/AdBanner'
import { BlogClient } from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Todos os artigos sobre MicroSaaS, automação, finanças digitais e renda online.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <AdBanner slot="top" className="mb-8" />
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {posts.length} artigos sobre MicroSaaS, automação, finanças e renda online
      </p>
      <BlogClient posts={posts} />
    </div>
  )
}
