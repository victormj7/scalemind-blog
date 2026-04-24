import Link from 'next/link'

const CATEGORIES = ['MicroSaaS', 'Automação', 'Finanças', 'Renda Online']

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      {/* AdSense Footer */}
      <div className="max-w-6xl mx-auto px-4 py-3 border-b border-gray-800">
        <div className="h-16 flex items-center justify-center rounded-lg border border-dashed border-gray-700 text-xs text-gray-600 font-mono">
          AdSense · Footer Banner · 728x90
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="w-7 h-7 rounded-md bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">S</span>
            ScaleMind
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Conteúdo sobre MicroSaaS, automação, finanças digitais e renda online para quem quer escalar sua vida financeira.
          </p>
        </div>

        {/* Categorias */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Categorias</h3>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link href={`/blog?categoria=${encodeURIComponent(cat)}`}
                  className="text-sm text-gray-400 hover:text-sky-400 transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/sobre',                label: 'Sobre o Blog' },
              { href: '/contato',              label: 'Contato' },
              { href: '/politica-privacidade', label: 'Política de Privacidade' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-gray-400 hover:text-sky-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
        <p>© 2026 ScaleMind. Todos os direitos reservados.</p>
        <p>Feito com Next.js + Tailwind CSS</p>
      </div>
    </footer>
  )
}
