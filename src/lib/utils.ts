export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
  return `${day} de ${months[month - 1]} de ${year}`
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    MicroSaaS:      'bg-violet-100 text-violet-700',
    Automação:      'bg-sky-100 text-sky-700',
    Finanças:       'bg-emerald-100 text-emerald-700',
    'Renda Online': 'bg-amber-100 text-amber-700',
  }
  return map[category] ?? 'bg-gray-100 text-gray-700'
}
