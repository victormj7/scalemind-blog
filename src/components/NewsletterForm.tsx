'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState<'new' | 'exists' | null>(null)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setDone(data.new ? 'new' : 'exists')
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
        <div className="text-4xl mb-3">{done === 'new' ? '🚀' : '✅'}</div>
        <p className="text-white font-bold text-lg">
          {done === 'new' ? 'Você entrou!' : 'Você já está cadastrado!'}
        </p>
        <p className="text-emerald-200 text-sm mt-2 leading-relaxed">
          {done === 'new'
            ? 'Confira seu email — já te enviamos uma ideia 🚀'
            : 'Fique de olho no seu email para os próximos posts.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
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
      </div>
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </form>
  )
}
