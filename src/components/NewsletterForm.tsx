'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/waitlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, source: 'newsletter_home' }),
      })
      const data = await res.json()
      if (res.ok) {
        setDone(true)
        fetch('/api/track', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ event: 'waitlist_signup', data: { source: 'newsletter_home' } }),
        }).catch(() => {})
      } else {
        setError(data.error ?? 'Erro ao cadastrar. Tente novamente.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🚀</div>
        <p className="text-white font-bold text-lg">Você entrou!</p>
        <p className="text-emerald-200 text-sm mt-1">
          Em breve vamos te enviar ideias exclusivas de MicroSaaS direto no seu e-mail.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
        className="flex-1 px-5 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
      />
      <button type="submit" disabled={loading}
        className="px-6 py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap text-base">
        {loading ? 'Enviando...' : 'Quero receber'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1 w-full">{error}</p>}
    </form>
  )
}
