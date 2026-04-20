interface MarkdownProps {
  content: string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseMarkdown(md: string): string {
  const lines = md.split('\n')
  const result: string[] = []
  let inTable = false
  let tableRows: string[] = []

  function flushTable() {
    if (tableRows.length > 0) {
      result.push(`<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm">${tableRows.join('')}</table></div>`)
      tableRows = []
      inTable = false
    }
  }

  function parseLine(line: string): string {
    return line
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" class="text-brand-600 dark:text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\[([^\]]+)\]\(\/([^)]*)\)/g, '<a href="/$2" class="text-brand-600 dark:text-brand-400 hover:underline">$1</a>')
  }

  for (const line of lines) {
    // Table row
    if (/^\|.+\|$/.test(line)) {
      if (line.includes('---')) continue
      inTable = true
      const cells = line.split('|').filter(Boolean).map(c => c.trim())
      tableRows.push(`<tr>${cells.map(c => `<td class="border border-gray-200 dark:border-gray-700 px-4 py-2">${parseLine(c)}</td>`).join('')}</tr>`)
      continue
    }

    if (inTable) flushTable()

    // Headings
    if (/^### (.+)$/.test(line)) {
      result.push(`<h3 class="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-white">${parseLine(line.slice(4))}</h3>`)
    } else if (/^## (.+)$/.test(line)) {
      result.push(`<h2 class="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">${parseLine(line.slice(3))}</h2>`)
    } else if (/^# (.+)$/.test(line)) {
      result.push(`<h1 class="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">${parseLine(line.slice(2))}</h1>`)
    // Blockquote
    } else if (/^> (.+)$/.test(line)) {
      result.push(`<blockquote class="border-l-4 border-brand-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">${parseLine(line.slice(2))}</blockquote>`)
    // HR
    } else if (/^---$/.test(line)) {
      result.push('<hr class="my-8 border-gray-200 dark:border-gray-700" />')
    // Unordered list
    } else if (/^- (.+)$/.test(line)) {
      result.push(`<li class="ml-5 list-disc text-gray-700 dark:text-gray-300 mb-1">${parseLine(line.slice(2))}</li>`)
    // Ordered list
    } else if (/^\d+\. (.+)$/.test(line)) {
      result.push(`<li class="ml-5 list-decimal text-gray-700 dark:text-gray-300 mb-1">${parseLine(line.replace(/^\d+\. /, ''))}</li>`)
    // Bold line (standalone)
    } else if (/^\*\*(.+)\*\*$/.test(line)) {
      result.push(`<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${parseLine(line)}</p>`)
    // Empty line
    } else if (line.trim() === '') {
      result.push('')
    // Paragraph
    } else {
      result.push(`<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${parseLine(line)}</p>`)
    }
  }

  if (inTable) flushTable()

  // Wrap consecutive <li> in <ul> or <ol>
  return result.join('\n')
    .replace(/(<li class="ml-5 list-disc[^"]*"[^>]*>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul class="my-4">${m}</ul>`)
    .replace(/(<li class="ml-5 list-decimal[^"]*"[^>]*>[\s\S]*?<\/li>\n?)+/g, (m) => `<ol class="my-4">${m}</ol>`)
}

export function MarkdownRenderer({ content }: MarkdownProps) {
  return (
    <div
      className="prose-content max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
