import Link from 'next/link'
import { getFeaturedPosts, getRecentPosts } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { AdBanner } from '@/components/ui/AdBanner'

const CATEGORIES = [
  { name: 'MicroSaaS',    emoji: '🚀', desc: 'Produtos digitais escaláveis' },
  { name: 'Automação',    emoji: '⚡', desc: 'No-code e IA trabalhando por você' },
  { name: 'Finanças',     emoji: '💰', desc: 'Dinheiro inteligente no digital' },
  { name: 'Renda Online', emoji: '🌐', desc: 'Ganhe de qualquer lugar do mundo' },
]

export default function HomePage() {
  const featured = getFeaturedPosts()
  const recent   = getRecentPosts(6)

  return (
    <>
      {/* AdSense Topo */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner slot="top" />
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span>✦</span> Conteúdo para quem quer escalar
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          Escale sua{' '}
          <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
            renda digital
          </span>
          <br />com estratégia e tecnologia
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Guias práticos sobre MicroSaaS, automação no-code, finanças digitais e renda online para quem quer construir liberdade financeira real.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/blog" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors">
            Ver todos os artigos
          </Link>
          <Link href="/sobre" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors">
            Sobre o blog
          </Link>
        </div>
      </section>

      {/* Posts em destaque */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ✦ Em destaque
          </h2>
          <div className="flex flex-col gap-6">
            {featured.slice(0, 2).map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* Categorias */}
      <section className="bg-gray-100 dark:bg-gray-900/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Explore por categoria
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(({ name, emoji, desc }) => (
              <Link
                key={name}
                href={`/blog?categoria=${encodeURIComponent(name)}`}
                className="group p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts recentes */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Artigos recentes</h2>
          <Link href="/blog" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-3">Receba conteúdo exclusivo</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">
            Toda semana, estratégias práticas de MicroSaaS, automação e renda online direto no seu e-mail.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              Quero receber
            </button>
          </form>
          <p className="text-xs text-brand-200 mt-4">Sem spam. Cancele quando quiser.</p>
        </div>
      </section>
    </>
  )
}
