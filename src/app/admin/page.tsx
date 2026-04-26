import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function fetchStats() {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return null
  try {
    const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${base}/orders?per_page=50&orderby=date&order=desc`, { headers: { Authorization: auth }, next: { revalidate: 120 } }),
      fetch(`${base}/products?per_page=1`, { headers: { Authorization: auth }, next: { revalidate: 120 } }),
    ])
    const orders = ordersRes.ok ? await ordersRes.json() : []
    const totalProducts = productsRes.ok ? parseInt(productsRes.headers.get('X-WP-Total') ?? '0') : 0

    const revenue = orders
      .filter((o: { status: string }) => ['processing', 'completed'].includes(o.status))
      .reduce((sum: number, o: { total: string }) => sum + parseFloat(o.total), 0)

    const recentOrders = orders.slice(0, 5)

    return { orders: orders.length, revenue, totalProducts, recentOrders }
  } catch {
    return null
  }
}

const STATUS_BG: Record<string, string> = {
  pending: 'Изчаква', processing: 'Обработва се', 'on-hold': 'На изчакване',
  completed: 'Завършена', cancelled: 'Отказана', refunded: 'Върната', failed: 'Неуспешна',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
  failed: 'bg-red-100 text-red-700',
}

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const stats = await fetchStats()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Добре дошла, Ели</h1>
        <p className="text-sm text-gray-500 mt-1">Преглед на магазина</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Поръчки', value: stats.orders, href: '/admin/orders' },
            { label: 'Приходи', value: `${stats.revenue.toFixed(0)} лв`, href: '/admin/orders' },
            { label: 'Продукти', value: stats.totalProducts, href: '/admin/products' },
            { label: 'Нови тази седмица', value: stats.recentOrders.length, href: '/admin/orders' },
          ].map(s => (
            <Link key={s.label} href={s.href} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-400 transition-colors block">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-3xl font-semibold text-gray-900 tabular-nums">{s.value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        {stats && stats.recentOrders.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Последни поръчки</h2>
              <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">Виж всички</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {stats.recentOrders.map((o: {
                id: number; number: string; status: string; total: string;
                billing: { first_name: string; last_name: string }; date_created: string
              }) => (
                <div key={o.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">#{o.number} — {o.billing.first_name} {o.billing.last_name}</p>
                    <p className="text-xs text-gray-400">{new Date(o.date_created).toLocaleDateString('bg-BG')}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${STATUS_COLOR[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_BG[o.status] ?? o.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900 tabular-nums shrink-0">{parseFloat(o.total).toFixed(2)} лв</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Бързи връзки</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: 'Всички поръчки', href: '/admin/orders' },
              { label: 'Добави продукт', href: '/admin/products' },
              { label: 'Управление снимки', href: '/admin/images' },
              { label: 'Категории', href: '/admin/categories' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                {l.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
