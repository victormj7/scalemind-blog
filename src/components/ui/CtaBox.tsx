import Link from 'next/link'

interface CtaBoxProps {
  variant?: 'light' | 'dark'
  title?: string
  subtitle?: string
  buttonText?: string
  href?: string
}

export function CtaBox({
  variant    = 'light',
  title      = 'Quer uma ideia pronta pra você?',
  subtitle   = 'Use nosso gerador gratuito e receba uma ideia de negócio personalizada com potencial de receita real.',
  buttonText = '🚀 Gerar ideia grátis agora',
  href       = '/ferramentas/gerador-microsaas',
}: CtaBoxProps) {
  if (variant === 'dark') {
    return (
      <div className="my-10 bg-gradient-to-br from-gray-900 to-sky-950 rounded-2xl p-8 text-center text-white">
        <p className="text-3xl mb-3">💡</p>
        <h3 className="text-xl font-extrabold mb-3">{title}</h3>
        <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto leading-relaxed">{subtitle}</p>
        <Link href={href}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 text-base">
          {buttonText}
        </Link>
      </div>
    )
  }

  return (
    <div className="my-10 bg-gradient-to-br from-sky-50 to-violet-50 border-2 border-sky-200 rounded-2xl p-8 text-center">
      <p className="text-3xl mb-3">🚀</p>
      <h3 className="text-xl font-extrabold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">{subtitle}</p>
      <Link href={href}
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-sky-200 hover:-translate-y-0.5 text-base">
        {buttonText}
      </Link>
    </div>
  )
}
