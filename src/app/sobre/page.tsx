import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça o ScaleMind: o blog sobre MicroSaaS, automação, finanças digitais e renda online.',
}

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-3xl font-black mx-auto mb-6">
          S
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Sobre o ScaleMind
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Conteúdo prático para quem quer escalar sua renda no mundo digital.
        </p>
      </div>

      <div className="prose-content space-y-6 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">O que é o ScaleMind?</h2>
        <p>
          O ScaleMind nasceu da crença de que qualquer pessoa com acesso à internet pode construir renda digital real — desde que tenha as informações certas e a mentalidade certa.
        </p>
        <p>
          Aqui você encontra conteúdo prático, honesto e direto ao ponto sobre os quatro pilares da renda digital moderna:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {[
            { emoji: '🚀', title: 'MicroSaaS', desc: 'Como criar produtos digitais escaláveis sem precisar de investimento externo.' },
            { emoji: '⚡', title: 'Automação', desc: 'Ferramentas no-code e IA que trabalham por você enquanto você dorme.' },
            { emoji: '💰', title: 'Finanças', desc: 'Como organizar, investir e multiplicar seu dinheiro no mundo digital.' },
            { emoji: '🌐', title: 'Renda Online', desc: 'Modelos de negócio digitais que geram renda de qualquer lugar do mundo.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="font-bold text-gray-900 dark:text-white mb-1">{title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nossa missão</h2>
        <p>
          Democratizar o acesso ao conhecimento sobre negócios digitais. Acreditamos que a diferença entre quem constrói renda online e quem não constrói não é talento ou sorte — é informação e execução.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Para quem é o ScaleMind?</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Profissionais que querem criar uma renda extra online</li>
          <li>Empreendedores que querem automatizar seus negócios</li>
          <li>Pessoas que querem sair do emprego CLT e trabalhar por conta própria</li>
          <li>Quem quer construir um MicroSaaS ou produto digital</li>
          <li>Investidores iniciantes que querem entender finanças digitais</li>
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors text-center">
            Explorar artigos
          </Link>
          <Link href="/contato" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors text-center">
            Entrar em contato
          </Link>
        </div>
      </div>
    </div>
  )
}
