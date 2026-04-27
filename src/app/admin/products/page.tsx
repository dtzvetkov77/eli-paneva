import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface WCProduct {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  status: string
  stock_status: string
  featured: boolean
  images: Array<{ id: number; src: string; alt: string }>
  categories: Array<{ id: number; name: string; slug: string }>
}

async function fetchProducts(): Promise<{ products: WCProduct[]; error?: string }> {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return { products: [], error: 'WooCommerce credentials not configured (WOOCOMMERCE_KEY / WOOCOMMERCE_SECRET / WC_API_URL missing)' }
  try {
    const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
    const pages: WCProduct[] = []
    let page = 1
    while (true) {
      const res = await fetch(`${base}/products?per_page=100&page=${page}&orderby=title&order=asc`, {
        headers: { Authorization: auth },
        cache: 'no-store',
      })
      if (!res.ok) return { products: [], error: `WooCommerce API error: ${res.status} ${res.statusText}` }
      const batch: WCProduct[] = await res.json()
      pages.push(...batch)
      if (batch.length < 100) break
      page++
    }
    return { products: pages }
  } catch (e) {
    return { products: [], error: e instanceof Error ? e.message : String(e) }
  }
}

const STOCK_LABEL: Record<string, string> = {
  instock: 'В наличност',
  outofstock: 'Изчерпан',
  onbackorder: 'По заявка',
}
const STOCK_COLOR: Record<string, string> = {
  instock: 'bg-green-50 text-green-700 border-green-200',
  outofstock: 'bg-red-50 text-red-700 border-red-200',
  onbackorder: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export default async function ProductsPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const { products, error } = await fetchProducts()

  const inStock = products.filter(p => p.stock_status === 'instock').length
  const published = products.filter(p => p.status === 'publish').length

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Назад</a>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-semibold text-gray-900">Продукти</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
        >
          + Нов продукт
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 font-mono">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Общо продукти</p>
          <p className="text-3xl font-semibold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Публикувани</p>
          <p className="text-3xl font-semibold text-gray-900">{published}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">В наличност</p>
          <p className="text-3xl font-semibold text-gray-900">{inStock}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                <th className="text-left px-4 py-4 font-medium w-16">Снимка</th>
                <th className="text-left px-4 py-4 font-medium">Наименование</th>
                <th className="text-left px-4 py-4 font-medium">Категории</th>
                <th className="text-right px-4 py-4 font-medium">Цена</th>
                <th className="text-left px-4 py-4 font-medium">Наличност</th>
                <th className="text-left px-4 py-4 font-medium">Статус</th>
                <th className="text-right px-4 py-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(product => {
                const img = product.images[0]
                const price = parseFloat(product.price)
                const regular = parseFloat(product.regular_price)
                const hasDiscount = regular > price && regular > 0
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                        {img ? (
                          <Image src={img.src} alt={img.alt || product.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 line-clamp-2 max-w-xs">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">#{product.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map(c => (
                          <span key={c.id} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{c.name}</span>
                        ))}
                        {product.categories.length > 2 && (
                          <span className="text-xs text-gray-400">+{product.categories.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {price > 0 ? (
                        <div>
                          <span className="font-medium text-gray-900">{(price / 1.95583).toFixed(2)} €</span>
                          {hasDiscount && (
                            <span className="block text-xs text-gray-400 line-through">{(regular / 1.95583).toFixed(2)} €</span>
                          )}
                        </div>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STOCK_COLOR[product.stock_status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {STOCK_LABEL[product.stock_status] ?? product.stock_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${product.status === 'publish' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {product.status === 'publish' ? 'Публикуван' : 'Скрит'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400 transition-colors"
                      >
                        Редактирай
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
