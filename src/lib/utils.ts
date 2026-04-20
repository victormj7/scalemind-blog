export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    MicroSaaS:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    Automação:    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    Finanças:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'Renda Online': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }
  return map[category] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}
