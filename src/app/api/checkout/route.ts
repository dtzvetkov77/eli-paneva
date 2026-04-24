import { NextRequest, NextResponse } from 'next/server'

interface LineItem {
  id: number
  quantity: number
}

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

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json()
  const { firstName, lastName, email, phone, address, city, postcode, note, lineItems } = body

  if (!firstName || !lastName || !email || !lineItems?.length) {
    return NextResponse.json({ error: 'Липсват задължителни полета' }, { status: 400 })
  }

  const key = process.env.WOOCOMMERCE_KEY!
  const secret = process.env.WOOCOMMERCE_SECRET!
  const baseUrl = process.env.WC_API_URL!
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')

  const orderPayload = {
    payment_method: 'bacs',
    payment_method_title: 'Банков превод',
    set_paid: false,
    billing: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address_1: address,
      city,
      postcode,
      country: 'BG',
    },
    shipping: {
      first_name: firstName,
      last_name: lastName,
      address_1: address,
      city,
      postcode,
      country: 'BG',
    },
    line_items: lineItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
    customer_note: note ?? '',
  }

  const res = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('WC order error:', err)
    return NextResponse.json({ error: 'Грешка при създаване на поръчката' }, { status: 500 })
  }

  const order = await res.json()
  return NextResponse.json({ orderId: order.id, orderNumber: order.number })
}
