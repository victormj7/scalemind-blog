'use client'

import { useState, useEffect, useRef } from 'react'
import type { ApiResponse, Ideia, UserProfile } from '@/types/generator'

// ─── Configurações ────────────────────────────────────────────────────────────

const LEVELS = [
  { value: 'iniciante',     label: '🌱 Iniciante',      desc: 'Sem conhecimento técnico' },
  { value: 'intermediario', label: '⚡ Intermediário',   desc: 'Algum conhecimento digital' },
  { value: 'avancado',      label: '🚀 Avançado',        desc: 'Sei programar ou tenho experiência' },
]

const OBJECTIVES = [
  { value: 'renda-extra',   label: '💰 Renda extra',    desc: 'R$ 1k a R$ 5k/mês a mais' },
  { value: 'criar-negocio', label: '🏢 Criar negócio',  desc: 'Produto digital escalável' },
  { value: 'escalar',       label: '📈 Escalar',         desc: 'Crescer algo que já existe' },
]

const TIMES = [
  { value: 'pouco', label: '⏱ Pouco tempo',     desc: 'Até 1h por dia' },
  { value: 'medio', label: '🕐 Tempo moderado',  desc: '1 a 3h por dia' },
  { value: 'total', label: '🔥 Dedicação total', desc: 'Foco total no projeto' },
]

const LOADING_MSGS = [
  'Analisando seu perfil...',
  'Identificando oportunidades de mercado...',
  'Calculando potencial de receita...',
  'Personalizando para você...',
  'Finalizando sua ideia...',
]

const DIFICULDADE_STYLE: Record<string, string> = {
  'Baixo': 'bg-emerald-100 text-emerald-700',
  'Médio': 'bg-amber-100 text-amber-700',
  'Alto':  'bg-red-100 text-red-700',
}

// ─── Tracking simples ─────────────────────────────────────────────────────────

function track(event: string, data?: Record<string, unknown>) {
  console.log(`[ScaleMind] ${event}`, data ?? '')
}

// ─── Placeholder de pagamento ─────────────────────────────────────────────────

function handleUpgrade(origem: string) {
  track('clicou_upgrade', { origem })
  // TODO: integrar Stripe — redirecionar para /upgrade ou abrir checkout
  alert('Em breve! Você será notificado quando o plano Premium estiver disponível.')
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function GeradorClient() {
  const [step,     setStep]     = useState<'form' | 'result'>('form')
  const [loading,  setLoading]  = useState(false)
  const [loadMsg,  setLoadMsg]  = useState(0)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [usage,    setUsage]    = useState({ used: 0, limit: 3, remaining: 3 })
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
    setLoadMsg(0)

    try {
      const res  = await fetch('/api/generate-idea', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(profile),
      })
      const data: ApiResponse = await res.json()

      if (res.status === 429) {
        track('atingiu_limite')
        setUsage(u => ({ ...u, remaining: 0, used: u.limit }))
        return
      }

      if (!data.success) {
        setError('Erro ao gerar ideia. Tente novamente.')
        return
      }

      setResponse(data)
      setUsage(data.usage)
      track('gerou_ideia', { area: profile.area, source: data.source })

      try {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem('scalemind_usage', JSON.stringify({ date: today, used: data.usage.used }))
      } catch {}

      setStep('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (usage.remaining <= 0 && step !== 'result') {
    track('atingiu_limite')
    return <UpgradeWall />
  }

  return (
    <div className="space-y-6">
      <UsageBar usage={usage} />

      {step === 'form' && (
        <Formulario
          profile={profile}
          setProfile={setProfile}
          loading={loading}
          loadMsg={loadMsg}
          error={error}
          usage={usage}
          onGenerate={handleGenerate}
        />
      )}

      {step === 'result' && response && (
        <div ref={resultRef} className="space-y-4">
          <button
            onClick={() => { setStep('form'); setResponse(null) }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors"
          >
            ← Gerar nova ideia
          </button>
          <IdeaCard ideia={response.data} source={response.source} fallback={response.fallback} />
        </div>
      )}
    </div>
  )
}

// ─── Formulário ───────────────────────────────────────────────────────────────

function Formulario({ profile, setProfile, loading, loadMsg, error, usage, onGenerate }: {
  profile:    UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  loading:    boolean
  loadMsg:    number
  error:      string | null
  usage:      { remaining: number }
  onGenerate: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-violet-600 px-6 py-4">
        <h2 className="text-white font-bold text-lg">Personalize sua ideia</h2>
        <p className="text-sky-100 text-sm">Quanto mais detalhes, mais precisa será a ideia</p>
      </div>

      <div className="p-6 space-y-7">
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

        <OpcaoGrupo label="2. Qual é seu nível de conhecimento técnico?" opcoes={LEVELS}
          valor={profile.level} onChange={v => setProfile(p => ({ ...p, level: v as UserProfile['level'] }))}
          corAtiva="border-sky-500 bg-sky-50" />

        <OpcaoGrupo label="3. Qual é seu objetivo principal?" opcoes={OBJECTIVES}
          valor={profile.objective} onChange={v => setProfile(p => ({ ...p, objective: v as UserProfile['objective'] }))}
          corAtiva="border-violet-500 bg-violet-50" />

        <OpcaoGrupo label="4. Quanto tempo você tem disponível?" opcoes={TIMES}
          valor={profile.time} onChange={v => setProfile(p => ({ ...p, time: v as UserProfile['time'] }))}
          corAtiva="border-emerald-500 bg-emerald-50" />

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>}

        <button onClick={onGenerate} disabled={loading}
          className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-extrabold rounded-xl transition-all text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:translate-y-0">
          {loading ? (
            <span className="flex flex-col items-center gap-1">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando sua ideia personalizada...
              </span>
              <span className="text-xs text-sky-200 font-normal animate-pulse">{LOADING_MSGS[loadMsg]}</span>
            </span>
          ) : (
            `🚀 Gerar minha ideia (${usage.remaining} restante${usage.remaining !== 1 ? 's' : ''})`
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Grupo de opções ──────────────────────────────────────────────────────────

function OpcaoGrupo({ label, opcoes, valor, onChange, corAtiva }: {
  label: string; opcoes: { value: string; label: string; desc: string }[]
  valor: string; onChange: (v: string) => void; corAtiva: string
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {opcoes.map(({ value, label, desc }) => (
          <button key={value} onClick={() => onChange(value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${valor === value ? corAtiva : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}>
            <div className="font-bold text-sm text-gray-800">{label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
          </button>
        ))}
      </div>
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

function IdeaCard({ ideia, source, fallback }: { ideia: Ideia; source: string; fallback: boolean }) {
  const [copied, setCopied] = useState(false)

  function copiar() {
    const text = [`💡 ${ideia.nome}`, ``, `📝 ${ideia.descricao}`,
      `🎯 Problema: ${ideia.problema}`, `👥 Público: ${ideia.publico}`,
      `📈 Receita: ${ideia.receita}`].join('\n')
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-xl overflow-hidden">

      {/* Header com receita em destaque máximo */}
      <div className="bg-gradient-to-br from-sky-600 to-violet-700 p-6 text-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {source === 'ai' && !fallback && (
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                ✨ Gerado com IA
              </span>
            )}
            <h2 className="text-2xl font-extrabold leading-tight">{ideia.nome}</h2>
          </div>
          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${DIFICULDADE_STYLE[ideia.dificuldade] ?? 'bg-white/15 text-white'}`}>
            {ideia.dificuldade}
          </span>
        </div>
        <p className="text-sky-100 text-sm leading-relaxed mb-4">{ideia.descricao}</p>

        {/* Receita em destaque — elemento mais visível */}
        <div className="bg-white/15 border border-white/25 rounded-xl p-4">
          <p className="text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">💰 Potencial de receita</p>
          <p className="text-white text-2xl font-extrabold">{ideia.receita}</p>
          <p className="text-sky-200 text-xs mt-1">estimativa mensal realista para o mercado brasileiro</p>
        </div>
      </div>

      {/* Preview gratuito */}
      <div className="divide-y divide-gray-50">
        {[
          { icon: '🎯', label: 'Problema que resolve', value: ideia.problema, bg: 'bg-red-50' },
          { icon: '👥', label: 'Público-alvo',         value: ideia.publico,  bg: 'bg-blue-50' },
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

      {/* Prova de valor — primeiro passo visível antes do blur */}
      <div className="bg-emerald-50 border-t border-emerald-100 p-5">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
          ✅ Exemplo de como começar:
        </p>
        <p className="text-gray-800 text-sm leading-relaxed font-medium">
          {ideia.passos[0]}
        </p>
        <p className="text-xs text-emerald-600 mt-2 font-semibold">
          + 3 passos completos desbloqueados no Premium
        </p>
      </div>

      {/* Blur premium */}
      <PremiumBlur ideia={ideia} />

      {/* Ações */}
      <div className="p-4 flex gap-3 border-t border-gray-100">
        <button onClick={copiar}
          className={`flex-1 py-3 font-semibold rounded-xl text-sm transition-all ${
            copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}>
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

// ─── Blur premium ─────────────────────────────────────────────────────────────

function PremiumBlur({ ideia }: { ideia: Ideia }) {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  return (
    <div className="relative">
      {/* Conteúdo borrado */}
      <div className="select-none pointer-events-none blur-sm">
        {[
          { icon: '💰', label: 'Como monetizar',  value: ideia.monetizacao,     bg: 'bg-emerald-50' },
          { icon: '🧪', label: 'Como validar',    value: ideia.validacao,       bg: 'bg-amber-50' },
          { icon: '🤖', label: 'Como usar IA',    value: ideia.ia,              bg: 'bg-sky-50' },
          { icon: '🧩', label: 'Sem programar',   value: ideia.iniciante,       bg: 'bg-violet-50' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className={`flex gap-4 p-5 ${bg}`}>
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay de conversão */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/85 to-white flex items-end justify-center px-6 pb-8 pt-16">
        <div className="text-center max-w-sm w-full">

          {/* Mensagem forte de receita */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
            <p className="text-emerald-800 font-extrabold text-base leading-snug">
              💰 Essa ideia pode gerar entre{' '}
              <span className="text-emerald-600">{ideia.receita}</span>
            </p>
            <p className="text-emerald-700 text-sm mt-1">
              Você já viu o começo… agora veja exatamente como executar.
            </p>
          </div>

          {!sent ? (
            <div className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 focus:outline-none text-sm" />
              <button
                onClick={() => {
                  if (!email) return
                  track('clicou_upgrade', { origem: 'premium_blur' })
                  handleUpgrade('premium_blur')
                  setSent(true)
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-white font-extrabold rounded-xl transition-all shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 text-base">
                🚀 Quero ver como ganhar dinheiro com isso
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

// ─── Tela de upgrade (limite atingido) ────────────────────────────────────────

function UpgradeWall() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">⚡</div>
        <h3 className="text-2xl font-extrabold mb-2">
          Você encontrou ideias com potencial real de lucro.
        </h3>
        <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
          Desbloqueie para continuar gerando e ver{' '}
          <strong className="text-white">como executar cada ideia e ganhar dinheiro com ela.</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="font-bold text-gray-400 mb-3">🆓 Gratuito</p>
          {['Nome', 'Problema', 'Público', '— Monetização', '— Passo a passo', '— Validação'].map(i => (
            <p key={i} className={`text-xs py-1 ${i.startsWith('—') ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
              {i.replace('— ', '')}
            </p>
          ))}
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <p className="font-bold text-emerald-400 mb-3">💎 Premium</p>
          {['Nome', 'Problema', 'Público', '✅ Monetização', '✅ Passo a passo', '✅ Validação', '✅ IA e automação', '✅ Sem código'].map(i => (
            <p key={i} className="text-xs py-1 text-gray-200">{i}</p>
          ))}
        </div>
      </div>

      {!sent ? (
        <div className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          <button
            onClick={() => {
              if (!email) return
              track('clicou_upgrade', { origem: 'upgrade_wall' })
              handleUpgrade('upgrade_wall')
              setSent(true)
            }}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 text-base">
            🚀 Desbloquear ideias ilimitadas
          </button>
          <p className="text-center text-xs text-gray-500">Volte amanhã para mais 3 ideias gratuitas</p>
        </div>
      ) : (
        <div className="text-center py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="text-emerald-400 font-bold text-lg">🎉 Você está na lista!</p>
          <p className="text-gray-400 text-sm mt-1">Avisaremos quando o Premium estiver disponível.</p>
        </div>
      )}
    </div>
  )
}
