'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { services } from '@/data/services'
import CartIconButton from '@/components/cart/CartIconButton'

type Dropdown = 'uslugi' | 'shop' | null

const serviceLinks = services.map(s => ({ label: s.shortTitle, href: `/uslugi/${s.slug}` }))

const shopLinks = [
  { label: 'Всички продукти', href: '/shop' },
  { label: 'МАК карти', href: '/mac-karti' },
  { label: 'Карти и защити', href: '/shop/category/karti-i-talismani' },
  { label: 'Електронни курсове', href: '/shop/category/elektronni-kursove' },
  { label: 'Констелации', href: '/shop/category/konstelatsii' },
  { label: 'Онлайн констелации', href: '/shop/category/onlayn-konstelatsii' },
  { label: 'Програми', href: '/shop/category/programi' },
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

interface DropdownMenuProps {
  items: { label: string; href: string }[]
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function DropdownMenu({ items, onClose, onMouseEnter, onMouseLeave }: DropdownMenuProps) {
  return (
    // pt-2 bridges the visual gap so mouse doesn't leave the hover zone
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-60 bg-white rounded-2xl border border-(--border) shadow-xl py-2 animate-scale-in">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block px-5 py-2.5 text-sm text-(--text-mid) hover:text-(--sage) hover:bg-(--sage-light) transition-colors cursor-pointer"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktop, setDesktop] = useState<Dropdown>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Dropdown>(null)
  const [scrolled, setScrolled] = useState(false)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const openDropdown = useCallback((key: Dropdown) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setDesktop(key)
  }, [])

  const scheduleClose = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setDesktop(null), 180)
  }, [])

  const linkCls = [
    'text-xs uppercase tracking-[0.12em] font-medium cursor-pointer',
    'text-(--text-muted) hover:text-(--sage) transition-colors duration-200',
    'relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0',
    'after:bg-(--sage) after:transition-all after:duration-300 hover:after:w-full',
  ].join(' ')

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-(--bg)/98 backdrop-blur-md border-b border-(--border) shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="hover:opacity-75 transition-opacity duration-300 shrink-0">
          <Image
            src="/logo.webp"
            alt="Ели Панева"
            width={500}
            height={500}
            className="h-[110px] w-auto"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">

          <li><Link href="/" className={linkCls}>Начало</Link></li>
          <li><Link href="/za-men" className={linkCls}>За мен</Link></li>

          {/* Услуги dropdown */}
          <li
            className="relative"
            onMouseEnter={() => openDropdown('uslugi')}
            onMouseLeave={scheduleClose}
          >
            <button
              className={`${linkCls} flex items-center gap-1`}
              aria-expanded={desktop === 'uslugi'}
              aria-haspopup="true"
            >
              Услуги <ChevronIcon open={desktop === 'uslugi'} />
            </button>
            {desktop === 'uslugi' && (
              <DropdownMenu
                items={serviceLinks}
                onClose={() => setDesktop(null)}
                onMouseEnter={() => openDropdown('uslugi')}
                onMouseLeave={scheduleClose}
              />
            )}
          </li>

          {/* Магазин dropdown */}
          <li
            className="relative"
            onMouseEnter={() => openDropdown('shop')}
            onMouseLeave={scheduleClose}
          >
            <button
              className={`${linkCls} flex items-center gap-1`}
              aria-expanded={desktop === 'shop'}
              aria-haspopup="true"
            >
              Магазин <ChevronIcon open={desktop === 'shop'} />
            </button>
            {desktop === 'shop' && (
              <DropdownMenu
                items={shopLinks}
                onClose={() => setDesktop(null)}
                onMouseEnter={() => openDropdown('shop')}
                onMouseLeave={scheduleClose}
              />
            )}
          </li>

          <li><Link href="/blog" className={linkCls}>Блог</Link></li>
          <li><Link href="/kontakti" className={linkCls}>Контакти</Link></li>
        </ul>

        {/* Desktop CTA + Cart */}
        <div className="hidden md:flex items-center gap-3">
          <CartIconButton />
          <Link
            href="/kontakti"
            className="inline-flex items-center rounded-full bg-(--text-dark) text-white text-xs uppercase tracking-[0.12em] font-medium px-6 py-2.5 hover:bg-(--sage) transition-all duration-300"
          >
            Запази час
          </Link>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <CartIconButton />
          <button
            className="flex flex-col gap-1.5 p-2 text-(--text-dark) cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Затвори меню' : 'Отвори меню'}
          aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={['md:hidden overflow-hidden transition-all duration-400 ease-out', mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'].join(' ')}>
        <div className="bg-(--bg) border-t border-(--border) px-6 pb-6 pt-2">

          {[{ label: 'Начало', href: '/' }, { label: 'За мен', href: '/za-men' }, { label: 'Блог', href: '/blog' }, { label: 'Контакти', href: '/kontakti' }].map(link => (
            <Link key={link.href} href={link.href} className="flex items-center py-4 text-sm text-(--text-mid) border-b border-(--border-light) hover:text-(--sage) transition-colors" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}

          {/* Mobile Услуги accordion */}
          <div className="border-b border-(--border-light)">
            <button
              className="flex items-center justify-between w-full py-4 text-sm text-(--text-mid) hover:text-(--sage) transition-colors cursor-pointer"
              onClick={() => setMobileExpanded(mobileExpanded === 'uslugi' ? null : 'uslugi')}
            >
              Услуги <ChevronIcon open={mobileExpanded === 'uslugi'} />
            </button>
            {mobileExpanded === 'uslugi' && (
              <div className="pb-3 pl-4 flex flex-col">
                {serviceLinks.map(item => (
                  <Link key={item.href} href={item.href} className="py-2 text-sm text-(--text-muted) hover:text-(--sage) transition-colors" onClick={() => { setMobileOpen(false); setMobileExpanded(null) }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Магазин accordion */}
          <div className="border-b border-(--border-light)">
            <button
              className="flex items-center justify-between w-full py-4 text-sm text-(--text-mid) hover:text-(--sage) transition-colors cursor-pointer"
              onClick={() => setMobileExpanded(mobileExpanded === 'shop' ? null : 'shop')}
            >
              Магазин <ChevronIcon open={mobileExpanded === 'shop'} />
            </button>
            {mobileExpanded === 'shop' && (
              <div className="pb-3 pl-4 flex flex-col">
                {shopLinks.map(item => (
                  <Link key={item.href} href={item.href} className="py-2 text-sm text-(--text-muted) hover:text-(--sage) transition-colors" onClick={() => { setMobileOpen(false); setMobileExpanded(null) }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/kontakti" className="block mt-5 bg-(--sage) text-white text-center py-3 rounded-full text-xs uppercase tracking-widest hover:bg-(--sage-hover) transition-colors" onClick={() => setMobileOpen(false)}>
            Запази час
          </Link>
        </div>
      </div>
    </header>
  )
}
