'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { href: '/',        label: 'Home' },
  { href: '/blog',    label: 'Blog' },
  { href: '/sobre',   label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-sm font-black">S</span>
          <span className="text-gray-900">Scale<span className="text-sky-600">Mind</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
