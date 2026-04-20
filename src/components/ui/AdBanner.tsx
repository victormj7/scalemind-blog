'use client'

/**
 * COMO USAR O ADSENSE:
 * 1. Acesse https://adsense.google.com e crie sua conta
 * 2. Adicione seu site e aguarde aprovação (7-14 dias)
 * 3. Após aprovação, copie seu Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * 4. Cole no .env.local: NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
 * 5. Crie unidades de anúncio no painel do AdSense e substitua os data-ad-slot abaixo
 */

interface AdBannerProps {
  slot: 'top' | 'mid-content' | 'sidebar' | 'footer'
  className?: string
}

const slotIds: Record<AdBannerProps['slot'], string> = {
  'top':         '1234567890', // substitua pelo seu Ad Slot ID
  'mid-content': '0987654321', // substitua pelo seu Ad Slot ID
  'sidebar':     '1122334455', // substitua pelo seu Ad Slot ID
  'footer':      '5544332211', // substitua pelo seu Ad Slot ID
}

const slotSizes: Record<AdBannerProps['slot'], string> = {
  'top':         'h-24 md:h-28',
  'mid-content': 'h-28 md:h-32',
  'sidebar':     'h-64',
  'footer':      'h-24',
}

export function AdBanner({ slot, className = '' }: AdBannerProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID

  // Em desenvolvimento ou sem ID configurado, mostra placeholder visual
  if (!publisherId || publisherId.includes('XXXXXXXX')) {
    return (
      <div className={`w-full ${slotSizes[slot]} ${className} flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50`}>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          AdSense · {slot} · {slotSizes[slot]}
        </p>
      </div>
    )
  }

  return (
    <div className={`w-full ${slotSizes[slot]} ${className} overflow-hidden`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slotIds[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
