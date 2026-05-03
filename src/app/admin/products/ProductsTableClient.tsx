'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface WCCategory { id: number; name: string; slug: string }
interface WCImage { id: number; src: string; alt: string }
interface WCProduct {
  id: number; name: string; slug: string; price: string
  regular_price: string; sale_price: string
  status: string; stock_status: string; featured: boolean
  images: WCImage[]; categories: WCCategory[]
}

const STOCK_CYCLE: Record<string, string> = {
  instock: 'outofstock',
  outofstock: 'onbackorder',
  onbackorder: 'instock',
}
const STOCK_LABEL: Record<string, string> = {
  instock: 'Налично',
  outofstock: 'Изчерпан',
  onbackorder: 'По заявка',
}
const STOCK_STYLE: Record<string, string> = {
  instock: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  outofstock: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  onbackorder: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
}

const BGN_PER_EUR = 1.95583

export default function ProductsTableClient({ initialProducts }: { initialProducts: WCProduct[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [toggling, setToggling] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  )

  async function toggleStock(product: WCProduct) {
    const next = STOCK_CYCLE[product.stock_status] ?? 'instock'
    setToggling(product.id)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_status: next } : p))
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_status: next }),
    })
    setToggling(null)
  }

  async function deleteProduct(id: number) {
    setDeleting(id)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
    setConfirmDelete(null)
    setDeleting(null)
  }

  async function togglePublish(product: WCProduct) {
    const next = product.status === 'publish' ? 'draft' : 'publish'
    setToggling(product.id * 100)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: next } : p))
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setToggling(null)
  }

  const inStock = products.filter(p => p.stock_status === 'instock').length
  const published = products.filter(p => p.status === 'publish').length

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Общо', value: products.length, color: 'text-gray-900' },
          { label: 'Публикувани', value: published, color: 'text-blue-600' },
          { label: 'В наличност', value: inStock, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Търси по име или ID..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-14">Снимка</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Продукт</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Категории</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Цена</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Наличност</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => {
                const img = product.images[0]
                const price = parseFloat(product.price)
                const regular = parseFloat(product.regular_price)
                const hasDiscount = regular > price && regular > 0
                const eur = price > 0 ? (price / BGN_PER_EUR).toFixed(2) : null
                const regularEur = regular > 0 ? (regular / BGN_PER_EUR).toFixed(2) : null

                return (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors group">
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                        {img ? (
                          <Image src={img.src} alt={img.alt || product.name} fill className="object-cover" sizes="40px" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-serif">Е</div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-50">{product.name}</p>
                      <p className="text-xs text-gray-400 font-mono">#{product.id}</p>
                    </td>

                    {/* Categories */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map(c => (
                          <span key={c.id} className="text-xs bg-gray-100 text-gray-500 rounded-md px-1.5 py-0.5">{c.name}</span>
                        ))}
                        {product.categories.length > 2 && (
                          <span className="text-xs text-gray-400">+{product.categories.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-right tabular-nums">
                      {eur ? (
                        <div>
                          <p className="font-semibold text-gray-900">{eur} €</p>
                          {hasDiscount && <p className="text-xs text-gray-400 line-through">{regularEur} €</p>}
                          <p className="text-xs text-gray-400">{price.toFixed(2)} лв</p>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Stock toggle — click to cycle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStock(product)}
                        disabled={toggling === product.id}
                        title="Клик за промяна"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
                          STOCK_STYLE[product.stock_status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                        } ${toggling === product.id ? 'opacity-50' : ''}`}
                      >
                        {STOCK_LABEL[product.stock_status] ?? product.stock_status}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                    </td>

                    {/* Publish toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePublish(product)}
                        disabled={toggling === product.id * 100}
                        title={product.status === 'publish' ? 'Скрий' : 'Публикувай'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          product.status === 'publish'
                            ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                        } ${toggling === product.id * 100 ? 'opacity-50' : ''}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'publish' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        {product.status === 'publish' ? 'Публикуван' : 'Скрит'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          title="Редактирай"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        {confirmDelete === product.id ? (
                          <span className="flex items-center gap-1.5">
                            <button
                              onClick={() => deleteProduct(product.id)}
                              disabled={deleting === product.id}
                              className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleting === product.id ? '...' : 'Да'}
                            </button>
                            <span className="text-gray-300">/</span>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              Не
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Изтрий"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    Няма намерени продукти
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
