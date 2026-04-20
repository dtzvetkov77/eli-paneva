'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'За мен', href: '/za-men' },
  { label: 'Услуги', href: '/uslugi' },
  { label: 'МАК карти', href: '/mac-karti' },
  { label: 'Магазин', href: '/shop' },
  { label: 'Блог', href: '/blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-(--bg)/98 backdrop-blur-md border-b border-(--border) shadow-sm py-0'
          : 'bg-transparent py-2',
      ].join(' ')}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-(--text-dark) hover:text-(--sage) transition-colors duration-300"
        >
          Ели Панева
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={[
                  'text-xs uppercase tracking-[0.12em] font-medium',
                  'text-(--text-muted) hover:text-(--sage) transition-colors duration-200',
                  'relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0',
                  'after:bg-(--sage) after:transition-all after:duration-300 hover:after:w-full',
                ].join(' ')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/kontakti"
          className={[
            'hidden md:inline-flex items-center gap-2',
            'text-xs uppercase tracking-[0.12em] font-medium',
            'px-6 py-2.5 border border-(--sage) text-(--sage)',
            'hover:bg-(--sage) hover:text-white',
            'transition-all duration-300',
          ].join(' ')}
        >
          Запази час
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-(--text-dark)"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Затвори меню' : 'Отвори меню'}
          aria-expanded={open}
        >
          <span
            className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-px bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={[
          'md:hidden overflow-hidden transition-all duration-400 ease-out',
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="bg-(--bg) border-t border-(--border) px-6 pb-6 pt-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center py-4 text-sm text-(--text-mid) hover:text-(--sage) border-b border-(--border-light) last:border-0 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/kontakti"
            className="block mt-5 bg-(--sage) text-white text-center py-3 text-xs uppercase tracking-widest hover:bg-(--sage-hover) transition-colors"
            onClick={() => setOpen(false)}
          >
            Запази час
          </Link>
        </div>
      </div>
    </header>
  )
}
