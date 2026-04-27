import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { list } from '@vercel/blob'

interface NormalizedOrder {
  id: string
  number: string
  status: string
  date: string
  total: number
  customerName: string
  email: string
  phone: string
  items: Array<{ name: string; quantity: number }>
  source: 'wc' | 'blob'
}

const STATUS_BG: Record<string, string> = {
  pending: 'Изчаква',
  processing: 'Обработва се',
  'on-hold': 'На изчакване',
  completed: 'Завършена',
  cancelled: 'Отказана',
  refunded: 'Върната',
  failed: 'Неуспешна',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  'on-hold': 'bg-orange-50 text-orange-700 border-orange-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  refunded: 'bg-gray-100 text-gray-500 border-gray-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
}

async function fetchWCOrders(): Promise<NormalizedOrder[]> {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return []
  try {
    const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
    const res = await fetch(`${base}/orders?per_page=50&orderby=date&order=desc`, {
      headers: { Authorization: auth },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const orders = await res.json()
    return orders.map((o: {
      id: number; number: string; status: string; date_created: string; total: string;
      billing: { first_name: string; last_name: string; email: string; phone: string };
      line_items: Array<{ name: string; quantity: number }>;
    }) => ({
      id: String(o.id),
      number: o.number,
      status: o.status,
      date: o.date_created,
      total: parseFloat(o.total),
      customerName: `${o.billing.first_name} ${o.billing.last_name}`,
      email: o.billing.email,
      phone: o.billing.phone,
      items: o.line_items.map(i => ({ name: i.name, quantity: i.quantity })),
      source: 'wc' as const,
    }))
  } catch {
    return []
  }
}

async function fetchBlobOrders(): Promise<NormalizedOrder[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []
  try {
    const { blobs } = await list({ prefix: 'orders/', token })
    const results = await Promise.allSettled(
      blobs.map(b => fetch(b.url).then(r => r.json()))
    )
    return results
      .filter((r): r is PromiseFulfilledResult<{
        orderId: string; date: string; status: string; total: string;
        customer: { firstName: string; lastName: string; email: string; phone: string };
        items: Array<{ name: string; quantity: number }>;
      }> => r.status === 'fulfilled')
      .map(r => ({
        id: r.value.orderId,
        number: r.value.orderId,
        status: r.value.status,
        date: r.value.date,
        total: parseFloat(r.value.total),
        customerName: `${r.value.customer.firstName} ${r.value.customer.lastName}`,
        email: r.value.customer.email,
        phone: r.value.customer.phone,
        items: r.value.items.map(i => ({ name: i.name, quantity: i.quantity })),
        source: 'blob' as const,
      }))
  } catch {
    return []
  }
}

export default async function OrdersPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const [wcOrders, blobOrders] = await Promise.all([fetchWCOrders(), fetchBlobOrders()])

  // Merge, deduplicate by id, sort by date desc
  const seen = new Set<string>()
  const orders = [...wcOrders, ...blobOrders]
    .filter(o => { if (seen.has(o.id)) return false; seen.add(o.id); return true })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalRevenue = orders
    .filter(o => ['processing', 'completed', 'pending'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0)

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Назад</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">Поръчки</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Общо поръчки</p>
          <p className="text-3xl font-semibold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Приходи</p>
          <p className="text-3xl font-semibold text-gray-900">{(totalRevenue / 1.95583).toFixed(0)} €</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Изчакващи</p>
          <p className="text-3xl font-semibold text-gray-900">{byStatus['pending'] ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Завършени</p>
          <p className="text-3xl font-semibold text-gray-900">{byStatus['completed'] ?? 0}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Все още няма поръчки.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                  <th className="text-left px-6 py-4 font-medium">Поръчка</th>
                  <th className="text-left px-6 py-4 font-medium">Клиент</th>
                  <th className="text-left px-6 py-4 font-medium">Продукти</th>
                  <th className="text-left px-6 py-4 font-medium">Статус</th>
                  <th className="text-right px-6 py-4 font-medium">Сума</th>
                  <th className="text-left px-6 py-4 font-medium">Дата</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-700">#{order.number}</span>
                      {order.source === 'blob' && (
                        <span className="ml-2 text-xs bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">локал</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-gray-400 text-xs">{order.email}</p>
                      {order.phone && <p className="text-gray-400 text-xs">{order.phone}</p>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-gray-600 truncate">{item.quantity}× {item.name}</p>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {STATUS_BG[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900 tabular-nums">
                      {(order.total / 1.95583).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.source === 'wc' && (
                        <a href={`/admin/orders/${order.id}`} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Виж →</a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
