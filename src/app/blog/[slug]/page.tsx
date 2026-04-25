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
import { CtaBox } from '@/components/ui/CtaBox'

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
      <span className="text-sm font-semibold text-gray-500">Compartilhar:</span>
      {[
        { label: '𝕏 Twitter', href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`, color: 'hover:text-sky-500' },
        { label: 'LinkedIn',  href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, color: 'hover:text-blue-600' },
        { label: 'WhatsApp',  href: `https://wa.me/?text=${text}%20${url}`, color: 'hover:text-green-500' },
      ].map(({ label, href, color }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
          className={`text-sm font-semibold text-gray-500 ${color} transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100`}>
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
      <AdBanner slot="top" className="mb-10" />

      <div className="flex flex-col lg:flex-row gap-12">

        {/* Conteúdo principal */}
        <article className="flex-1 min-w-0">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-sky-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{p.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <CategoryBadge category={p.category} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 mb-5 leading-tight tracking-tight">
              {p.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">{p.description}</p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <time dateTime={p.date} className="font-medium">{formatDate(p.date)}</time>
              <span>·</span>
              <span className="bg-gray-100 px-2.5 py-1 rounded-full font-medium">{p.readingTime}</span>
            </div>
          </header>

          {/* Imagem de capa */}
          <div className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image src={p.image} alt={p.title} fill className="object-cover" priority />
          </div>

          {/* Conteúdo */}
          <MarkdownRenderer content={p.content} />

          {/* CTA meio do artigo */}
          <CtaBox
            title="Quer uma ideia pronta pra você?"
            subtitle="Use nosso gerador gratuito e receba uma ideia de negócio personalizada com potencial de receita real — em segundos."
            buttonText="🚀 Gerar minha ideia grátis"
          />

          {/* AdSense */}
          <AdBanner slot="mid-content" className="my-10" />

          {/* CTA final — dark */}
          <CtaBox
            variant="dark"
            title="Descubra sua ideia de negócio agora"
            subtitle="Mais de 847 empreendedores já geraram ideias aqui. Personalize para o seu nicho e veja o potencial de receita."
            buttonText="💰 Quero ver como ganhar dinheiro com isso"
          />

          {/* Compartilhamento */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <ShareButtons title={p.title} slug={p.slug} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-8">

          {/* CTA sticky */}
          <div className="bg-gradient-to-br from-sky-600 to-violet-600 rounded-2xl p-6 text-white text-center sticky top-24">
            <p className="text-2xl mb-2">🚀</p>
            <p className="font-extrabold text-lg mb-2">Gerador de ideias</p>
            <p className="text-xs text-sky-100 mb-5 leading-relaxed">
              Descubra uma ideia de negócio personalizada para o seu nicho — grátis.
            </p>
            <Link href="/ferramentas/gerador-microsaas"
              className="block w-full py-3 bg-white text-sky-700 font-bold rounded-xl text-sm hover:bg-sky-50 transition-all hover:shadow-md">
              Gerar ideia grátis →
            </Link>
            <p className="text-xs text-sky-200 mt-3">🔥 847 ideias já geradas</p>
          </div>

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
        </aside>
      </div>
    </div>
  )
}
