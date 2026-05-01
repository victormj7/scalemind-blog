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

const DEEPEN_TOPICS = [
  { value: 'primeiro-cliente',  label: '🎯 Conseguir o 1º cliente',  desc: 'Onde e como abordar' },
  { value: 'precificacao',      label: '💰 Precificação',           desc: 'Quanto cobrar e por quê' },
  { value: 'stack-tecnica',     label: '🛠️ Stack técnica',          desc: 'Ferramentas e arquitetura' },
  { value: 'marketing',        label: '📣 Marketing inicial',      desc: 'Canais e mensagem' },
  { value: 'automacao',        label: '🤖 Automatizar com IA',     desc: 'Fluxos e ferramentas' },
  { value: 'riscos',           label: '⚠️ Riscos e obstáculos',    desc: 'O que pode dar errado' },
]

const DIFICULDADE_STYLE: Record<string, string> = {
  'Baixo': 'bg-emerald-100 text-emerald-700',
  'Médio': 'bg-amber-100 text-amber-700',
  'Alto':  'bg-red-100 text-red-700',
}

// ─── API de ideias ──────────────────────────────────────────────────────

export interface DbIdea {
  id:         string
  profile:    UserProfile
  idea:       Ideia
  created_at: string
}

async function apiSaveIdea(email: string, profile: UserProfile, idea: Ideia): Promise<string | null> {
  try {
    const res  = await fetch('/api/ideas', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': email },
      body:    JSON.stringify({ profile, idea }),
    })
    const data = await res.json()
    return data.id ?? null
  } catch { return null }
}

async function apiFetchIdeas(email: string): Promise<DbIdea[]> {
  try {
    const res  = await fetch(`/api/ideas?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    return data.ideas ?? []
  } catch { return [] }
}

async function apiDeleteIdea(email: string, id: string): Promise<void> {
  await fetch(`/api/ideas?id=${id}`, {
    method:  'DELETE',
    headers: { 'x-user-email': email },
  }).catch(() => {})
}

// ─── Tracking real via API ───────────────────────────────────────────────────

function track(event: string, data?: Record<string, unknown>) {
  // Envia para /api/track em background — não bloqueia a UI
  fetch('/api/track', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ event, data }),
  }).catch(() => {}) // silencia erros de rede
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function GeradorClient() {
  const [step,     setStep]     = useState<'form' | 'result'>('form')
  const [tab,      setTab]      = useState<'gerador' | 'salvas'>('gerador')
  const [loading,  setLoading]  = useState(false)
  const [loadMsg,  setLoadMsg]  = useState(0)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [saved,    setSaved]    = useState<DbIdea[]>([])
  const [userEmail, setUserEmail] = useState<string>('')
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
      localStorage.setItem('scalemind_usage', JSON.stringify({ date: today, used: 0 }))
    } catch {}
    const premium = localStorage.getItem('scalemind_premium') === 'true'
    if (premium) setIsPremium(true)
    const email = localStorage.getItem('scalemind_user_email') ?? ''
    if (email) {
      setUserEmail(email)
      apiFetchIdeas(email).then(setSaved)
    }
  }, [])

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setLoadMsg(p => (p + 1) % LOADING_MSGS.length), 1400)
    return () => clearInterval(t)
  }, [loading])

  async function handleGenerate() {
    if (!profile.area.trim()) { setError('Informe sua área de interesse.'); return }

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

      if (!data.success) {
        setError('Erro ao gerar ideia. Tente novamente.')
        return
      }

      setResponse(data)
      track('gerou_ideia', { area: profile.area, source: data.source })
      setStep('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Abas: Copiloto / Minhas Ideias */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTab('gerador')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
            tab === 'gerador' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          🤖 Copiloto
        </button>
        <button
          onClick={() => setTab('salvas')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
            tab === 'salvas' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          💾 Minhas Ideias
          {saved.length > 0 && (
            <span className="ml-1.5 bg-sky-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {saved.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'salvas' ? (
        <SavedIdeasPanel
          saved={saved}
          onDelete={async (id) => {
            if (userEmail) await apiDeleteIdea(userEmail, id)
            setSaved(s => s.filter(i => i.id !== id))
          }}
          onOpen={(entry) => {
            setResponse({ success: true, fallback: false, source: 'ai', isPremium, data: entry.idea, usage: { used: 0, limit: 999, remaining: 999 } })
            setStep('result')
            setTab('gerador')
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
          }}
        />
      ) : (
        <>
          <UsageBar isPremium={isPremium} />

          {step === 'form' && (
            <Formulario
              profile={profile}
              setProfile={setProfile}
              loading={loading}
              loadMsg={loadMsg}
              error={error}
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
              <IdeaCard ideia={response.data} source={response.source} fallback={response.fallback} profile={profile} isPremium={isPremium} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Formulário ───────────────────────────────────────────────────────────────

function Formulario({ profile, setProfile, loading, loadMsg, error, onGenerate }: {
  profile:    UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  loading:    boolean
  loadMsg:    number
  error:      string | null
  onGenerate: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-violet-600 px-6 py-4">
        <h2 className="text-white font-bold text-lg">🤖 Configure seu copiloto</h2>
        <p className="text-sky-100 text-sm">Quanto mais detalhes, mais preciso será o plano de execução</p>
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
          `🚀 Gerar minha ideia`
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

function UsageBar({ isPremium }: { isPremium: boolean }) {
  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border-2 border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">💎</span>
          <span className="text-sm font-bold text-emerald-700">Plano Premium ativo</span>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Ilimitado</span>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-lg">🆓</span>
        <span className="text-sm font-semibold text-gray-700">Plano Grátis — 1 ideia completa</span>
      </div>
      <a href="/upgrade" className="text-xs font-bold text-sky-600 hover:underline">Fazer upgrade →</a>
    </div>
  )
}

// ─── Card da ideia ────────────────────────────────────────────────────────────

function IdeaCard({ ideia, source, fallback, profile, isPremium }: {
  ideia: Ideia; source: string; fallback: boolean
  profile: UserProfile; isPremium: boolean
}) {
  const [copied,        setCopied]        = useState(false)
  const [deepenTopic,   setDeepenTopic]   = useState<string | null>(null)
  const [deepenResult,  setDeepenResult]  = useState<string | null>(null)
  const [deepenLoading, setDeepenLoading] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  function copiar() {
    const text = [
      `💡 ${ideia.nome}`, '',
      `📝 ${ideia.descricao}`,
      `🎯 Problema: ${ideia.problema}`,
      `👥 Público: ${ideia.publico}`,
      `💰 Monetização: ${ideia.monetizacao}`,
      `📈 Receita: ${ideia.receita}`,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  async function handleDeepen(topic: string) {
    if (deepenTopic === topic && deepenResult) { setDeepenTopic(null); setDeepenResult(null); return }
    setDeepenTopic(topic)
    setDeepenResult(null)
    setDeepenLoading(true)
    track('aprofundou_ideia', { topic, area: profile.area })
    try {
      const res  = await fetch('/api/generate-idea/deepen', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ideia, topic, profile }),
      })
      const data = await res.json()
      setDeepenResult(data.result ?? 'Não foi possível aprofundar. Tente novamente.')
    } catch {
      setDeepenResult('Erro de conexão. Tente novamente.')
    } finally {
      setDeepenLoading(false)
    }
  }

  const CAMPOS_COMPLETOS = [
    { icon: '🎯', label: 'Problema que resolve', value: ideia.problema,    bg: 'bg-red-50' },
    { icon: '👥', label: 'Público-alvo',         value: ideia.publico,     bg: 'bg-blue-50' },
    { icon: '💰', label: 'Como monetizar',      value: ideia.monetizacao, bg: 'bg-emerald-50' },
    { icon: '🧪', label: 'Como validar',        value: ideia.validacao,   bg: 'bg-amber-50' },
    { icon: '🤖', label: 'Como usar IA',        value: ideia.ia,          bg: 'bg-sky-50' },
    { icon: '🧩', label: 'Sem programar',       value: ideia.iniciante,   bg: 'bg-violet-50' },
  ]

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-xl overflow-hidden">

        {/* Header */}
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
          <div className="bg-white/15 border border-white/25 rounded-xl p-4">
            <p className="text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">💰 Potencial de receita</p>
            <p className="text-white text-2xl font-extrabold">{ideia.receita}</p>
            <p className="text-sky-200 text-xs mt-1">estimativa mensal realista para o mercado brasileiro</p>
          </div>
        </div>

        {/* Todos os campos — sem blur */}
        <div className="divide-y divide-gray-50">
          {CAMPOS_COMPLETOS.map(({ icon, label, value, bg }) => (
            <div key={label} className={`flex gap-4 p-5 ${bg}`}>
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-gray-800 text-sm leading-relaxed font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Passo a passo completo */}
        <div className="bg-emerald-50 border-t border-emerald-100 p-5">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">✅ Passo a passo de execução</p>
          <ol className="space-y-2">
            {ideia.passos.map((passo, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-800">
                <span className="shrink-0 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="leading-relaxed">{passo}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Copiloto: Aprofundar */}
        <div className="border-t border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🤖 Copiloto — aprofundar esta ideia</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEEPEN_TOPICS.map(({ value, label, desc }) => (
              <button key={value} onClick={() => handleDeepen(value)}
                className={`p-3 rounded-xl border-2 text-left transition-all text-xs ${
                  deepenTopic === value ? 'border-sky-500 bg-sky-50' : 'border-gray-100 hover:border-sky-200 bg-gray-50'
                }`}>
                <div className="font-bold text-gray-800">{label}</div>
                <div className="text-gray-400 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
          {deepenTopic && (
            <div className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-4">
              {deepenLoading ? (
                <div className="flex items-center gap-2 text-sky-600 text-sm">
                  <span className="w-4 h-4 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
                  Copiloto analisando...
                </div>
              ) : (
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{deepenResult}</p>
              )}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="p-4 flex gap-3 border-t border-gray-100">
          <button onClick={copiar}
            className={`flex-1 py-3 font-semibold rounded-xl text-sm transition-all ${
              copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}>
            {copied ? '✅ Copiado!' : '📋 Copiar ideia'}
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-sky-200">
            💾 Salvar essa ideia
          </button>
        </div>
      </div>

      {showSaveModal && (
        <SaveModal
          ideia={ideia}
          profile={profile}
          onSaved={(email, dbIdea) => {
            setShowSaveModal(false)
            track('salvou_ideia', { area: profile.area })
          }}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </>
  )
}

// ─── Painel de ideias salvas ──────────────────────────────────────────────────

function SavedIdeasPanel({ saved, onDelete, onOpen }: {
  saved:    DbIdea[]
  onDelete: (id: string) => void
  onOpen:   (entry: DbIdea) => void
}) {
  if (saved.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="text-4xl mb-3">💡</div>
        <p className="text-gray-700 font-bold">Nenhuma ideia salva ainda</p>
        <p className="text-gray-400 text-sm mt-1">Gere uma ideia e clique em “Salvar essa ideia”.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {saved.map((entry) => (
        <div key={entry.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:border-sky-200 transition-colors">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{entry.idea.nome}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.idea.descricao}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-emerald-600 font-semibold">{entry.idea.receita}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{entry.profile.area}</span>
              <span className="text-gray-300">·</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                DIFICULDADE_STYLE[entry.idea.dificuldade] ?? 'bg-gray-100 text-gray-500'
              }`}>{entry.idea.dificuldade}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => onOpen(entry)}
              className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors">
              Abrir
            </button>
            <button onClick={() => onDelete(entry.id)}
              className="px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 text-xs font-bold rounded-lg transition-colors">
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Modal de salvar ideia ────────────────────────────────────────────────────

function SaveModal({ ideia, profile, onSaved, onClose }: {
  ideia:   Ideia
  profile: UserProfile
  onSaved: (email: string, idea: DbIdea) => void
  onClose: () => void
}) {
  const [email,   setEmail]   = useState(() => {
    try { return localStorage.getItem('scalemind_user_email') ?? '' } catch { return '' }
  })
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSave() {
    const clean = email.trim().toLowerCase()
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError('Informe um e-mail válido.')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Registra na newsletter e salva a ideia no banco
      await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: clean }),
      })
      const id = await apiSaveIdea(clean, profile, ideia)
      localStorage.setItem('scalemind_user_email', clean)
      const dbIdea: DbIdea = { id: id ?? crypto.randomUUID(), profile, idea: ideia, created_at: new Date().toISOString() }
      onSaved(clean, dbIdea)
      setDone(true)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {!done ? (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">💾 Salvar essa ideia</h3>
                <p className="text-gray-500 text-sm mt-0.5">Informe seu e-mail para guardar <strong className="text-gray-700">{ideia.nome}</strong></p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="seu@email.com"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-500 focus:outline-none text-sm"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button onClick={handleSave} disabled={loading}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold rounded-xl transition-all text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </span>
                ) : '💾 Salvar ideia'}
              </button>
              <p className="text-xs text-gray-400 text-center">Sem spam. Você também recebe 1 ideia por semana.</p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-1">Ideia salva!</h3>
            <p className="text-gray-500 text-sm mb-4">Acesse em <strong>Minhas Ideias</strong> quando quiser.</p>
            <button onClick={onClose}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
