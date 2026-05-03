import { getSupabaseAdmin } from './supabase'
import type { WCProduct, WCCategory } from './woocommerce'

export async function readProducts(fallback: WCProduct[]): Promise<WCProduct[]> {
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('products').select('data').order('id')
    if (error || !data?.length) return fallback
    return data.map(r => r.data as WCProduct)
  } catch {
    return fallback
  }
}

export async function readCategories(fallback: WCCategory[]): Promise<WCCategory[]> {
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await sb.from('categories').select('data').order('id')
    if (error || !data?.length) return fallback
    return data.map(r => r.data as WCCategory)
  } catch {
    return fallback
  }
}

export async function writeProduct(product: WCProduct): Promise<void> {
  const sb = getSupabaseAdmin()
  const { error } = await sb
    .from('products')
    .upsert({ id: product.id, data: product }, { onConflict: 'id' })
  if (error) throw new Error(error.message)
}

export async function writeCategory(cat: WCCategory & { count?: number }): Promise<void> {
  const sb = getSupabaseAdmin()
  const { error } = await sb
    .from('categories')
    .upsert({ id: cat.id, data: cat }, { onConflict: 'id' })
  if (error) throw new Error(error.message)
}

export async function createCategory(name: string): Promise<WCCategory & { count: number }> {
  const sb = getSupabaseAdmin()
  const { data: existing } = await sb
    .from('categories')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
  const maxId = ((existing?.[0] as { id: number } | undefined)?.id) ?? 100
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const newCat = { id: maxId + 1, name, slug, count: 0 }
  const { error } = await sb.from('categories').insert({ id: newCat.id, data: newCat })
  if (error) throw new Error(error.message)
  return newCat
}

export async function createProduct(fields: Partial<import('./woocommerce').WCProduct>): Promise<import('./woocommerce').WCProduct> {
  const sb = getSupabaseAdmin()
  const { data: existing } = await sb
    .from('products')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
  const maxId = ((existing?.[0] as { id: number } | undefined)?.id) ?? 10000
  const newId = maxId + 1
  const slug = (fields.name ?? 'product').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const product: import('./woocommerce').WCProduct = {
    id: newId,
    name: fields.name ?? '',
    slug,
    permalink: `https://elipaneva.com/shop/${slug}`,
    description: fields.description ?? '',
    short_description: fields.short_description ?? '',
    price: fields.price ?? fields.regular_price ?? '0',
    regular_price: fields.regular_price ?? '0',
    sale_price: fields.sale_price ?? '',
    status: fields.status ?? 'draft',
    stock_status: fields.stock_status ?? 'instock',
    featured: fields.featured ?? false,
    categories: fields.categories ?? [],
    images: fields.images ?? [],
  }
  const { error } = await sb.from('products').insert({ id: newId, data: product })
  if (error) throw new Error(error.message)
  return product
}

export async function deleteCategory(id: number): Promise<void> {
  const sb = getSupabaseAdmin()
  const { error } = await sb.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteProduct(id: number): Promise<void> {
  const sb = getSupabaseAdmin()
  const { error } = await sb.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
