'use client'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import type { WCProduct, WCCategory } from '@/lib/woocommerce'

const BGN_PER_EUR = 1.95583

const PRICE_RANGES = [
  { label: 'Всички цени', min: 0, max: Infinity },
  { label: 'До 30 лв', min: 0, max: 30 },
  { label: '30 – 80 лв', min: 30, max: 80 },
  { label: '80 – 150 лв', min: 80, max: 150 },
  { label: 'Над 150 лв', min: 150, max: Infinity },
]

interface Props {
  products: WCProduct[]
  categories: WCCategory[]
}

export default function ShopClient({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceRange]
    return products.filter(p => {
      const price = parseFloat(p.price) || 0
      const inCategory = activeCategory === 'all' || p.categories.some(c => c.slug === activeCategory)
      const inPrice = price >= range.min && price <= range.max
      return inCategory && inPrice
    })
  }, [products, activeCategory, priceRange])

  const activeLabel = categories.find(c => c.slug === activeCategory)?.name ?? 'Всички'

  function Sidebar() {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-3">Категории</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => { setActiveCategory('all'); setMobileOpen(false) }}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between group ${
                  activeCategory === 'all'
                    ? 'bg-(--sage-light) text-(--text-dark) font-medium'
                    : 'text-(--text-muted) hover:text-(--text-dark) hover:bg-(--sage-light)'
                }`}
              >
                <span>Всички продукти</span>
                {activeCategory === 'all' && (
                  <span className="text-xs text-(--text-muted)">{products.length}</span>
                )}
              </button>
            </li>
            {categories.map(cat => {
              const count = products.filter(p => p.categories.some(c => c.slug === cat.slug)).length
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => { setActiveCategory(cat.slug); setMobileOpen(false) }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      activeCategory === cat.slug
                        ? 'bg-(--sage-light) text-(--text-dark) font-medium'
                        : 'text-(--text-muted) hover:text-(--text-dark) hover:bg-(--sage-light)'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-(--text-muted)">{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-3">Ценови диапазон</p>
          <ul className="space-y-1">
            {PRICE_RANGES.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => { setPriceRange(i); setMobileOpen(false) }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    priceRange === i
                      ? 'bg-(--sage-light) text-(--text-dark) font-medium'
                      : 'text-(--text-muted) hover:text-(--text-dark) hover:bg-(--sage-light)'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                    priceRange === i ? 'bg-(--gold)' : 'bg-(--border)'
                  }`} />
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-(--bg-warm) rounded-2xl p-5 border border-(--border)">
          <p className="text-sm text-(--text-dark) font-medium mb-1">Нужна помощ?</p>
          <p className="text-xs text-(--text-muted) mb-3 leading-relaxed">Свържи се с Ели за препоръка.</p>
          <a
            href="/kontakti"
            className="block text-center text-xs font-medium text-(--sage) border border-(--sage) rounded-full px-4 py-2 hover:bg-(--sage) hover:text-white transition-all duration-200"
          >
            Запитай
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile filter bar */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-(--border) text-sm text-(--text-mid) hover:border-(--sage) transition-all"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Филтри
        </button>
        {(activeCategory !== 'all' || priceRange !== 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-(--sage-light) text-(--text-dark) px-3 py-1.5 rounded-full border border-(--border)">
                {activeLabel}
                <button onClick={() => setActiveCategory('all')} className="text-(--text-muted) hover:text-(--text-dark)">×</button>
              </span>
            )}
            {priceRange !== 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-(--sage-light) text-(--text-dark) px-3 py-1.5 rounded-full border border-(--border)">
                {PRICE_RANGES[priceRange].label}
                <button onClick={() => setPriceRange(0)} className="text-(--text-muted) hover:text-(--text-dark)">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <Sidebar />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Active filters + count */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-(--sage-light) text-(--text-dark) px-3 py-1.5 rounded-full border border-(--border)">
                  {activeLabel}
                  <button onClick={() => setActiveCategory('all')} className="text-(--text-muted) hover:text-(--text-dark) ml-0.5">×</button>
                </span>
              )}
              {priceRange !== 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-(--sage-light) text-(--text-dark) px-3 py-1.5 rounded-full border border-(--border)">
                  {PRICE_RANGES[priceRange].label}
                  <button onClick={() => setPriceRange(0)} className="text-(--text-muted) hover:text-(--text-dark) ml-0.5">×</button>
                </span>
              )}
            </div>
            <p className="text-xs text-(--text-muted) shrink-0">
              {filtered.length} {filtered.length === 1 ? 'продукт' : 'продукта'}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-(--text-dark) mb-2">Няма намерени продукти</p>
              <button
                onClick={() => { setActiveCategory('all'); setPriceRange(0) }}
                className="mt-4 text-sm text-(--sage) hover:underline"
              >
                Изчисти филтрите
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-(--border)">
          <span className="font-serif text-xl text-(--text-dark)">Филтри</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-(--bg-warm) text-(--text-muted) transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Sidebar />
        </div>
        <div className="border-t border-(--border) px-6 py-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-full bg-(--sage) text-white py-3 rounded-xl text-sm font-medium hover:bg-(--text-dark) transition-colors"
          >
            Покажи {filtered.length} {filtered.length === 1 ? 'продукт' : 'продукта'}
          </button>
        </div>
      </aside>
    </>
  )
}
