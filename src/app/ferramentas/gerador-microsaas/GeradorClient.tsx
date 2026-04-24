'use client'

import { useState, useEffect, useRef } from 'react'
import type { MicroSaaSIdea } from '@/lib/ideas'

const NICHES = [
  { value: '',          label: '🎯 Qualquer nicho' },
  { value: 'marketing', label: '📣 Marketing Digital' },
  { value: 'saude',     label: '🏥 Saúde e Bem-estar' },
  { value: 'educacao',  label: '📚 Educação' },
  { value: 'financas',  label: '💰 Finanças' },
]

const LOADING_MESSAGES = [
  'Analisando oportunidades de mercado...',
  'Identificando problemas não resolvidos...',
  'Calculando potencial de receita...',
  'Validando modelo de negócio...',
  'Finalizando sua ideia...',
]

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'Baixo': { color: 'text-emerald-700', bg: 'bg-emerald-100', label: '🟢 Baixo' },
  'Médio': { color: 'text-amber-700',   bg: 'bg-amber-100',   label: '🟡 Médio' },
  'Alto':  { color: 'text-red-700',     bg: 'bg-red-100',     label: '🔴 Alto'  },
}

interface UsageState {
  used: number
  limit: number
  remaining: number
  hasAI?: boolean
}

interface IdeaResult {
  idea: MicroSaaSIdea
  usage: UsageState
  source: 'ai' | 'local'
}

export function GeradorClient() {
  const [niche,    setNiche]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [loadMsg,  setLoadMsg]  = useState(0)
  const [result,   setResult]   = useState<IdeaResult | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [usage,    setUsage]    = useState<UsageState>({ used: 0, limit: 3, remaining: 3 })
  const [history,  setHistory]  = useState<MicroSaaSIdea[]>([])
  const [animate,  setAnimate]  = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/generate-idea')
      .then(r => r.json())
      .then(data => setUsage(data))
      .catch(() => {})
  }, [])

  // Rotacionar mensagens de loading
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setLoadMsg(prev => (prev + 1) % LOADING_MESSAGES.length)
    }, 1400)
    return () => clearInterval(interval)
  }, [loading])

  async function handleGenerate() {
    if (usage.remaining <= 0 || loading) return
    setLoading(true)
    setError(null)
    setAnimate(false)
    setLoadMsg(0)

    try {
      const res  = await fetch('/api/generate-idea', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ niche }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setError('limit_reached')
        setUsage(prev => ({ ...prev, remaining: 0, used: prev.limit }))
        return
      }

      setResult(data)
      setUsage(data.usage)
      setHistory(prev => [data.idea, ...prev].slice(0, 5))

      // Scroll suave para o resultado + animação
      setTimeout(() => {
        setAnimate(true)
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)

    } catch {
      setError('Erro de conexão. Tente novamente.')
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Ideias gratuitas hoje</span>
            {usage.hasAI && (
              <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-full">
                ✨ IA ativa
              </span>
            )}
          </div>
          <span className={`text-sm font-bold tabular-nums ${limitReached ? 'text-red-600' : 'text-sky-600'}`}>
            {usage.used}/{usage.limit}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
              limitReached ? 'bg-red-500' :
              usage.used >= 2 ? 'bg-amber-500' : 'bg-sky-500'
            }`}
            style={{ width: `${(usage.used / usage.limit) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {limitReached
            ? '⚠️ Limite atingido — volte amanhã ou faça upgrade'
            : `${usage.remaining} ${usage.remaining === 1 ? 'ideia restante' : 'ideias restantes'} hoje`
          }
        </p>
      </div>

      {/* Formulário ou Upgrade */}
      {!limitReached ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nicho de interesse
              <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NICHES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setNiche(value)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                    niche === value
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold rounded-xl transition-all text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {loading ? (
              <span className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando com IA...
                </span>
                <span className="text-xs text-sky-200 font-normal animate-pulse">
                  {LOADING_MESSAGES[loadMsg]}
                </span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🚀 Gerar ideia de MicroSaaS
                {usage.remaining <= 1 && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    última hoje
                  </span>
                )}
              </span>
            )}
          </button>

          {error && error !== 'limit_reached' && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>
          )}
        </div>
      ) : (
        <UpgradeCard />
      )}

      {/* Resultado com animação */}
      {result && !loading && (
        <div
          ref={resultRef}
          className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <IdeaCard idea={result.idea} source={result.source} />
        </div>
      )}

      {/* Histórico */}
      {history.length > 1 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
            Geradas nesta sessão
          </h3>
          {history.slice(1).map((idea, i) => (
            <button
              key={i}
              onClick={() => {
                setResult({ idea, usage, source: 'local' })
                setAnimate(true)
                resultRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full bg-white rounded-xl border border-gray-100 p-4 hover:border-sky-200 hover:shadow-sm transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm group-hover:text-sky-600 transition-colors">
                  {idea.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_CONFIG[idea.difficulty]?.bg} ${DIFFICULTY_CONFIG[idea.difficulty]?.color}`}>
                  {idea.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{idea.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── IdeaCard ─────────────────────────────────────────────────────────────────

function IdeaCard({ idea, source }: { idea: MicroSaaSIdea; source: 'ai' | 'local' }) {
  const [copied, setCopied] = useState(false)
  const diff = DIFFICULTY_CONFIG[idea.difficulty] ?? DIFFICULTY_CONFIG['Médio']

  function copyIdea() {
    const text = [
      `🚀 ${idea.name}`,
      ``,
      `📝 ${idea.description}`,
      ``,
      `❌ Problema: ${idea.problem}`,
      `👥 Público: ${idea.audience}`,
      `💰 Monetização: ${idea.monetization}`,
      `📈 Potencial: ${idea.mrpPotential}`,
      `🔧 Ferramentas: ${idea.tools.join(', ')}`,
      ``,
      `Gerado em scalemind-blog.vercel.app`,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-violet-700 p-6 text-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sky-300 text-xs font-bold uppercase tracking-widest">
                Ideia gerada
              </span>
              {source === 'ai' && (
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  ✨ IA
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold leading-tight">{idea.name}</h2>
          </div>
          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white`}>
            {diff.label}
          </span>
        </div>
        <p className="text-sky-100 leading-relaxed text-sm">{idea.description}</p>
      </div>

      {/* Detalhes */}
      <div className="divide-y divide-gray-50">
        {[
          { icon: '🎯', label: 'Problema que resolve', value: idea.problem,      bg: 'bg-red-50' },
          { icon: '👥', label: 'Público-alvo',         value: idea.audience,     bg: 'bg-blue-50' },
          { icon: '💰', label: 'Como monetizar',       value: idea.monetization, bg: 'bg-emerald-50' },
          { icon: '📈', label: 'Potencial de receita', value: idea.mrpPotential, bg: 'bg-amber-50' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className={`flex gap-4 p-4 ${bg}`}>
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-gray-800 text-sm leading-relaxed font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ferramentas */}
      <div className="p-5 bg-gray-50">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          🔧 Ferramentas para construir
        </p>
        <div className="flex flex-wrap gap-2">
          {idea.tools.map(tool => (
            <span key={tool}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="p-4 flex gap-3 border-t border-gray-100">
        <button onClick={copyIdea}
          className={`flex-1 py-3 font-semibold rounded-xl text-sm transition-all ${
            copied
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}>
          {copied ? '✅ Copiado!' : '📋 Copiar ideia'}
        </button>
        <a href="/blog?categoria=MicroSaaS"
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition-colors text-center">
          📚 Como executar →
        </a>
      </div>
    </div>
  )
}

// ─── UpgradeCard ──────────────────────────────────────────────────────────────

function UpgradeCard() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Aqui você conecta com Mailchimp, Brevo ou Supabase
    setSent(true)
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">⚡</div>
        <h3 className="text-2xl font-extrabold mb-2">Você está no limite!</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Suas 3 ideias gratuitas de hoje foram usadas.
          Volte amanhã ou entre na lista de espera do Premium.
        </p>
      </div>

      {/* Benefícios */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 space-y-2.5">
        <p className="text-sky-400 font-bold text-sm mb-3">✨ Premium — Em breve</p>
        {[
          ['🚀', 'Ideias ilimitadas por dia'],
          ['🤖', 'Geração 100% com IA (GPT-4)'],
          ['🎯', 'Análise de concorrência por nicho'],
          ['📊', 'Estimativa de mercado detalhada'],
          ['💾', 'Salvar e organizar suas ideias'],
          ['⚡', 'Acesso antecipado a novas features'],
        ].map(([icon, text]) => (
          <div key={text} className="flex items-center gap-2.5 text-sm text-gray-200">
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Lista de espera */}
      {!sent ? (
        <form onSubmit={handleWaitlist} className="space-y-3">
          <p className="text-sm text-gray-300 text-center font-medium">
            Entre na lista de espera e seja notificado primeiro:
          </p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <button type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 text-sm">
            🚀 Quero acesso Premium
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-emerald-400">Você está na lista!</p>
          <p className="text-gray-400 text-sm mt-1">
            Avisaremos quando o Premium estiver disponível.
          </p>
        </div>
      )}

      <p className="text-gray-600 text-xs text-center mt-4">
        Ou volte amanhã para mais 3 ideias gratuitas
      </p>
    </div>
  )
}
