import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug, getRecentPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { AdBanner } from '@/components/ui/AdBanner'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { PostCard } from '@/components/ui/PostCard'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${slug}`

  return {
    title:       post.title,
    description: post.description,
    alternates:  { canonical: url },
    openGraph: {
      type:          'article',
      url,
      title:         post.title,
      description:   post.description,
      publishedTime: post.date,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.description,
      images:      [post.image],
    },
  }
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url  = encodeURIComponent(`${SITE_URL}/blog/${slug}`)
  const text = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-sm font-medium text-gray-500">Compartilhar:</span>
      {[
        { label: 'Twitter/X', href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`, color: 'hover:text-sky-500' },
        { label: 'LinkedIn',  href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, color: 'hover:text-blue-600' },
        { label: 'WhatsApp',  href: `https://wa.me/?text=${text}%20${url}`, color: 'hover:text-green-500' },
      ].map(({ label, href, color }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
          className={`text-sm font-medium text-gray-500 ${color} transition-colors`}>
          {label}
        </a>
      ))}
    </div>
  )
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const p = post!

  const related = getRecentPosts(4).filter((r) => r.slug !== p.slug).slice(0, 2)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <AdBanner slot="top" className="mb-8" />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Conteúdo principal */}
        <article className="flex-1 min-w-0">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-sky-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{p.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <CategoryBadge category={p.category} />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
              {p.title}
            </h1>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">{p.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <time dateTime={p.date}>{formatDate(p.date)}</time>
              <span>·</span>
              <span>{p.readingTime}</span>
            </div>
          </header>

          {/* Imagem de capa */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-sm">
            <Image src={p.image} alt={p.title} fill className="object-cover" priority />
          </div>

          {/* Conteúdo */}
          <MarkdownRenderer content={p.content} />

          {/* AdSense meio */}
          <AdBanner slot="mid-content" className="my-10" />

          {/* Compartilhamento */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <ShareButtons title={p.title} slug={p.slug} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-8">
          <AdBanner slot="sidebar" />

          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Leia também
              </h3>
              <div className="flex flex-col gap-4">
                {related.map((r) => (
                  <PostCard key={r.slug} post={r} />
                ))}
              </div>
            </div>
          )}

          {/* CTA Newsletter */}
          <div className="bg-gradient-to-br from-sky-600 to-violet-600 rounded-2xl p-6 text-white text-center">
            <p className="font-bold mb-2">📬 Newsletter semanal</p>
            <p className="text-xs text-sky-100 mb-4">Estratégias de renda online toda semana.</p>
            <Link href="/#newsletter"
              className="block w-full py-2 bg-white text-sky-700 font-bold rounded-xl text-sm hover:bg-sky-50 transition-colors">
              Quero receber
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
