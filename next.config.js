/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Impede clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Impede MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Força HTTPS
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Controla referrer
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Permissões do browser
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Content Security Policy — permite Google Fonts e Unsplash
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://images.unsplash.com https://source.unsplash.com",
      "connect-src 'self'",
      "frame-src https://googleads.g.doubleclick.net",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  // Desabilita o header X-Powered-By que expõe a stack
  poweredByHeader: false,
}

module.exports = nextConfig
