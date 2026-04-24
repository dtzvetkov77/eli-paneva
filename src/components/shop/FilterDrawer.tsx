'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Category { id: number; name: string; slug: string }

export default function FilterDrawer({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile filter trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-(--border) text-sm text-(--text-mid) hover:border-(--sage) hover:text-(--sage) transition-all duration-200 mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Филтри
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-350 ease-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-(--border)">
          <span className="font-serif text-xl text-(--text-dark)">Филтри</span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-(--bg-warm) transition-colors text-(--text-muted)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* All */}
          <div>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-(--sage) hover:underline"
            >
              Всички продукти
            </Link>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-4">Категории</h3>
              <ul className="space-y-3">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop/category/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm text-(--text-mid) hover:text-(--sage) transition-colors flex items-center justify-between group"
                    >
                      <span>{cat.name}</span>
                      <span className="text-(--text-muted) group-hover:text-(--sage) transition-colors">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Format */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-4">Формат</h3>
            <ul className="space-y-3">
              {['Онлайн', 'Физически продукт', 'На живо'].map(f => (
                <li key={f}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="w-4 h-4 rounded border border-(--border) group-hover:border-(--sage) transition-colors shrink-0" />
                    <span className="text-sm text-(--text-mid)">{f}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Topic */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-4">Тема</h3>
            <ul className="space-y-3">
              {['Констелации', 'МАК карти', 'Тревожност', 'Медитации', 'Стрес'].map(f => (
                <li key={f}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="w-4 h-4 rounded border border-(--border) group-hover:border-(--sage) transition-colors shrink-0" />
                    <span className="text-sm text-(--text-mid)">{f}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-6 py-4">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-(--sage) text-white py-3 rounded-xl text-sm font-medium hover:bg-(--text-dark) transition-colors"
          >
            Покажи резултатите
          </button>
        </div>
      </aside>
    </>
  )
}
