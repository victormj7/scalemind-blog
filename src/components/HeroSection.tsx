'use client'

import Link from 'next/link'

const TESTIMONIALS = [
  { name: 'Marcos S.', role: 'Freelancer', text: 'Validei uma ideia em 3 dias usando o ScaleMind. Já tenho 2 clientes pagando.' },
  { name: 'Ana P.',    role: 'Nutricionista', text: 'Nunca pensei que conseguiria criar um negócio digital. A ideia que recebi foi perfeita pro meu nicho.' },
  { name: 'Rafael T.', role: 'CLT + renda extra', text: 'Consegui meu primeiro cliente com uma ideia daqui. R$ 800 no primeiro mês.' },
]

const STATS = [
  { value: '847+',  label: 'Ideias geradas' },
  { value: '312',   label: 'Usuários ativos' },
  { value: 'R$0',   label: 'Para começar' },
  { value: '2min',  label: 'Para ter sua ideia' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-animated-bg">
      {/* Grid de pontos em camada separada — evita conflito de background */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      {/* Orbs de fundo — CSS puro, zero JS */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-white/20 backdrop-blur-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Plataforma para criar negócios com IA · 100% gratuito para começar
        </div>

        {/* Headline principal */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Use IA para encontrar uma{' '}
          <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 0 20px rgba(14,165,233,0.4))' }}>
            ideia de negócio
          </span>
          {' '}pronta pra ganhar dinheiro
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          Em menos de 2 minutos você recebe uma ideia personalizada com modelo de negócio,
          potencial de receita e como começar — mesmo sem saber programar.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/ferramentas/gerador-microsaas"
            className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-400 hover:to-violet-500 text-white font-extrabold rounded-2xl transition-all hover:shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-1 text-lg"
          >
            🚀 Gerar minha ideia de negócio agora
          </Link>
          <Link
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all hover:-translate-y-0.5 text-base backdrop-blur-sm"
          >
            Ver como funciona →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-14">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 p-3">
              <div className="text-xl font-extrabold text-white mb-0.5">{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {TESTIMONIALS.map(({ name, role, text }) => (
            <div key={name} className="bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 p-5 text-left">
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                {'★★★★★'}
              </div>
              <p className="text-white/75 text-sm leading-relaxed mb-4">"{text}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-gray-500 text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
