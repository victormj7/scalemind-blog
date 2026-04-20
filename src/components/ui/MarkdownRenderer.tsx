'use client'

import { marked } from 'marked'
import { useMemo } from 'react'

marked.setOptions({ gfm: true, breaks: true })

export function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => marked.parse(content) as string, [content])

  return (
    <div
      className="prose-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
