'use client'

import { useState } from 'react'

const PLANS = [
  {
    name:    'Starter',
    price:   'R$ 9,90',
    period:  '/mês',
    color:   'border-sky-400 ring-2 ring-sky-400',
    badge:   'Mais popular',
    cta:     '🚀 Assinar Starter',
    ctaStyle: 'bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-500 hover:to-violet-500 text-white',
    items: [
      '10 ideias por mês',
      'Histórico completo',
      'Checklist completo',
      'Copiloto de aprofundamento',
      'Sequência de emails de execução',
    ],
  },
  {
    name:    'Pro',
    price:   'R$ 19,90',
    period:  '/mês',
    color:   'border-violet-400',
    badge:   null,
    cta:     '💎 Assinar Pro',
    ctaStyle: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white',
    items: [
      'Ideias ilimitadas',
      'Histórico completo',
      'Checklist completo',
      'Validação avançada',
      'Templates prontos',
      'Copiloto de aprofundamento',
      'Sequência de emails de execução',
    ],
  },
]

export default function UpgradePage() {
  const [email,       setEmail]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter')

  async function handleCheckout() {
    if (!email.trim()) { setError('Informe seu e-mail para continuar.'); return }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, plan: selectedPlan }),
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
            🚀 Planos pagos
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Escolha o plano certo
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent"> para você</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Comece grátis com 1 ideia completa. Faça upgrade quando quiser mais.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Comparação grátis vs pagos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          {/* Grátis */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <p className="font-extrabold text-gray-900 text-lg mb-1">Grátis</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-extrabold text-gray-900">R$ 0</span>
              <span className="text-gray-400 text-sm">para sempre</span>
            </div>
            <ul className="space-y-2 mb-6">
              {['1 ideia completa', 'Salvar 1 ideia', 'Checklist básico'].map(t => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-emerald-500 font-bold">✓</span>{t}
                </li>
              ))}
              {['10 ideias/mês', 'Histórico completo', 'Validação avançada'].map(t => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-300 line-through">
                  <span className="text-gray-300">✗</span>{t}
                </li>
              ))}
            </ul>
            <a href="/ferramentas/gerador-microsaas"
              className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-center text-sm transition-colors">
              Usar grátis
            </a>
          </div>

          {/* Starter e Pro */}
          {PLANS.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-6 relative`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <p className="font-extrabold text-gray-900 text-lg mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.items.map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 font-bold">✓</span>{t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setSelectedPlan(plan.name.toLowerCase() as 'starter' | 'pro'); document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }) }}
                className={`block w-full py-3 font-bold rounded-xl text-center text-sm transition-all hover:-translate-y-0.5 ${plan.ctaStyle}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <div id="checkout" className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 max-w-md mx-auto">
          <h3 className="text-xl font-extrabold text-gray-900 text-center mb-2">
            Assinar {selectedPlan === 'starter' ? 'Starter — R$ 9,90/mês' : 'Pro — R$ 19,90/mês'}
          </h3>
          <p className="text-gray-400 text-sm text-center mb-6">Cancele quando quiser · Sem fidelidade</p>

          {/* Seletor de plano */}
          <div className="flex gap-2 mb-5">
            {(['starter', 'pro'] as const).map(p => (
              <button key={p} onClick={() => setSelectedPlan(p)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl border-2 transition-all capitalize ${
                  selectedPlan === p ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-500'
                }`}>
                {p === 'starter' ? 'Starter R$ 9,90' : 'Pro R$ 19,90'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Seu e-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 focus:outline-none text-gray-800 text-sm" />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>}
            <button onClick={handleCheckout} disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-500 hover:to-violet-500 disabled:opacity-60 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecionando...
                </span>
              ) : `🚀 Assinar ${selectedPlan === 'starter' ? 'Starter' : 'Pro'} agora`}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Pagamento seguro via Stripe · Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
