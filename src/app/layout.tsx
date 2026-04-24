import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'ScaleMind — MicroSaaS, Automação e Renda Online',
    template: '%s | ScaleMind',
  },
  description: 'Conteúdo prático sobre MicroSaaS, automação no-code, finanças digitais e renda online para quem quer escalar sua vida financeira.',
  keywords: ['microsaas', 'automação', 'renda online', 'renda passiva', 'finanças digitais', 'no-code'],
  authors: [{ name: 'ScaleMind' }],
  openGraph: {
    type:        'website',
    locale:      'pt_BR',
    url:         SITE_URL,
    siteName:    'ScaleMind',
    title:       'ScaleMind — MicroSaaS, Automação e Renda Online',
    description: 'Conteúdo prático sobre MicroSaaS, automação no-code, finanças digitais e renda online.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'ScaleMind' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'ScaleMind — MicroSaaS, Automação e Renda Online',
    description: 'Conteúdo prático sobre MicroSaaS, automação no-code, finanças digitais e renda online.',
    images:      ['/og-default.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  verification: {
    google: 'xpblT0xcvD31AS8nWHJFNR6XtgJtYLxwiapqbQMJ-Jo',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
