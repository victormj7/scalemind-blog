'use client'

import Link from 'next/link'

const TESTIMONIALS = [
  { name: 'Marcos S.', role: 'Freelancer', text: 'Validei uma ideia em 3 dias usando o ScaleMind. Já tenho 2 clientes pagando.' },
  { name: 'Ana P.',    role: 'Nutricionista', text: 'Nunca pensei que conseguiria criar um negócio digital. A ideia que recebi foi perfeita pro meu nicho.' },
  { name: 'Rafael T.', role: 'CLT + renda extra', text: 'Consegui meu primeiro cliente com uma ideia daqui. R$ 800 no primeiro mês.' },
]

const STATS = [
  { value: 'R$0',   label: 'Para começar' },
  { value: '2min',  label: 'Para ter sua ideia' },
]


const COPILOT_STEPS = [
  { icon: '💡', label: 'Gera a ideia',       desc: 'Personalizada pro seu perfil' },
  { icon: '🗺️', label: 'Mostra o caminho',   desc: 'Passo a passo de execução' },
  { icon: '🧪', label: 'Ensina a validar',   desc: 'Sem gastar dinheiro' },
  { icon: '🤖', label: 'Usa IA com você',    desc: 'Automação desde o início' },
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
          Copiloto de negócios com IA · 100% gratuito para começar
        </div>

        {/* Headline principal */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Seu{' '}
          <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 0 20px rgba(14,165,233,0.4))' }}>
            copiloto com IA
          </span>
          {' '}para criar e executar negócios
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          Não só gera a ideia — mostra o caminho completo para executar, validar e ganhar dinheiro.
          Mesmo sem saber programar.
        </p>

        {/* O que o copiloto faz */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
          {COPILOT_STEPS.map(({ icon, label, desc }) => (
            <div key={label} className="bg-white/8 backdrop-blur-sm rounded-xl border border-white/15 p-3 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-white text-xs font-bold">{label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/ferramentas/gerador-microsaas"
            className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-400 hover:to-violet-500 text-white font-extrabold rounded-2xl transition-all hover:shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-1 text-lg"
          >
            🚀 Iniciar com meu copiloto agora
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
