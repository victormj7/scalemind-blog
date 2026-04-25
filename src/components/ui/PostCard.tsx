import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatDate } from '@/lib/utils'
import type { PostMeta } from '@/types/post'

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200
        hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-1.5
        transition-all duration-300 ${featured ? 'md:flex-row' : ''}`}
    >
      {/* Imagem */}
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 h-60 md:h-auto' : 'h-52'}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Badge de leitura */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {post.readingTime}
        </div>
      </div>

      {/* Conteúdo */}
      <div className={`flex flex-col gap-3 p-6 ${featured ? 'md:w-1/2 md:p-10 md:justify-center' : ''}`}>
        <CategoryBadge category={post.category} />

        <h2 className={`font-extrabold text-gray-900 group-hover:text-sky-600 transition-colors leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {post.title}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <time dateTime={post.date} className="text-xs text-gray-400 font-medium">
            {formatDate(post.date)}
          </time>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-all duration-200">
            Ler artigo →
          </span>
        </div>
      </div>
    </Link>
  )
}
