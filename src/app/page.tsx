import Link from 'next/link'
import { getFeaturedPosts, getRecentPosts, getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { AdBanner } from '@/components/ui/AdBanner'

const CATEGORIES = [
  { name: 'MicroSaaS',    emoji: '🚀', desc: 'Crie produtos digitais escaláveis', color: 'hover:border-violet-300 hover:bg-violet-50' },
  { name: 'Automação',    emoji: '⚡', desc: 'Ganhe dinheiro no automático',       color: 'hover:border-sky-300 hover:bg-sky-50' },
  { name: 'Finanças',     emoji: '💰', desc: 'Multiplique seu dinheiro online',    color: 'hover:border-emerald-300 hover:bg-emerald-50' },
  { name: 'Renda Online', emoji: '🌐', desc: 'Trabalhe de qualquer lugar',         color: 'hover:border-amber-300 hover:bg-amber-50' },
]

const STATS = [
  { value: '12+',    label: 'Artigos publicados' },
  { value: '100%',   label: 'Conteúdo gratuito' },
  { value: 'No-code', label: 'Sem precisar programar' },
  { value: '0→∞',    label: 'Do zero ao escalável' },
]

export default function HomePage() {
  const featured = getFeaturedPosts()
  const recent   = getRecentPosts(6)
  const total    = getAllPosts().length

  return (
    <>
      {/* AdSense topo */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner slot="top" />
      </div>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-sky-100">
          <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
          Novo artigo toda semana — totalmente gratuito
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
          Aprenda a ganhar dinheiro com{' '}
          <span className="bg-gradient-to-r from-sky-500 to-violet-600 bg-clip-text text-transparent">
            IA e automação
          </span>
          <br />mesmo começando do zero
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Guias práticos e diretos sobre MicroSaaS, automação no-code e renda online.
          Sem enrolação, sem promessas falsas — só o que realmente funciona.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/blog"
            className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-base">
            📚 Ver todos os artigos
          </Link>
          <Link href="/ferramentas/gerador-microsaas"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl border-2 border-gray-200 hover:border-sky-300 transition-all text-base">
            🚀 Gerar ideia de MicroSaaS
          </Link>
        </div>

        {/* Stats de credibilidade */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="text-2xl font-extrabold text-sky-600 mb-1">{value}</div>
              <div className="text-xs text-gray-500 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POSTS EM DESTAQUE ── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Mais lidos</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Comece por aqui</h2>
            </div>
            <Link href="/blog" className="text-sm text-sky-600 hover:underline font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {featured.slice(0, 2).map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── BANNER MICROSAAS ── */}
      <section className="bg-gradient-to-r from-violet-600 to-sky-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <p className="text-sm font-semibold text-violet-200 uppercase tracking-widest mb-3">Em breve</p>
          <h2 className="text-3xl font-extrabold mb-4">
            Ferramenta gratuita de ideias de MicroSaaS
          </h2>
          <p className="text-violet-100 mb-8 max-w-xl mx-auto text-lg">
            Gere ideias validadas de MicroSaaS para o seu nicho em segundos, usando IA.
          </p>
          <Link href="/ferramentas/gerador-microsaas"
            className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 transition-colors text-base shadow-lg">
            🚀 Gerar minha ideia agora →
          </Link>
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Explore</span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-1">O que você quer aprender?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(({ name, emoji, desc, color }) => (
            <Link key={name} href={`/blog?categoria=${encodeURIComponent(name)}`}
              className={`group p-6 bg-white rounded-2xl border-2 border-gray-100 ${color} transition-all text-center shadow-sm hover:shadow-md hover:-translate-y-1`}>
              <div className="text-4xl mb-3">{emoji}</div>
              <div className="font-bold text-gray-900 text-sm mb-1 group-hover:text-sky-700 transition-colors">
                {name}
              </div>
              <div className="text-xs text-gray-500 leading-tight">{desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ARTIGOS RECENTES ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Conteúdo</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                Artigos recentes
                <span className="ml-2 text-sm font-normal text-gray-400">({total} no total)</span>
              </h2>
            </div>
            <Link href="/blog" className="text-sm text-sky-600 hover:underline font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full translate-y-24 -translate-x-24" />

          <div className="relative">
            <span className="inline-block text-4xl mb-4">📬</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Receba as melhores estratégias
              <br />direto no seu e-mail
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg">
              Toda semana: MicroSaaS, automação e renda online.
              Conteúdo que você aplica no mesmo dia.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                className="flex-1 px-5 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
              />
              <button type="submit"
                className="px-6 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-colors whitespace-nowrap text-base">
                Quero receber
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Sem spam. Cancele quando quiser. Grátis para sempre.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
