import { isAuthenticated } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return NextResponse.json({ error: 'WC not configured' }, { status: 500 })

  const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${base}/orders/${id}`, {
    headers: { Authorization: auth },
    next: { revalidate: 60 },
  })
  if (!res.ok) return NextResponse.json({ error: `WC API ${res.status}` }, { status: res.status })
  const order = await res.json()
  return NextResponse.json(order)
}
