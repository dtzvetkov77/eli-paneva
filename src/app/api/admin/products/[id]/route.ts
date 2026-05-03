import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readProducts, writeProduct, deleteProduct } from '@/lib/supabase-store'
import productsData from '@/data/shop/products.json'
import type { WCProduct } from '@/lib/woocommerce'

interface RouteContext { params: Promise<{ id: string }> }

const localProducts = productsData as WCProduct[]

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const products = await readProducts(localProducts)
  const product = products.find(p => p.id === parseInt(id))
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const products = await readProducts(localProducts)
  const existing = products.find(p => p.id === parseInt(id))
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const {
    name, short_description, description,
    regular_price, sale_price, status, stock_status, featured, category_ids, images,
  } = body

  const effectivePrice = sale_price || regular_price || existing.price

  const updated: WCProduct = {
    ...existing,
    name: name ?? existing.name,
    short_description: short_description ?? existing.short_description,
    description: description ?? existing.description,
    regular_price: String(regular_price ?? existing.regular_price),
    sale_price: String(sale_price ?? existing.sale_price),
    price: String(effectivePrice),
    status: status ?? existing.status,
    stock_status: stock_status ?? existing.stock_status,
    featured: featured ?? existing.featured,
    categories: Array.isArray(category_ids)
      ? existing.categories.filter(c => (category_ids as number[]).includes(c.id))
      : existing.categories,
    images: Array.isArray(images) ? images : existing.images,
  }

  try {
    await writeProduct(updated)
    return NextResponse.json({ ok: true, product: updated })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const products = await readProducts(localProducts)
  const exists = products.find(p => p.id === parseInt(id))
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    await deleteProduct(parseInt(id))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
