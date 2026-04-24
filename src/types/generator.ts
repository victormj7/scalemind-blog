// Perfil do usuário coletado no formulário
export interface UserProfile {
  area:      string
  level:     'iniciante' | 'intermediario' | 'avancado'
  objective: 'renda-extra' | 'criar-negocio' | 'escalar'
  time:      'pouco' | 'medio' | 'total'
}

// Estrutura da ideia — campos em português para alinhar com o JSON da IA
export interface Ideia {
  nome:        string
  descricao:   string
  problema:    string
  publico:     string
  monetizacao: string
  receita:     string
  passos:      string[]
  validacao:   string
  ia:          string
  automacao:   string
  iniciante:   string
  programador: string
  dificuldade: 'Baixo' | 'Médio' | 'Alto'
}

// Resposta padronizada da API
export interface ApiResponse {
  success:  boolean
  fallback: boolean          // true quando usou ideia local
  source:   'ai' | 'local'
  data:     Ideia
  usage: {
    used:      number
    limit:     number
    remaining: number
  }
}
