import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatDate } from '@/lib/utils'
import type { PostMeta } from '@/types/post'

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${featured ? 'md:flex-row' : ''}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 h-56 md:h-auto' : 'h-52'}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        {/* Overlay sutil no hover */}
        <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/10 transition-colors duration-300" />
      </div>

      <div className={`flex flex-col gap-3 p-6 ${featured ? 'md:w-1/2 md:p-10 md:justify-center' : ''}`}>
        <CategoryBadge category={post.category} />

        <h2 className={`font-extrabold text-gray-900 group-hover:text-sky-600 transition-colors leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {post.title}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
            Ler →
          </span>
        </div>
      </div>
    </Link>
  )
}
