import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'

function wcAuth() {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return null
  return {
    auth: 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64'),
    base,
  }
}

// Rename category
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name } = await req.json()
  if (!id || !name || typeof name !== 'string') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const wc = wcAuth()
  if (!wc) return NextResponse.json({ error: 'WC not configured' }, { status: 500 })

  const res = await fetch(`${wc.base}/products/categories/${id}`, {
    method: 'PUT',
    headers: { Authorization: wc.auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) return NextResponse.json({ error: 'WC error' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Create new category
export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name || typeof name !== 'string') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const wc = wcAuth()
  if (!wc) return NextResponse.json({ error: 'WC not configured' }, { status: 500 })

  const res = await fetch(`${wc.base}/products/categories`, {
    method: 'POST',
    headers: { Authorization: wc.auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) return NextResponse.json({ error: 'WC error' }, { status: 500 })

  const created = await res.json()
  return NextResponse.json({
    id: created.id,
    name: created.name,
    slug: created.slug,
    count: 0,
  })
}

// Delete category
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const wc = wcAuth()
  if (!wc) return NextResponse.json({ error: 'WC not configured' }, { status: 500 })

  const res = await fetch(`${wc.base}/products/categories/${id}?force=true`, {
    method: 'DELETE',
    headers: { Authorization: wc.auth },
  })
  if (!res.ok) return NextResponse.json({ error: 'WC error' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
