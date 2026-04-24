'use client'

import { useState, useEffect, useRef } from 'react'
import type { GenerateResponse, IdeaPreview, IdeaFull, UserProfile } from '@/types/generator'

// ─── Configurações do formulário ─────────────────────────────────────────────

const LEVELS = [
  { value: 'iniciante',     label: '🌱 Iniciante',     desc: 'Sem conhecimento técnico' },
  { value: 'intermediario', label: '⚡ Intermediário',  desc: 'Algum conhecimento digital' },
  { value: 'avancado',      label: '🚀 Avançado',       desc: 'Sei programar ou tenho experiência' },
]

const OBJECTIVES = [
  { value: 'renda-extra',   label: '💰 Renda extra',       desc: 'R$ 1k a R$ 5k/mês a mais' },
  { value: 'criar-negocio', label: '🏢 Criar negócio',     desc: 'Produto digital escalável' },
  { value: 'escalar',       label: '📈 Escalar',           desc: 'Crescer algo que já existe' },
]

const TIMES = [
  { value: 'pouco', label: '⏱ Pouco tempo',    desc: 'Até 1h por dia' },
  { value: 'medio', label: '🕐 Tempo moderado', desc: '1 a 3h por dia' },
  { value: 'total', label: '🔥 Dedicação total', desc: 'Foco total no projeto' },
]

const LOADING_MSGS = [
  'Analisando seu perfil...',
  'Identificando oportunidades...',
  'Calculando potencial de receita...',
  'Personalizando para você...',
  'Finalizando sua ideia...',
]

const DIFFICULTY_STYLE: Record<string, string> = {
  'Baixo': 'bg-emerald-100 text-emerald-700',
  'Médio': 'bg-amber-100 text-amber-700',
  'Alto':  'bg-red-100 text-red-700',
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function GeradorClient() {
  const [step,     setStep]     = useState<'form' | 'result'>('form')
  const [loading,  setLoading]  = useState(false)
  const [loadMsg,  setLoadMsg]  = useState(0)
  const [result,   setResult]   = useState<GenerateResponse | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [usage,    setUsage]    = useState({ used: 0, limit: 3, remaining: 3 })
  const [isPremium, setIsPremium] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const [profile, setProfile] = useState<UserProfile>({
    area:      '',
    level:     'iniciante',
    objective: 'renda-extra',
    time:      'pouco',
  })

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    try {
      const saved = localStorage.getItem('scalemind_usage')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.date === today) {
          const used = parsed.used ?? 0
          setUsage({ used, limit: 3, remaining: Math.max(0, 3 - used) })
          return
        }
      }
      localStorage.setItem('scalemind_usage', JSON.stringify({ date: today, used: 0 }))
    } catch {}
  }, [])

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setLoadMsg(p => (p + 1) % LOADING_MSGS.length), 1400)
    return () => clearInterval(t)
  }, [loading])

  async function handleGenerate() {
    if (!profile.area.trim()) { setError('Informe sua área de interesse.'); return }
    if (usage.remaining <= 0) return
    setLoading(true)
    setError(null)

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (isPremium && process.env.NEXT_PUBLIC_PREMIUM_TOKEN) {
        headers['x-premium-token'] = process.env.NEXT_PUBLIC_PREMIUM_TOKEN
      }

      const res  = await fetch('/api/generate-idea', { method: 'POST', headers, body: JSON.stringify(profile) })
      const data = await res.json()

      if (res.status === 429) {
        setUsage(u => ({ ...u, remaining: 0, used: u.limit }))
        setError('limit_reached')
        return
      }

      setResult(data)
      const newUsed = data.usage.used
      setUsage(data.usage)
      try {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem('scalemind_usage', JSON.stringify({ date: today, used: newUsed }))
      } catch {}
      setStep('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Limite atingido
  if (usage.remaining <= 0 && step !== 'result') {
    return <UpgradeWall />
  }

  return (
    <div className="space-y-6">

      {/* Barra de uso */}
      <UsageBar usage={usage} />

      {/* Formulário */}
      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-violet-600 px-6 py-4">
            <h2 className="text-white font-bold text-lg">Personalize sua ideia</h2>
            <p className="text-sky-100 text-sm">Quanto mais detalhes, mais precisa será a ideia</p>
          </div>

          <div className="p-6 space-y-7">

            {/* Área */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                1. Qual é sua área de interesse ou experiência?
              </label>
              <input
                type="text"
                value={profile.area}
                onChange={e => setProfile(p => ({ ...p, area: e.target.value }))}
                placeholder="Ex: nutrição, marketing, advocacia, fitness, contabilidade..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 focus:outline-none text-gray-800 text-sm transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">Pode ser qualquer área — não precisa ser tecnologia</p>
            </div>

            {/* Nível */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                2. Qual é seu nível de conhecimento técnico?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEVELS.map(({ value, label, desc }) => (
                  <button key={value} onClick={() => setProfile(p => ({ ...p, level: value as UserProfile['level'] }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      profile.level === value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}>
                    <div className="font-bold text-sm text-gray-800">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                3. Qual é seu objetivo principal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {OBJECTIVES.map(({ value, label, desc }) => (
                  <button key={value} onClick={() => setProfile(p => ({ ...p, objective: value as UserProfile['objective'] }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      profile.objective === value
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}>
                    <div className="font-bold text-sm text-gray-800">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                4. Quanto tempo você tem disponível?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIMES.map(({ value, label, desc }) => (
                  <button key={value} onClick={() => setProfile(p => ({ ...p, time: value as UserProfile['time'] }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      profile.time === value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}>
                    <div className="font-bold text-sm text-gray-800">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && error !== 'limit_reached' && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>
            )}

            <button onClick={handleGenerate} disabled={loading}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-extrabold rounded-xl transition-all text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:translate-y-0">
              {loading ? (
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gerando sua ideia personalizada...
                  </span>
                  <span className="text-xs text-sky-200 font-normal animate-pulse">
                    {LOADING_MSGS[loadMsg]}
                  </span>
                </span>
              ) : (
                `🚀 Gerar minha ideia personalizada (${usage.remaining} restante${usage.remaining !== 1 ? 's' : ''})`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Resultado */}
      {step === 'result' && result && (
        <div ref={resultRef} className="space-y-4">
          <button onClick={() => { setStep('form'); setResult(null) }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors">
            ← Gerar nova ideia
          </button>
          <IdeaCard preview={result.preview} full={result.full} source={result.source} />
        </div>
      )}
    </div>
  )
}

// ─── Barra de uso ─────────────────────────────────────────────────────────────

function UsageBar({ usage }: { usage: { used: number; limit: number; remaining: number } }) {
  const pct = (usage.used / usage.limit) * 100
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">Ideias gratuitas hoje</span>
        <span className={`text-sm font-bold tabular-nums ${usage.remaining === 0 ? 'text-red-600' : 'text-sky-600'}`}>
          {usage.used}/{usage.limit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-700 ${
          usage.remaining === 0 ? 'bg-red-500' : usage.used >= 2 ? 'bg-amber-500' : 'bg-sky-500'
        }`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        {usage.remaining > 0
          ? `${usage.remaining} ideia${usage.remaining !== 1 ? 's' : ''} restante${usage.remaining !== 1 ? 's' : ''} hoje`
          : 'Limite atingido — volte amanhã ou faça upgrade'}
      </p>
    </div>
  )
}

// ─── Card da ideia ────────────────────────────────────────────────────────────

function IdeaCard({ preview, full, source }: { preview: IdeaPreview; full: IdeaFull | null; source: string }) {
  const [copied, setCopied] = useState(false)

  function copyPreview() {
    const text = `💡 ${preview.name}\n"${preview.tagline}"\n\n🎯 Problema: ${preview.problem}\n👥 Público: ${preview.audience}\n📈 Potencial: ${preview.potential}`
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-br from-sky-600 to-violet-700 p-6 text-white">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            {source === 'ai' && (
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">✨ Gerado com IA</span>
            )}
            <h2 className="text-2xl font-extrabold leading-tight">{preview.name}</h2>
          </div>
          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15`}>
            {preview.difficulty}
          </span>
        </div>
        <p className="text-sky-100 italic text-sm">"{preview.tagline}"</p>
        <div className="mt-3 inline-block bg-white/15 rounded-lg px-3 py-1.5">
          <span className="text-white font-bold text-sm">📈 {preview.potential}</span>
        </div>
      </div>

      {/* Preview — visível para todos */}
      <div className="divide-y divide-gray-50">
        {[
          { icon: '🎯', label: 'Problema que resolve', value: preview.problem,  bg: 'bg-red-50' },
          { icon: '👥', label: 'Público-alvo',         value: preview.audience, bg: 'bg-blue-50' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className={`flex gap-4 p-5 ${bg}`}>
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-gray-800 text-sm leading-relaxed font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Conteúdo premium */}
      {full ? (
        <PremiumContent full={full} />
      ) : (
        <PremiumBlur />
      )}

      {/* Ações */}
      <div className="p-4 flex gap-3 border-t border-gray-100">
        <button onClick={copyPreview}
          className={`flex-1 py-3 font-semibold rounded-xl text-sm transition-all ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
          {copied ? '✅ Copiado!' : '📋 Copiar preview'}
        </button>
        <a href="/blog?categoria=MicroSaaS"
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition-colors text-center">
          📚 Aprender mais →
        </a>
      </div>
    </div>
  )
}

// ─── Conteúdo premium completo ────────────────────────────────────────────────

function PremiumContent({ full }: { full: IdeaFull }) {
  return (
    <div className="divide-y divide-gray-50">
      {[
        { icon: '⚙️', label: 'Como aplicar na prática', value: full.howToApply,     bg: 'bg-violet-50' },
        { icon: '💰', label: 'Como monetizar',           value: full.monetization,   bg: 'bg-emerald-50' },
        { icon: '📈', label: 'Possibilidade de escala',  value: full.scalability,    bg: 'bg-amber-50' },
        { icon: '🤖', label: 'Como usar IA',             value: full.aiUsage,        bg: 'bg-sky-50' },
        { icon: '⚡', label: 'Como automatizar',         value: full.automationUsage, bg: 'bg-indigo-50' },
      ].map(({ icon, label, value, bg }) => (
        <div key={label} className={`flex gap-4 p-5 ${bg}`}>
          <span className="text-2xl shrink-0">{icon}</span>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
          </div>
        </div>
      ))}

      {/* Passo a passo */}
      <div className="p-5 bg-gray-50">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">🚀 Passo a passo inicial</p>
        <ol className="space-y-2">
          {full.stepByStep.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Validação */}
      <div className="p-5 bg-yellow-50">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">🧪 Como validar em 7 dias</p>
        <p className="text-gray-800 text-sm leading-relaxed">{full.validation}</p>
      </div>

      {/* Versões */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="p-5 bg-green-50">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">🧩 Sem saber programar</p>
          <p className="text-gray-700 text-sm leading-relaxed">{full.noCodeVersion}</p>
        </div>
        <div className="p-5 bg-blue-50">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">👨‍💻 Sabendo programar</p>
          <p className="text-gray-700 text-sm leading-relaxed">{full.devVersion}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Blur premium ─────────────────────────────────────────────────────────────

function PremiumBlur() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  return (
    <div className="relative">
      {/* Conteúdo borrado */}
      <div className="select-none pointer-events-none">
        {[
          { icon: '⚙️', label: 'Como aplicar na prática', value: 'Crie uma landing page simples descrevendo o produto e adicione um botão de pré-venda. Use Carrd ou Framer para montar em menos de 2 horas sem código.', bg: 'bg-violet-50' },
          { icon: '💰', label: 'Como monetizar',           value: 'Assinatura mensal de R$ 97/mês com plano anual de R$ 797. Ofereça 14 dias grátis para reduzir fricção na conversão inicial.', bg: 'bg-emerald-50' },
          { icon: '🚀', label: 'Passo a passo inicial',    value: '1. Valide com 5 potenciais clientes  2. Monte MVP em 2 semanas  3. Lance para lista de espera  4. Itere com feedback real', bg: 'bg-amber-50' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className={`flex gap-4 p-5 ${bg} blur-sm`}>
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay de conversão */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">🔓</div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Você acabou de ver o potencial
          </h3>
          <p className="text-gray-600 text-sm mb-5 leading-relaxed">
            Desbloqueie o plano completo para ver <strong>exatamente como transformar isso em um negócio real</strong> — passo a passo, validação e como monetizar.
          </p>

          {!sent ? (
            <div className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 focus:outline-none text-sm" />
              <button
                onClick={() => { if (email) setSent(true) }}
                className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-500 hover:to-violet-500 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 text-sm">
                🚀 Desbloquear ideia completa
              </button>
              <p className="text-xs text-gray-400">Em breve · Seja notificado primeiro</p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-emerald-700 font-bold">🎉 Você está na lista!</p>
              <p className="text-emerald-600 text-sm mt-1">Avisaremos quando o Premium estiver disponível.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tela de upgrade (limite atingido) ───────────────────────────────────────

function UpgradeWall() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">⚡</div>
        <h3 className="text-2xl font-extrabold mb-2">
          Você já viu que as ideias funcionam.
        </h3>
        <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
          Agora veja <strong className="text-white">COMO executar</strong> e ganhar dinheiro com elas. Suas 3 ideias gratuitas foram usadas.
        </p>
      </div>

      {/* Comparação free vs premium */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="font-bold text-gray-400 mb-3">🆓 Gratuito</p>
          {['Nome da ideia', 'Problema', 'Público-alvo', '❌ Como executar', '❌ Passo a passo', '❌ Como monetizar'].map(i => (
            <p key={i} className={`text-xs py-1 ${i.startsWith('❌') ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{i.replace('❌ ', '')}</p>
          ))}
        </div>
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
          <p className="font-bold text-sky-400 mb-3">💎 Premium</p>
          {['Nome da ideia', 'Problema', 'Público-alvo', '✅ Como executar', '✅ Passo a passo', '✅ Como monetizar', '✅ Validação', '✅ IA e automação', '✅ Sem código'].map(i => (
            <p key={i} className="text-xs py-1 text-gray-200">{i}</p>
          ))}
        </div>
      </div>

      {!sent ? (
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-300 font-medium">
            Entre na lista de espera e seja o primeiro a saber:
          </p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
          <button onClick={() => { if (email) setSent(true) }}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
            🚀 Quero desbloquear ideias completas
          </button>
        </div>
      ) : (
        <div className="text-center py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="text-emerald-400 font-bold text-lg">🎉 Você está na lista!</p>
          <p className="text-gray-400 text-sm mt-1">Avisaremos quando o Premium estiver disponível.</p>
          <p className="text-gray-500 text-xs mt-3">Volte amanhã para mais 3 ideias gratuitas</p>
        </div>
      )}
    </div>
  )
}
