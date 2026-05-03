import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readProducts } from '@/lib/supabase-store'
import productsData from '@/data/shop/products.json'
import type { WCProduct } from '@/lib/woocommerce'

async function fetchOrders() {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return []
  try {
    const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
    const res = await fetch(`${base}/orders?per_page=8&orderby=date&order=desc`, {
      headers: { Authorization: auth }, next: { revalidate: 120 },
    })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Изчаква', processing: 'Обработва се', 'on-hold': 'На изчакване',
  completed: 'Завършена', cancelled: 'Отказана', refunded: 'Върната', failed: 'Неуспешна',
}
const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-400', processing: 'bg-blue-400', completed: 'bg-emerald-400',
  cancelled: 'bg-gray-400', failed: 'bg-red-400', 'on-hold': 'bg-orange-400',
}

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const [products, orders] = await Promise.all([
    readProducts(productsData as WCProduct[]),
    fetchOrders(),
  ])

  const inStock = products.filter(p => p.stock_status === 'instock').length
  const published = products.filter(p => p.status === 'publish').length
  const outOfStock = products.filter(p => p.stock_status === 'outofstock').length
  const featured = products.filter(p => p.featured).length
  const revenue = orders
    .filter((o: { status: string }) => ['processing', 'completed'].includes(o.status))
    .reduce((sum: number, o: { total: string }) => sum + parseFloat(o.total), 0)
  const revenueEur = (revenue / 1.95583).toFixed(0)

  const stats = [
    {
      label: 'Продукти',
      value: products.length,
      sub: `${published} публикувани · ${products.length - published} скрити`,
      href: '/admin/products',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
      ),
    },
    {
      label: 'В наличност',
      value: inStock,
      sub: outOfStock > 0 ? `${outOfStock} изчерпани` : 'Всички налични',
      href: '/admin/products',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
      ),
    },
    {
      label: 'Поръчки',
      value: orders.length,
      sub: 'последни 8',
      href: '/admin/orders',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      ),
    },
    {
      label: 'Приходи',
      value: `${revenueEur} €`,
      sub: `${revenue.toFixed(0)} лв`,
      href: '/admin/orders',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ),
      gold: true,
    },
  ]

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-gray-900">Добре дошла, Ели</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <span className={`${s.gold ? 'text-[#C8A96E]' : 'text-gray-300'} group-hover:text-gray-400 transition-colors`}>
                {s.icon}
              </span>
            </div>
            <p className={`text-2xl font-semibold tabular-nums ${s.gold ? 'text-[#C8A96E]' : 'text-gray-900'}`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Product breakdown bar */}
      {products.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">Разбивка по продукти</p>
            <Link href="/admin/products" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Управлявай →</Link>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-3">
            <div className="bg-gray-900 rounded-l-full" style={{ width: `${(published / products.length) * 100}%` }} title={`${published} публикувани`} />
            <div className="bg-gray-300" style={{ width: `${((products.length - published) / products.length) * 100}%` }} title={`${products.length - published} скрити`} />
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-900 inline-block" />{published} публикувани</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />{products.length - published} скрити</span>
            {featured > 0 && <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C8A96E] inline-block" />{featured} препоръчани</span>}
            {outOfStock > 0 && <span className="flex items-center gap-1.5 text-amber-500"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{outOfStock} изчерпани</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Последни поръчки</h2>
            <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Всички →
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Няма поръчки</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map((o: {
                id: number; number: string; status: string; total: string;
                billing: { first_name: string; last_name: string }; date_created: string
              }) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[o.status] ?? 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      #{o.number} · {o.billing.first_name} {o.billing.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {STATUS_LABEL[o.status] ?? o.status} · {new Date(o.date_created).toLocaleDateString('bg-BG')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums shrink-0">
                    {(parseFloat(o.total) / 1.95583).toFixed(2)} €
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Бърз достъп</h2>
          </div>
          <div className="p-3 space-y-1">
            {[
              { label: 'Всички поръчки', href: '/admin/orders', desc: `${orders.length} поръчки` },
              { label: 'Управление продукти', href: '/admin/products', desc: `${products.length} продукта` },
              { label: 'Категории', href: '/admin/categories', desc: 'Редактирай' },
              { label: 'Снимки', href: '/admin/images', desc: 'Качи/управлявай' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-sm">{l.label}</p>
                  <p className="text-xs text-gray-400">{l.desc}</p>
                </div>
                <svg className="text-gray-300 group-hover:text-gray-500 transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
