'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'За мен', href: '/za-men' },
  { label: 'Услуги', href: '/uslugi' },
  { label: 'МАК карти', href: '/mac-karti' },
  { label: 'Магазин', href: '/shop' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакти', href: '/kontakti' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-wide text-[var(--text-dark)]">
          Ели Панева
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--sage)] transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/kontakti"
          className="hidden md:inline-flex bg-[var(--sage)] text-white text-sm px-5 py-2 hover:bg-[var(--text-dark)] transition-colors tracking-wide"
        >
          Запази час
        </Link>
        <button
          className="md:hidden p-2 text-[var(--text-dark)]"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-[var(--bg)] border-b border-[var(--border)] px-6 pb-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm text-[var(--text-muted)] hover:text-[var(--sage)] border-b border-[var(--border)] last:border-0"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/kontakti"
            className="block mt-4 bg-[var(--sage)] text-white text-center py-3 text-sm"
            onClick={() => setOpen(false)}
          >
            Запази час
          </Link>
        </div>
      )}
    </header>
  )
}
