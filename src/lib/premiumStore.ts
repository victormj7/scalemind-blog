/**
 * Store de usuários premium em memória.
 * Sem banco de dados — simples e funcional para validação.
 *
 * Evolução futura: substituir por Supabase mantendo a mesma interface.
 */

const premiumEmails = new Set<string>()

export function addPremiumUser(email: string) {
  premiumEmails.add(email.toLowerCase().trim())
}

export function isUserPremium(email: string): boolean {
  return premiumEmails.has(email.toLowerCase().trim())
}

export function getPremiumCount(): number {
  return premiumEmails.size
}
