import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface RouteContext { params: Promise<{ id: string }> }

function wcAuth() {
  const key = process.env.WOOCOMMERCE_KEY!
  const secret = process.env.WOOCOMMERCE_SECRET!
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
}

function wcBase() {
  return process.env.WC_API_URL!
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const res = await fetch(`${wcBase()}/products/${id}`, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(await res.json())
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const {
    name, short_description, description,
    regular_price, sale_price,
    status, stock_status, featured,
    category_ids,
  } = body

  const wcPayload = {
    name,
    short_description,
    description,
    regular_price: String(regular_price ?? ''),
    sale_price: String(sale_price ?? ''),
    status,
    stock_status,
    featured: !!featured,
    categories: (category_ids as number[]).map(cid => ({ id: cid })),
  }

  // Save to WooCommerce
  const wcRes = await fetch(`${wcBase()}/products/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: wcAuth(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wcPayload),
  })

  if (!wcRes.ok) {
    const err = await wcRes.text()
    return NextResponse.json({ error: `WC error: ${err.slice(0, 200)}` }, { status: 500 })
  }

  const updated = await wcRes.json()

  // Also update local JSON (best-effort, fails silently on Vercel)
  try {
    const jsonPath = join(process.cwd(), 'src', 'data', 'shop', 'products.json')
    const raw = await readFile(jsonPath, 'utf-8')
    const products: Array<Record<string, unknown>> = JSON.parse(raw)
    const idx = products.findIndex(p => p.id === parseInt(id))
    if (idx >= 0) {
      products[idx] = {
        ...products[idx],
        name: updated.name,
        short_description: updated.short_description,
        description: updated.description,
        price: updated.price,
        regular_price: updated.regular_price,
        sale_price: updated.sale_price,
        status: updated.status,
        stock_status: updated.stock_status,
        featured: updated.featured,
        categories: (updated.categories ?? []).map((c: { id: number; name: string; slug: string }) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
      }
      await writeFile(jsonPath, JSON.stringify(products, null, 2), 'utf-8')
    }
  } catch {
    // Ignore — Vercel filesystem is read-only for the project directory
  }

  return NextResponse.json({ ok: true, product: updated })
}
