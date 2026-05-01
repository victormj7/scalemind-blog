import Link from 'next/link'
import { getFeaturedPosts, getRecentPosts, getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { AdBanner } from '@/components/ui/AdBanner'
import { NewsletterForm } from '@/components/NewsletterForm'
import { HeroSection } from '@/components/HeroSection'

const CATEGORIES = [
  { name: 'MicroSaaS',    emoji: '🚀', desc: 'Crie produtos digitais escaláveis', color: 'hover:border-violet-300 hover:bg-violet-50' },
  { name: 'Automação',    emoji: '⚡', desc: 'Ganhe dinheiro no automático',       color: 'hover:border-sky-300 hover:bg-sky-50' },
  { name: 'Finanças',     emoji: '💰', desc: 'Multiplique seu dinheiro online',    color: 'hover:border-emerald-300 hover:bg-emerald-50' },
  { name: 'Renda Online', emoji: '🌐', desc: 'Trabalhe de qualquer lugar',         color: 'hover:border-amber-300 hover:bg-amber-50' },
]

const PLANS = [
  {
    name:    'Grátis',
    price:   'R$ 0',
    period:  'para sempre',
    color:   'border-gray-200',
    badge:   null,
    items: [
      { ok: true,  text: '3 ideias por dia' },
      { ok: true,  text: 'Nome e descrição da ideia' },
      { ok: true,  text: 'Problema e público-alvo' },
      { ok: false, text: 'Passo a passo de execução' },
      { ok: false, text: 'Estratégia de monetização' },
      { ok: false, text: 'Como validar em 7 dias' },
      { ok: false, text: 'Como usar IA na ideia' },
    ],
    cta:      'Começar grátis',
    ctaHref:  '/ferramentas/gerador-microsaas',
    ctaStyle: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  },
  {
    name:    'Premium',
    price:   'R$ 9,90',
    period:  '/mês',
    color:   'border-sky-400 ring-2 ring-sky-400',
    badge:   'Mais popular',
    items: [
      { ok: true, text: 'Ideias ilimitadas por dia' },
      { ok: true, text: 'Nome e descrição da ideia' },
      { ok: true, text: 'Problema e público-alvo' },
      { ok: true, text: 'Passo a passo de execução' },
      { ok: true, text: 'Estratégia de monetização' },
      { ok: true, text: 'Como validar em 7 dias' },
      { ok: true, text: 'Como usar IA na ideia' },
    ],
    cta:      '🚀 Assinar Premium',
    ctaHref:  '/upgrade',
    ctaStyle: 'bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-500 hover:to-violet-500 text-white shadow-lg hover:shadow-sky-200',
  },
]

export default function HomePage() {
  const featured = getFeaturedPosts()
  const recent   = getRecentPosts(6)
  const total    = getAllPosts().length

  return (
    <>
      {/* HERO com animação */}
      <HeroSection />

      {/* AdSense */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <AdBanner slot="top" />
      </div>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Simples assim</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Como o copiloto funciona em 3 passos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', icon: '🎯', title: 'Informe seu perfil', desc: 'Diga sua área, nível e objetivo. O copiloto usa isso para personalizar tudo.' },
            { step: '2', icon: '🤖', title: 'Copiloto gera o plano', desc: 'IA cria a ideia com modelo de negócio, receita estimada e passo a passo de execução.' },
            { step: '3', icon: '💰', title: 'Aprofunde e execute', desc: 'Pergunte ao copiloto sobre precificação, primeiro cliente, stack técnica e mais.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-violet-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-200">
                {icon}
              </div>
              <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Passo {step}</div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/ferramentas/gerador-microsaas"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-2xl transition-all hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-0.5 text-base">
            🤖 Iniciar com meu copiloto agora
          </Link>
        </div>
      </section>

      {/* POSTS EM DESTAQUE */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Mais lidos</span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Comece por aqui</h2>
              </div>
              <Link href="/blog" className="text-sm text-sky-600 hover:underline font-semibold">Ver todos →</Link>
            </div>
            <div className="flex flex-col gap-6">
              {featured.slice(0, 2).map((post) => (
                <PostCard key={post.slug} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PLANOS */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Preços</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Comece grátis, escale quando quiser</h2>
          <p className="text-gray-500 mt-3">Sem cartão de crédito para começar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-8 relative`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-extrabold text-gray-900 text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.items.map(({ ok, text }) => (
                  <li key={text} className={`flex items-center gap-2 text-sm ${ok ? 'text-gray-700' : 'text-gray-300 line-through'}`}>
                    <span className={ok ? 'text-emerald-500 font-bold' : 'text-gray-300'}>{ok ? '✓' : '✗'}</span>
                    {text}
                  </li>
                ))}
              </ul>
              <Link href={plan.ctaHref}
                className={`block w-full py-3.5 font-bold rounded-xl text-center transition-all hover:-translate-y-0.5 ${plan.ctaStyle}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Explore</span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">O que você quer aprender?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(({ name, emoji, desc, color }) => (
              <Link key={name} href={`/blog?categoria=${encodeURIComponent(name)}`}
                className={`group p-6 bg-white rounded-2xl border-2 border-gray-100 ${color} transition-all text-center shadow-sm hover:shadow-md hover:-translate-y-1`}>
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:text-sky-700 transition-colors">{name}</div>
                <div className="text-xs text-gray-500 leading-tight">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIGOS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Conteúdo</span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
              Artigos recentes
              <span className="ml-2 text-sm font-normal text-gray-400">({total} no total)</span>
            </h2>
          </div>
          <Link href="/blog" className="text-sm text-sky-600 hover:underline font-semibold">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full translate-y-24 -translate-x-24" />
          <div className="relative">
            <span className="inline-block text-4xl mb-4">📬</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Receba 1 ideia de negócio<br />por semana no seu e-mail
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg">
              Ideias validadas, automações e estratégias de renda online — direto na sua caixa de entrada.
            </p>
            <NewsletterForm />
            <p className="text-xs text-gray-500 mt-4">Sem spam. Cancele quando quiser. Grátis para sempre.</p>
          </div>
        </div>
      </section>
    </>
  )
}
