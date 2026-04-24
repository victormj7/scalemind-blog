// Perfil do usuário coletado no formulário
export interface UserProfile {
  area:       string   // área de interesse livre
  level:      'iniciante' | 'intermediario' | 'avancado'
  objective:  'renda-extra' | 'criar-negocio' | 'escalar'
  time:       'pouco' | 'medio' | 'total'
}

// Ideia preview — visível para plano gratuito
export interface IdeaPreview {
  name:        string
  tagline:     string   // frase de impacto
  problem:     string
  audience:    string
  potential:   string   // ex: "R$ 3.000 a R$ 15.000/mês"
  difficulty:  'Baixo' | 'Médio' | 'Alto'
}

// Ideia completa — visível apenas para premium
export interface IdeaFull extends IdeaPreview {
  description:    string
  howToApply:     string
  stepByStep:     string[]
  validation:     string
  monetization:   string
  scalability:    string
  aiUsage:        string
  automationUsage: string
  noCodeVersion:  string
  devVersion:     string
}

// Resposta da API
export interface GenerateResponse {
  preview:  IdeaPreview
  full:     IdeaFull | null   // null para plano gratuito
  isPremium: boolean
  source:   'ai' | 'local'
  usage: {
    used:      number
    limit:     number
    remaining: number
  }
}
