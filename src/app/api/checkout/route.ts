import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { put } from '@vercel/blob'
import { readProducts } from '@/lib/blob-store'
import productsData from '@/data/shop/products.json'
import type { WCProduct } from '@/lib/woocommerce'

interface LineItem { id: number; quantity: number }

interface CheckoutBody {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  note?: string
  lineItems: LineItem[]
}

interface StoredOrder {
  orderId: string
  date: string
  status: 'pending'
  customer: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; postcode: string }
  note: string
  items: Array<{ id: number; name: string; price: string; quantity: number; total: string }>
  total: string
}

async function saveOrderToBlob(order: StoredOrder): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return
  await put(`orders/${order.orderId}.json`, JSON.stringify(order, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    token,
  })
}

async function sendOrderEmail(order: StoredOrder): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'
  const to = process.env.CONTACT_EMAIL ?? 'elipaneva2023@gmail.com'

  const itemsHtml = order.items.map(i =>
    `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${i.total} лв</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from,
    to,
    replyTo: order.customer.email,
    subject: `Нова поръчка #${order.orderId} — ${order.customer.firstName} ${order.customer.lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1C1C1A;border-bottom:2px solid #6B8F71;padding-bottom:12px">
          Нова поръчка #${order.orderId}
        </h2>
        <h3 style="color:#6B6B63;font-size:13px;text-transform:uppercase;letter-spacing:2px">Клиент</h3>
        <table style="width:100%;margin-bottom:20px">
          <tr><td style="color:#6B6B63;width:120px;padding:4px 0">Име</td><td>${order.customer.firstName} ${order.customer.lastName}</td></tr>
          <tr><td style="color:#6B6B63;padding:4px 0">Имейл</td><td><a href="mailto:${order.customer.email}" style="color:#6B8F71">${order.customer.email}</a></td></tr>
          <tr><td style="color:#6B6B63;padding:4px 0">Телефон</td><td>${order.customer.phone}</td></tr>
          <tr><td style="color:#6B6B63;padding:4px 0">Адрес</td><td>${order.customer.address}, ${order.customer.city} ${order.customer.postcode}</td></tr>
          ${order.note ? `<tr><td style="color:#6B6B63;padding:4px 0">Бележка</td><td>${order.note}</td></tr>` : ''}
        </table>
        <h3 style="color:#6B6B63;font-size:13px;text-transform:uppercase;letter-spacing:2px">Продукти</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#F5F5F3">
              <th style="padding:8px;text-align:left;font-size:12px">Продукт</th>
              <th style="padding:8px;text-align:center;font-size:12px">Бр.</th>
              <th style="padding:8px;text-align:right;font-size:12px">Сума</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px 8px;font-weight:bold;text-align:right">Общо:</td>
              <td style="padding:10px 8px;font-weight:bold;text-align:right;color:#6B8F71">${order.total} лв</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top:24px;padding:12px;background:#FFF3CD;border-left:3px solid #C8A96E;font-size:13px">
          Плащане: Банков превод. Изпрати потвърждение на клиента след получаване на превода.
        </p>
        <p style="color:#9B9B93;font-size:12px">Поръчка от elipaneva.com · ${order.date}</p>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json()
  const { firstName, lastName, email, phone, address, city, postcode, note, lineItems } = body

  if (!firstName || !lastName || !email || !lineItems?.length) {
    return NextResponse.json({ error: 'Липсват задължителни полета' }, { status: 400 })
  }

  const allProducts = await readProducts(productsData as WCProduct[])
  const orderId = `EP-${Date.now()}`
  const date = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' })

  const items = lineItems.map(li => {
    const p = allProducts.find(x => x.id === li.id)
    const price = parseFloat(p?.price ?? '0')
    return {
      id: li.id,
      name: p?.name ?? `Продукт #${li.id}`,
      price: price.toFixed(2),
      quantity: li.quantity,
      total: (price * li.quantity).toFixed(2),
    }
  })

  const total = items.reduce((s, i) => s + parseFloat(i.total), 0).toFixed(2)

  const order: StoredOrder = {
    orderId,
    date,
    status: 'pending',
    customer: { firstName, lastName, email, phone, address, city, postcode },
    note: note ?? '',
    items,
    total,
  }

  await Promise.allSettled([
    saveOrderToBlob(order),
    sendOrderEmail(order),
  ])

  return NextResponse.json({ orderId, orderNumber: orderId })
}
