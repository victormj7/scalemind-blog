import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <p className="text-8xl mb-6">🔍</p>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
        Página não encontrada
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        O artigo que você procura não existe ou foi movido.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors">
          Ir para Home
        </Link>
        <Link href="/blog" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors">
          Ver Blog
        </Link>
      </div>
    </div>
  )
}
