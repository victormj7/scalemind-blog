'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function SuccessPage() {
  useEffect(() => {
    // Marcar como premium no localStorage para identificação imediata
    const email = localStorage.getItem('scalemind_email')
    if (email) {
      localStorage.setItem('scalemind_premium', 'true')
      localStorage.setItem('scalemind_premium_email', email)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10">
          <div className="text-6xl mb-6">🎉</div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Pagamento confirmado!
          </h1>

          <p className="text-gray-600 mb-2 leading-relaxed">
            Seu acesso Premium foi liberado.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Agora você tem ideias ilimitadas com passo a passo completo de execução.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 text-left space-y-2">
            <p className="text-emerald-800 font-bold text-sm mb-3">✅ O que você desbloqueou:</p>
            {[
              'Ideias ilimitadas por dia',
              'Passo a passo de execução',
              'Como validar em 7 dias',
              'Estratégia de monetização',
              'Como usar IA na sua ideia',
            ].map(item => (
              <p key={item} className="text-emerald-700 text-sm flex items-center gap-2">
                <span>✓</span> {item}
              </p>
            ))}
          </div>

          <Link href="/ferramentas/gerador-microsaas"
            className="block w-full py-4 bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-500 hover:to-violet-500 text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 text-base">
            🚀 Ir para o gerador agora
          </Link>

          <p className="text-xs text-gray-400 mt-4">
            Dúvidas? Entre em contato em{' '}
            <a href="/contato" className="text-sky-600 hover:underline">nossa página de contato</a>
          </p>
        </div>
      </div>
    </div>
  )
}
