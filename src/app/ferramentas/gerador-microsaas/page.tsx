import type { Metadata } from 'next'
import { GeradorClient } from './GeradorClient'

export const metadata: Metadata = {
  title: 'Gerador de Ideias de MicroSaaS com IA — Grátis',
  description: 'Gere ideias validadas de MicroSaaS para o seu nicho em segundos. Ferramenta gratuita com ideias práticas e realistas para ganhar dinheiro online.',
}

export default function GeradorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero da ferramenta */}
      <div className="bg-gradient-to-br from-gray-900 via-sky-950 to-violet-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-sky-500/20 text-sky-300 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-sky-500/30">
            🚀 Ferramenta Gratuita
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Gerador de Ideias de
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent"> MicroSaaS</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Receba ideias práticas e validadas de MicroSaaS para o seu nicho.
            Cada ideia vem com modelo de negócio, público-alvo e potencial de receita.
          </p>
        </div>
      </div>

      {/* Ferramenta */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <GeradorClient />
      </div>

      {/* Como funciona */}
      <div className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Escolha seu nicho', desc: 'Selecione a área que você conhece ou quer explorar.' },
              { step: '2', title: 'Gere a ideia', desc: 'Clique em gerar e receba uma ideia completa e validada.' },
              { step: '3', title: 'Execute', desc: 'Use o modelo de negócio sugerido para começar a construir.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
