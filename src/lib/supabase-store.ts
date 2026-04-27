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

export async function deleteCategory(id: number): Promise<void> {
  const sb = getSupabaseAdmin()
  const { error } = await sb.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
