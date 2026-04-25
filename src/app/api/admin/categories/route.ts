import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, name } = await req.json()
  if (!id || !name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) {
    return NextResponse.json({ error: 'WC not configured' }, { status: 500 })
  }

  const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${base}/products/categories/${id}`, {
    method: 'PUT',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'WC error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
