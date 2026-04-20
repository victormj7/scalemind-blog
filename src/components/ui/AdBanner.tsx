export function AdBanner({ slot, className = '' }: { slot: string; className?: string }) {
  const sizes: Record<string, string> = {
    'top':         'h-24 md:h-28',
    'mid-content': 'h-28 md:h-32',
    'sidebar':     'h-64',
    'footer':      'h-24',
  }

  return (
    <div className={`w-full ${sizes[slot] ?? 'h-24'} ${className} flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50`}>
      <p className="text-xs text-gray-400 font-mono">Anúncio · {slot}</p>
    </div>
  )
}
