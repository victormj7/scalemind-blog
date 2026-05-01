import { getSupabase } from '@/lib/supabase'
import type { Ideia, UserProfile } from '@/types/generator'

export interface DbIdea {
  id:         string
  user_id:    string
  profile:    UserProfile
  idea:       Ideia
  created_at: string
}

/** Cria o usuário se não existir. Retorna o id. */
export async function upsertUser(email: string): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .upsert({ email }, { onConflict: 'email' })
    .select('id')
    .single()

  if (error) { console.error('[db] upsertUser:', error.message); return null }
  return data.id
}

/** Salva uma ideia vinculada ao usuário. Retorna o id da ideia. */
export async function saveIdea(email: string, profile: UserProfile, idea: Ideia): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const userId = await upsertUser(email)
  if (!userId) return null

  const { data, error } = await supabase
    .from('ideas')
    .insert({ user_id: userId, profile, idea })
    .select('id')
    .single()

  if (error) { console.error('[db] saveIdea:', error.message); return null }
  return data.id
}

/** Lista todas as ideias de um usuário, mais recentes primeiro. */
export async function listIdeas(email: string): Promise<DbIdea[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (!user) return []

  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) { console.error('[db] listIdeas:', error.message); return [] }
  return data as DbIdea[]
}

/** Remove uma ideia pelo id (valida que pertence ao usuário). */
export async function deleteIdea(email: string, ideaId: string): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (!user) return false

  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', ideaId)
    .eq('user_id', user.id)

  if (error) { console.error('[db] deleteIdea:', error.message); return false }
  return true
}

// ─── Fila de emails ───────────────────────────────────────────────────────────

const SEQUENCE_DAYS = [0, 1, 3, 5]

/** Agenda a sequência completa para um email. Ignora dias já agendados. */
export async function scheduleSequence(email: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const now = new Date()
  const rows = SEQUENCE_DAYS.map(day => {
    const send_at = new Date(now)
    send_at.setDate(send_at.getDate() + day)
    return { email, day, send_at: send_at.toISOString(), sent: false }
  })

  // upsert por (email, day) — evita duplicatas se chamar duas vezes
  await supabase
    .from('email_queue')
    .upsert(rows, { onConflict: 'email,day', ignoreDuplicates: true })
}

/** Busca emails pendentes com send_at <= agora. Máx 50 por vez. */
export async function getPendingEmails(): Promise<{ id: string; email: string; day: number }[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('email_queue')
    .select('id, email, day')
    .eq('sent', false)
    .lte('send_at', new Date().toISOString())
    .limit(50)

  if (error) { console.error('[db] getPendingEmails:', error.message); return [] }
  return data ?? []
}

/** Marca um email como enviado. */
export async function markEmailSent(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return
  await supabase.from('email_queue').update({ sent: true }).eq('id', id)
}
