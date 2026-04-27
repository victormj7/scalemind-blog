import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

// Retorna null se as variáveis não estiverem configuradas
// Permite fallback para memória sem quebrar o build
export function getSupabase() {
  if (!url || !key) return null
  return createClient(url, key)
}
