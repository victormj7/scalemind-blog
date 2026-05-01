import type { Metadata } from 'next'
import { GeradorClient } from './GeradorClient'

export const metadata: Metadata = {
  title: 'Copiloto de Negócios com IA — Crie e Execute seu MicroSaaS',
  description: 'Não só gera a ideia — mostra o caminho completo para executar, validar e ganhar dinheiro. Copiloto com IA para criar negócios digitais, mesmo sem saber programar.',
}

export default function GeradorPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-sky-950 to-violet-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-emerald-500/30">
            ✅ Gratuito · Sem cadastro · Resultado em segundos
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Seu copiloto com IA para
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent"> criar e executar negócios</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Não só gera a ideia — mostra o caminho completo para executar, validar e ganhar dinheiro.
            Mesmo sem saber programar.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <span className="text-emerald-300 font-semibold">🔥 847 ideias geradas</span>
            <span className="text-gray-500">·</span>
            <span className="text-sky-300 font-semibold">👥 312 usuários ativos</span>
          </div>
        </div>
      </div>

      {/* Ferramenta */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <GeradorClient />
      </div>

      {/* Como funciona */}
      <div className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-3">
            Como funciona
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Em menos de 1 minuto você tem uma ideia de negócio personalizada
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Informe sua área', desc: 'Diga qual é sua área de interesse ou experiência — pode ser qualquer coisa.' },
              { step: '2', title: 'IA gera sua ideia', desc: 'Nossa IA cria uma ideia personalizada com modelo de negócio e potencial de receita.' },
              { step: '3', title: 'Execute e ganhe', desc: 'Use o passo a passo para transformar a ideia em renda real.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-gradient-to-r from-sky-600 to-violet-600 py-12 px-4 text-center text-white">
        <h2 className="text-2xl font-extrabold mb-3">Pronto para executar sua ideia?</h2>
        <p className="text-sky-100 mb-6">Mais de 847 empreendedores já usaram o copiloto. Agora é a sua vez.</p>
        <a href="/ferramentas/gerador-microsaas"
          className="inline-block px-8 py-4 bg-white text-sky-700 font-bold rounded-xl hover:bg-sky-50 transition-colors shadow-lg">
          🤖 Iniciar com meu copiloto agora
        </a>
      </div>
    </div>
  )
}
