import { categoryColor } from '@/lib/utils'

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(category)}`}>
      {category}
    </span>
  )
}
