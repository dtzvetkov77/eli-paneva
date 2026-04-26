import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readProducts, readCategories, writeBlobJson } from '@/lib/blob-store'
import productsData from '@/data/shop/products.json'
import categoriesData from '@/data/shop/categories.json'
import type { WCProduct, WCCategory } from '@/lib/woocommerce'

interface RouteContext { params: Promise<{ id: string }> }

const localProducts = productsData as WCProduct[]
const localCategories = categoriesData as WCCategory[]

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

  const [products, allCategories] = await Promise.all([
    readProducts(localProducts),
    readCategories(localCategories),
  ])

  const idx = products.findIndex(p => p.id === parseInt(id))
  if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const {
    name, short_description, description,
    regular_price, sale_price,
    status, stock_status, featured,
    category_ids,
  } = body

  const effectivePrice = sale_price || regular_price || products[idx].price

  const updatedProduct: WCProduct = {
    ...products[idx],
    name: name ?? products[idx].name,
    short_description: short_description ?? products[idx].short_description,
    description: description ?? products[idx].description,
    regular_price: String(regular_price ?? products[idx].regular_price),
    sale_price: String(sale_price ?? products[idx].sale_price),
    price: String(effectivePrice),
    status: status ?? products[idx].status,
    stock_status: stock_status ?? products[idx].stock_status,
    featured: featured ?? products[idx].featured,
    categories: Array.isArray(category_ids)
      ? allCategories.filter(c => (category_ids as number[]).includes(c.id))
      : products[idx].categories,
  }

  const updated = [...products]
  updated[idx] = updatedProduct
  await writeBlobJson('shop/products.json', updated)

  return NextResponse.json({ ok: true, product: updatedProduct })
}
