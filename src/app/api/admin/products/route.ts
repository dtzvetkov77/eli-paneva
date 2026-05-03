import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readCategories, createProduct } from '@/lib/supabase-store'
import categoriesData from '@/data/shop/categories.json'
import type { WCCategory } from '@/lib/woocommerce'

const BGN_PER_EUR = 1.95583

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, short_description, description, regular_price, sale_price, status, stock_status, featured, category_ids, images, audio_url } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Наименованието е задължително' }, { status: 400 })

  const allCats = await readCategories(categoriesData as WCCategory[])
  const categories = Array.isArray(category_ids)
    ? allCats.filter(c => (category_ids as number[]).includes(c.id))
    : []

  const regularBgn = regular_price ? String(parseFloat(regular_price) * BGN_PER_EUR) : '0'
  const saleBgn = sale_price ? String(parseFloat(sale_price) * BGN_PER_EUR) : ''
  const priceBgn = saleBgn || regularBgn

  try {
    const product = await createProduct({
      name: name.trim(),
      short_description: short_description ?? '',
      description: description ?? '',
      regular_price: regularBgn,
      sale_price: saleBgn,
      price: priceBgn,
      status: status ?? 'draft',
      stock_status: stock_status ?? 'instock',
      featured: featured ?? false,
      categories,
      images: Array.isArray(images) ? images : [],
      audio_url: audio_url || undefined,
    })
    return NextResponse.json({ ok: true, product })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
