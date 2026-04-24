'use client'

import { useState, useEffect } from 'react'
import type { MicroSaaSIdea } from '@/lib/ideas'

const NICHES = [
  { value: '',          label: '🎯 Qualquer nicho' },
  { value: 'marketing', label: '📣 Marketing Digital' },
  { value: 'saude',     label: '🏥 Saúde e Bem-estar' },
  { value: 'educacao',  label: '📚 Educação' },
  { value: 'financas',  label: '💰 Finanças' },
]

const DIFFICULTY_COLOR: Record<string, string> = {
  'Baixo': 'bg-emerald-100 text-emerald-700',
  'Médio': 'bg-amber-100 text-amber-700',
  'Alto':  'bg-red-100 text-red-700',
}

interface UsageState {
  used: number
  limit: number
  remaining: number
}

interface IdeaResult {
  idea: MicroSaaSIdea
  usage: UsageState
}

export function GeradorClient() {
  const [niche,   setNiche]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<IdeaResult | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [usage,   setUsage]   = useState<UsageState>({ used: 0, limit: 3, remaining: 3 })
  const [history, setHistory] = useState<MicroSaaSIdea[]>([])

  // Buscar uso atual ao carregar
  useEffect(() => {
    fetch('/api/generate-idea')
      .then(r => r.json())
      .then(data => setUsage(data))
      .catch(() => {})
  }, [])

  async function handleGenerate() {
    if (usage.remaining <= 0) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-idea', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ niche }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setError('limit_reached')
        setUsage({ used: data.limit, limit: data.limit, remaining: 0 })
        return
      }

      setResult(data)
      setUsage(data.usage)
      setHistory(prev => [data.idea, ...prev].slice(0, 5))
    } catch {
      setError('Erro ao gerar ideia. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const limitReached = usage.remaining <= 0

  return (
    <div className="space-y-6">

      {/* Contador de uso */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Ideias gratuitas hoje</span>
          <span className={`text-sm font-bold ${limitReached ? 'text-red-600' : 'text-sky-600'}`}>
            {usage.used}/{usage.limit} usadas
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${limitReached ? 'bg-red-500' : 'bg-sky-500'}`}
            style={{ width: `${(usage.used / usage.limit) * 100}%` }}
          />
        </div>
        {!limitReached && (
          <p className="text-xs text-gray-400 mt-2">
            {usage.remaining} {usage.remaining === 1 ? 'ideia restante' : 'ideias restantes'} hoje
          </p>
        )}
      </div>

      {/* Formulário */}
      {!limitReached ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nicho de interesse (opcional)
            </label>
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-sm"
            >
              {NICHES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold rounded-xl transition-all text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando ideia...
              </span>
            ) : (
              '🚀 Gerar ideia de MicroSaaS'
            )}
          </button>

          {error && error !== 'limit_reached' && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>
      ) : (
        <UpgradeCard />
      )}

      {/* Resultado */}
      {result && !loading && (
        <IdeaCard idea={result.idea} />
      )}

      {/* Histórico */}
      {history.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Ideias anteriores desta sessão
          </h3>
          {history.slice(1).map((idea, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">{idea.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[idea.difficulty]}`}>
                  {idea.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{idea.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function IdeaCard({ idea }: { idea: MicroSaaSIdea }) {
  const [copied, setCopied] = useState(false)

  function copyIdea() {
    const text = `
🚀 ${idea.name}

📝 ${idea.description}

❌ Problema: ${idea.problem}
👥 Público: ${idea.audience}
💰 Monetização: ${idea.monetization}
📈 Potencial: ${idea.mrpPotential}
🔧 Ferramentas: ${idea.tools.join(', ')}
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-lg overflow-hidden">
      {/* Header da ideia */}
      <div className="bg-gradient-to-r from-sky-600 to-violet-600 p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">Nova ideia gerada</p>
            <h2 className="text-2xl font-extrabold">{idea.name}</h2>
          </div>
          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${
            idea.difficulty === 'Baixo' ? 'bg-emerald-400/20 text-emerald-200' :
            idea.difficulty === 'Médio' ? 'bg-amber-400/20 text-amber-200' :
            'bg-red-400/20 text-red-200'
          }`}>
            Dificuldade: {idea.difficulty}
          </span>
        </div>
        <p className="text-sky-100 mt-3 leading-relaxed">{idea.description}</p>
      </div>

      {/* Detalhes */}
      <div className="p-6 space-y-4">
        {[
          { icon: '❌', label: 'Problema que resolve', value: idea.problem },
          { icon: '👥', label: 'Público-alvo',         value: idea.audience },
          { icon: '💰', label: 'Como monetizar',       value: idea.monetization },
          { icon: '📈', label: 'Potencial de receita', value: idea.mrpPotential },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex gap-3">
            <span className="text-xl shrink-0 mt-0.5">{icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
            </div>
          </div>
        ))}

        {/* Ferramentas */}
        <div className="flex gap-3">
          <span className="text-xl shrink-0 mt-0.5">🔧</span>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ferramentas sugeridas</p>
            <div className="flex flex-wrap gap-2">
              {idea.tools.map(tool => (
                <span key={tool} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="border-t border-gray-100 p-4 flex gap-3">
        <button onClick={copyIdea}
          className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
          {copied ? '✅ Copiado!' : '📋 Copiar ideia'}
        </button>
        <a href="/blog?categoria=MicroSaaS"
          className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition-colors text-center">
          📚 Aprender mais
        </a>
      </div>
    </div>
  )
}

function UpgradeCard() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center shadow-xl">
      <div className="text-5xl mb-4">🔒</div>
      <h3 className="text-2xl font-extrabold mb-3">
        Limite diário atingido
      </h3>
      <p className="text-gray-300 mb-6 max-w-sm mx-auto">
        Você usou suas 3 ideias gratuitas de hoje.
        Volte amanhã ou desbloqueie ideias ilimitadas agora.
      </p>

      <div className="bg-white/10 rounded-xl p-5 mb-6 text-left space-y-2">
        <p className="font-bold text-sky-300 text-sm mb-3">✨ Com o plano Premium você tem:</p>
        {[
          'Ideias ilimitadas por dia',
          'Ideias mais avançadas e estratégicas',
          'Análise de concorrência por nicho',
          'Sugestões de validação rápida',
          'Acesso antecipado a novas funcionalidades',
        ].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-200">
            <span className="text-emerald-400">✓</span> {item}
          </div>
        ))}
      </div>

      <button
        onClick={() => alert('Em breve! Cadastre seu e-mail para ser notificado quando o Premium estiver disponível.')}
        className="w-full py-4 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 text-white font-extrabold rounded-xl text-base transition-all shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5"
      >
        🚀 Fazer upgrade — Em breve
      </button>

      <p className="text-gray-500 text-xs mt-4">
        Ou volte amanhã para mais 3 ideias gratuitas
      </p>
    </div>
  )
}
