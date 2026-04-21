'use client'

import { useEffect, useState } from 'react'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

export function MarkdownRenderer({ content }: { content: string }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    setHtml(marked.parse(content) as string)
  }, [content])

  if (!html) return null

  return (
    <div
      className="prose-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
