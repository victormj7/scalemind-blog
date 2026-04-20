// Renderizador simples de Markdown → HTML sem dependências pesadas.
// Para suporte a MDX completo no futuro, substitua por @next/mdx ou next-mdx-remote.

interface MarkdownProps {
  content: string
}

function parseMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-white">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 class="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 class="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Tables
    .replace(/^\|(.+)\|$/gm, (line) => {
      if (line.includes('---')) return ''
      const cells = line.split('|').filter(Boolean).map(c => c.trim())
      const isHeader = false
      const tag = isHeader ? 'th' : 'td'
      return `<tr>${cells.map(c => `<${tag} class="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">${c}</${tag}>`).join('')}</tr>`
    })
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300">$1</li>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-brand-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200 dark:border-gray-700" />')
    // Paragraphs (linhas que não são tags HTML)
    .replace(/^(?!<[a-z]).+$/gm, (line) => {
      if (!line.trim()) return ''
      return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed">${line}</p>`
    })
    // Wrap table rows
    .replace(/(<tr>[\s\S]+?<\/tr>)/g, '<div class="overflow-x-auto my-6"><table class="w-full border-collapse">$1</table></div>')
    // Wrap list items
    .replace(/(<li[\s\S]+?<\/li>\n?)+/g, (match) => `<ul class="my-4 space-y-1">${match}</ul>`)
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-600 dark:text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
}

export function MarkdownRenderer({ content }: MarkdownProps) {
  return (
    <div
      className="prose-content max-w-none space-y-2"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
