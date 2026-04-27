import { getSupabase } from '@/lib/supabase'

// Fallback em memória — usado quando Supabase não está configurado
const memoryStore = new Set<string>()

/**
 * Adiciona um subscriber.
 * - Se Supabase estiver configurado: salva no banco (persistente)
 * - Se não estiver: salva em memória (temporário)
 * Retorna true se era novo, false se já existia.
 */
export async function addSubscriber(email: string): Promise<boolean> {
  const supabase = getSupabase()

  if (supabase) {
    const { error } = await supabase
      .from('subscribers')
      .insert({ email })
      .select()

    // Código 23505 = violação de unique constraint (email duplicado)
    if (error) {
      if (error.code === '23505') return false
      // Outro erro — loga e usa fallback em memória
      console.error('[Supabase] addSubscriber error:', error.message)
    } else {
      return true
    }
  }

  // Fallback em memória
  if (memoryStore.has(email)) return false
  memoryStore.add(email)
  return true
}

export function getSubscribers(): string[] {
  return Array.from(memoryStore)
}

export function hasSubscriber(email: string): boolean {
  return memoryStore.has(email)
}
