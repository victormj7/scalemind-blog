'use client'

import { useState } from 'react'
import { PostCard } from '@/components/ui/PostCard'
import type { PostMeta, Category } from '@/types/post'
import Link from 'next/link'

const CATEGORIES: Category[] = ['MicroSaaS', 'Automação', 'Finanças', 'Renda Online']

export function BlogClient({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState<Category | null>(null)

  const filtered = active ? posts.filter((p) => p.category === active) : posts

  return (
    <>
      {/* Filtro */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !active
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">Nenhum artigo nesta categoria ainda.</p>
          <button
            onClick={() => setActive(null)}
            className="mt-4 inline-block text-brand-600 dark:text-brand-400 hover:underline"
          >
            Ver todos os artigos
          </button>
        </div>
      )}
    </>
  )
}
