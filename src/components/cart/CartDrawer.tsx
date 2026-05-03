'use client'
import { useCart } from './CartContext'
import { bgnToEur, formatEur } from '@/lib/currency'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, open, closeCart, removeItem, setQty, total, count } = useCart()
  const eur = bgnToEur(total)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-400 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Количка"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-(--border)">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl text-(--text-dark)">Количка</span>
            {count > 0 && (
              <span className="bg-(--gold) text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-(--bg-warm) transition-colors text-(--text-muted)"
            aria-label="Затвори количката"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-(--bg-warm) flex items-center justify-center">
                <CartIcon className="w-7 h-7 text-(--text-muted)" />
              </div>
              <p className="font-serif text-lg text-(--text-dark)">Количката е празна</p>
              <p className="text-sm text-(--text-muted)">Добави продукти от магазина</p>
              <button
                onClick={closeCart}
                className="mt-2 text-sm text-(--sage) border border-(--sage) px-6 py-2 rounded-full hover:bg-(--sage) hover:text-white transition-all duration-200"
              >
                Към магазина
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-(--border)">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 px-6 py-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-(--bg-warm) shrink-0 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-xl text-(--sage)/30">Е</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-(--text-dark) line-clamp-2 leading-snug mb-2">{item.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-(--border) rounded-full overflow-hidden">
                        <button
                          onClick={() => setQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-(--text-muted) hover:text-(--sage) transition-colors text-lg leading-none"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-(--text-dark)">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-(--text-muted) hover:text-(--sage) transition-colors text-lg leading-none"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-(--text-dark) tabular-nums">
                          {formatEur(bgnToEur(item.priceBgn * item.quantity))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 self-start mt-1 text-(--text-muted) hover:text-red-500 transition-colors"
                    aria-label="Премахни"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-(--border) px-6 py-6 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-(--text-muted) uppercase tracking-widest">Сума</span>
              <p className="font-serif text-2xl text-(--text-dark)">{eur.toFixed(2)} €</p>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center bg-(--text-dark) text-white py-4 rounded-2xl text-sm font-medium uppercase tracking-[0.12em] hover:bg-(--sage) transition-all duration-300"
            >
              Към плащане
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-(--text-muted) text-xs hover:text-(--sage) transition-colors py-1"
            >
              Продължи пазаруването
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}
