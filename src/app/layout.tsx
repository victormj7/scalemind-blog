import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL  ?? 'https://scalemind.blog'
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? ''

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'ScaleMind — MicroSaaS, Automação e Renda Online',
    template: '%s | ScaleMind',
  },
  description: 'Conteúdo prático sobre MicroSaaS, automação no-code, finanças digitais e renda online para quem quer escalar sua vida financeira.',
  keywords: ['microsaas', 'automação', 'renda online', 'renda passiva', 'finanças digitais', 'no-code', 'inteligência artificial'],
  authors: [{ name: 'ScaleMind' }],
  creator: 'ScaleMind',
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Google AdSense — substitua pelo seu Publisher ID em .env.local */}
        {ADSENSE_ID && !ADSENSE_ID.includes('XXXXXXXX') && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
