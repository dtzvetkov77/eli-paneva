import { isAuthenticated } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'

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

interface WCAddress {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
  email?: string
  phone?: string
}

interface WCLineItem {
  id: number
  name: string
  quantity: number
  price: number
  total: string
  subtotal: string
  sku: string
}

interface WCOrder {
  id: number
  number: string
  status: string
  date_created: string
  total: string
  subtotal: string
  total_tax: string
  shipping_total: string
  discount_total: string
  payment_method: string
  payment_method_title: string
  transaction_id: string
  customer_note: string
  billing: WCAddress
  shipping: WCAddress
  line_items: WCLineItem[]
  currency: string
}

async function fetchOrder(id: string): Promise<WCOrder | null> {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return null
  try {
    const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
    const res = await fetch(`${base}/orders/${id}`, {
      headers: { Authorization: auth },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function AddressBlock({ addr, label }: { addr: WCAddress; label: string }) {
  const hasContent = addr.address_1 || addr.city || addr.first_name
  if (!hasContent) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{label}</p>
      <div className="text-sm text-gray-700 space-y-1">
        {(addr.first_name || addr.last_name) && (
          <p className="font-medium text-gray-900">{addr.first_name} {addr.last_name}</p>
        )}
        {addr.company && <p>{addr.company}</p>}
        {addr.address_1 && <p>{addr.address_1}</p>}
        {addr.address_2 && <p>{addr.address_2}</p>}
        {(addr.city || addr.postcode) && (
          <p>{[addr.postcode, addr.city].filter(Boolean).join(' ')}</p>
        )}
        {addr.state && <p>{addr.state}</p>}
        {addr.country && <p>{addr.country}</p>}
        {addr.email && <p className="text-gray-500">{addr.email}</p>}
        {addr.phone && <p className="text-gray-500">{addr.phone}</p>}
      </div>
    </div>
  )
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const { id } = await params
  const order = await fetchOrder(id)
  if (!order) notFound()

  const date = new Date(order.date_created).toLocaleString('bg-BG', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const total = parseFloat(order.total)
  const eur = (total / 1.95583).toFixed(2)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/orders" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Поръчки</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">Поръчка #{order.number}</h1>
        <span className={`ml-2 inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          {STATUS_BG[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid gap-6">
        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5 flex flex-wrap gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Дата</p>
            <p className="text-sm text-gray-900">{date}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Начин на плащане</p>
            <p className="text-sm text-gray-900">{order.payment_method_title || '—'}</p>
          </div>
          {order.transaction_id && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Transaction ID</p>
              <p className="text-sm font-mono text-gray-700">{order.transaction_id}</p>
            </div>
          )}
          <div className="ml-auto text-right">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Сума</p>
            <p className="text-2xl font-semibold text-gray-900">{eur} €</p>
            <p className="text-sm text-gray-400">{total.toFixed(2)} лв</p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400">Продукти</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs uppercase tracking-widest text-gray-400">
                <th className="text-left px-6 py-3 font-medium">Продукт</th>
                <th className="text-left px-6 py-3 font-medium">SKU</th>
                <th className="text-center px-6 py-3 font-medium">Кол.</th>
                <th className="text-right px-6 py-3 font-medium">Цена</th>
                <th className="text-right px-6 py-3 font-medium">Сума</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.line_items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.sku || '—'}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 text-right text-gray-700 tabular-nums">
                    {(item.price / 1.95583).toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 tabular-nums">
                    {(parseFloat(item.total) / 1.95583).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-100 text-sm">
              {parseFloat(order.discount_total) > 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-2 text-right text-gray-500">Отстъпка</td>
                  <td className="px-6 py-2 text-right text-green-600 tabular-nums">
                    −{(parseFloat(order.discount_total) / 1.95583).toFixed(2)} €
                  </td>
                </tr>
              )}
              {parseFloat(order.shipping_total) > 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-2 text-right text-gray-500">Доставка</td>
                  <td className="px-6 py-2 text-right text-gray-700 tabular-nums">
                    {(parseFloat(order.shipping_total) / 1.95583).toFixed(2)} €
                  </td>
                </tr>
              )}
              {parseFloat(order.total_tax) > 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-2 text-right text-gray-500">ДДС</td>
                  <td className="px-6 py-2 text-right text-gray-700 tabular-nums">
                    {(parseFloat(order.total_tax) / 1.95583).toFixed(2)} €
                  </td>
                </tr>
              )}
              <tr className="font-semibold">
                <td colSpan={4} className="px-6 py-3 text-right text-gray-900">Общо</td>
                <td className="px-6 py-3 text-right text-gray-900 tabular-nums">{eur} €</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Addresses */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <AddressBlock addr={order.billing} label="Данни за фактура" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <AddressBlock addr={order.shipping} label="Адрес за доставка" />
          </div>
        </div>

        {/* Customer note */}
        {order.customer_note && (
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Бележка от клиента</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.customer_note}</p>
          </div>
        )}
      </div>
    </div>
  )
}
