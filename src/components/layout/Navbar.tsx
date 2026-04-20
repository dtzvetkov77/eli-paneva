'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { services } from '@/data/services'

type Dropdown = 'uslugi' | 'shop' | null

const serviceLinks = services.map(s => ({ label: s.shortTitle, href: `/uslugi/${s.slug}` }))

const shopLinks = [
  { label: 'Всички продукти', href: '/shop' },
  { label: 'МАК карти', href: '/mac-karti' },
  { label: 'Карти и талисмани', href: '/shop/category/карти-и-талисмани' },
  { label: 'Електронни курсове', href: '/shop/category/електронни-курсове' },
  { label: 'Констелации', href: '/shop/category/констелации' },
  { label: 'Онлайн констелации', href: '/shop/category/онлайн-констелации' },
  { label: 'Програми', href: '/shop/category/програми' },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DropdownMenu({ items, onClose }: { items: { label: string; href: string }[]; onClose: () => void }) {
  return (
    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl border border-(--border) shadow-lg py-2 z-50 animate-scale-in">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-(--text-mid) hover:text-(--sage) hover:bg-(--sage-light) transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktop, setDesktop] = useState<Dropdown>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Dropdown>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDesktop(null); setMobileOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const linkCls = [
    'text-xs uppercase tracking-[0.12em] font-medium',
    'text-(--text-muted) hover:text-(--sage) transition-colors duration-200',
    'relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0',
    'after:bg-(--sage) after:transition-all after:duration-300 hover:after:w-full',
  ].join(' ')

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
        <ul className="hidden md:flex items-center gap-7">

          <li>
            <Link href="/" className={linkCls}>Начало</Link>
          </li>

          <li>
            <Link href="/za-men" className={linkCls}>За мен</Link>
          </li>

          {/* Услуги dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setDesktop('uslugi')}
            onMouseLeave={() => setDesktop(null)}
          >
            <button
              className={`${linkCls} flex items-center gap-1`}
              aria-expanded={desktop === 'uslugi'}
              aria-haspopup="true"
            >
              Услуги
              <ChevronIcon open={desktop === 'uslugi'} />
            </button>
            {desktop === 'uslugi' && (
              <DropdownMenu items={serviceLinks} onClose={() => setDesktop(null)} />
            )}
          </li>

          {/* Магазин dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setDesktop('shop')}
            onMouseLeave={() => setDesktop(null)}
          >
            <button
              className={`${linkCls} flex items-center gap-1`}
              aria-expanded={desktop === 'shop'}
              aria-haspopup="true"
            >
              Магазин
              <ChevronIcon open={desktop === 'shop'} />
            </button>
            {desktop === 'shop' && (
              <DropdownMenu items={shopLinks} onClose={() => setDesktop(null)} />
            )}
          </li>

          <li>
            <Link href="/blog" className={linkCls}>Блог</Link>
          </li>

          <li>
            <Link href="/kontakti" className={linkCls}>Контакти</Link>
          </li>
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/kontakti"
          className={[
            'hidden md:inline-flex items-center gap-2 rounded-full',
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
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Затвори меню' : 'Отвори меню'}
          aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={[
          'md:hidden overflow-hidden transition-all duration-400 ease-out',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="bg-(--bg) border-t border-(--border) px-6 pb-6 pt-2">

          <Link href="/" className="flex items-center py-4 text-sm text-(--text-mid) border-b border-(--border-light) transition-colors hover:text-(--sage)" onClick={() => setMobileOpen(false)}>
            Начало
          </Link>

          <Link href="/za-men" className="flex items-center py-4 text-sm text-(--text-mid) border-b border-(--border-light) transition-colors hover:text-(--sage)" onClick={() => setMobileOpen(false)}>
            За мен
          </Link>

          {/* Mobile Услуги */}
          <div className="border-b border-(--border-light)">
            <button
              className="flex items-center justify-between w-full py-4 text-sm text-(--text-mid) hover:text-(--sage) transition-colors"
              onClick={() => setMobileExpanded(mobileExpanded === 'uslugi' ? null : 'uslugi')}
              aria-expanded={mobileExpanded === 'uslugi'}
            >
              Услуги
              <ChevronIcon open={mobileExpanded === 'uslugi'} />
            </button>
            {mobileExpanded === 'uslugi' && (
              <div className="pb-2 pl-4 flex flex-col gap-1">
                {serviceLinks.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2 text-sm text-(--text-muted) hover:text-(--sage) transition-colors"
                    onClick={() => { setMobileOpen(false); setMobileExpanded(null) }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Магазин */}
          <div className="border-b border-(--border-light)">
            <button
              className="flex items-center justify-between w-full py-4 text-sm text-(--text-mid) hover:text-(--sage) transition-colors"
              onClick={() => setMobileExpanded(mobileExpanded === 'shop' ? null : 'shop')}
              aria-expanded={mobileExpanded === 'shop'}
            >
              Магазин
              <ChevronIcon open={mobileExpanded === 'shop'} />
            </button>
            {mobileExpanded === 'shop' && (
              <div className="pb-2 pl-4 flex flex-col gap-1">
                {shopLinks.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2 text-sm text-(--text-muted) hover:text-(--sage) transition-colors"
                    onClick={() => { setMobileOpen(false); setMobileExpanded(null) }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className="flex items-center py-4 text-sm text-(--text-mid) border-b border-(--border-light) transition-colors hover:text-(--sage)" onClick={() => setMobileOpen(false)}>
            Блог
          </Link>

          <Link href="/kontakti" className="flex items-center py-4 text-sm text-(--text-mid) border-b border-(--border-light) transition-colors hover:text-(--sage)" onClick={() => setMobileOpen(false)}>
            Контакти
          </Link>

          <Link
            href="/kontakti"
            className="block mt-5 bg-(--sage) text-white text-center py-3 rounded-full text-xs uppercase tracking-widest hover:bg-(--sage-hover) transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Запази час
          </Link>
        </div>
      </div>
    </header>
  )
}
