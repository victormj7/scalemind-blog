'use client'

import { useState } from 'react'

const BENEFITS = [
  { icon: '🚀', title: 'Ideias ilimitadas por dia',       desc: 'Gere quantas ideias quiser, sem limite diário.' },
  { icon: '🤖', title: 'Geração 100% com IA',             desc: 'Cada ideia é única, gerada pelo GPT-4o-mini.' },
  { icon: '📋', title: 'Passo a passo de execução',       desc: 'Saiba exatamente como sair do zero ao primeiro cliente.' },
  { icon: '🧪', title: 'Como validar em 7 dias',          desc: 'Método prático para testar antes de investir.' },
  { icon: '💰', title: 'Estratégia de monetização',       desc: 'Modelos de preço e como cobrar pelo seu produto.' },
  { icon: '⚡', title: 'Como automatizar com IA',         desc: 'Use IA e no-code para escalar sem contratar.' },
  { icon: '🧩', title: 'Versão sem código + versão dev',  desc: 'Guia para iniciantes e para quem sabe programar.' },
]

export default function UpgradePage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleCheckout() {
    if (!email.trim()) { setError('Informe seu e-mail para continuar.'); return }
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.url) {
        localStorage.setItem('scalemind_email', email)
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Erro ao iniciar pagamento. Tente novamente.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-sky-950 to-violet-950 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-emerald-500/30">
            💎 Plano Premium
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Desbloqueie ideias ilimitadas
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent"> de MicroSaaS</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Pare de ver apenas o começo. Acesse o plano completo com passo a passo,
            validação e estratégia de monetização para cada ideia.
          </p>
          <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-8 py-6">
            <p className="text-gray-400 text-sm mb-1">Apenas</p>
            <p className="text-5xl font-extrabold text-white">R$ 47</p>
            <p className="text-gray-400 text-sm mt-1">por mês · cancele quando quiser</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Benefícios */}
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
          O que você recebe no Premium
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {BENEFITS.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparação */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <p className="font-bold text-gray-500 mb-4 text-center">🆓 Gratuito</p>
            {['3 ideias por dia', 'Nome e descrição', 'Problema e público', '— Passo a passo', '— Monetização', '— Validação', '— IA e automação'].map(i => (
              <p key={i} className={`text-sm py-1.5 border-b border-gray-100 last:border-0 ${i.startsWith('—') ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                {i.replace('— ', '')}
              </p>
            ))}
          </div>
          <div className="bg-gradient-to-b from-sky-50 to-emerald-50 rounded-2xl border-2 border-sky-200 p-6">
            <p className="font-bold text-sky-700 mb-4 text-center">💎 Premium</p>
            {['Ideias ilimitadas', 'Nome e descrição', 'Problema e público', '✅ Passo a passo', '✅ Monetização', '✅ Validação', '✅ IA e automação'].map(i => (
              <p key={i} className={`text-sm py-1.5 border-b border-sky-100 last:border-0 ${i.startsWith('✅') ? 'text-emerald-700 font-semibold' : 'text-gray-600'}`}>
                {i}
              </p>
            ))}
          </div>
        </div>

        {/* Checkout */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h3 className="text-xl font-extrabold text-gray-900 text-center mb-6">
            Começar agora por R$ 47/mês
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Seu e-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 focus:outline-none text-gray-800 text-sm" />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>}
            <button onClick={handleCheckout} disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 disabled:opacity-60 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecionando...
                </span>
              ) : '🚀 Assinar agora — R$ 47/mês'}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Pagamento seguro via Stripe · Cancele quando quiser · Sem fidelidade
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
