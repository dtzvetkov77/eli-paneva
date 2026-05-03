import productsData from '@/data/shop/products.json'
import categoriesData from '@/data/shop/categories.json'
import { readProducts, readCategories } from './supabase-store'

export interface WCImage { id: number; src: string; alt: string }
export interface WCCategory { id: number; name: string; slug: string }
export interface WCProduct {
  id: number
  name: string
  slug: string
  permalink: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  categories: WCCategory[]
  images: WCImage[]
  status: string
  featured: boolean
  stock_status: string
  audio_url?: string
}

const localProducts = productsData as WCProduct[]
const localCategories = categoriesData as WCCategory[]

function safeDecodeURIComponent(s: string): string {
  try { return decodeURIComponent(s) } catch { return s }
}

function slugMatch(stored: string, query: string): boolean {
  const storedDecoded = safeDecodeURIComponent(stored)
  const queryDecoded = safeDecodeURIComponent(query)
  return stored === query || storedDecoded === query || stored === queryDecoded || storedDecoded === queryDecoded
}

export async function getProducts(params: Record<string, string> = {}): Promise<WCProduct[]> {
  const allProducts = await readProducts(localProducts)
  if (params.category) {
    const catId = parseInt(params.category)
    return allProducts.filter(p => p.categories.some(c => c.id === catId))
  }
  return allProducts
}

export async function getProduct(slug: string): Promise<WCProduct | null> {
  const allProducts = await readProducts(localProducts)
  return allProducts.find(p => slugMatch(p.slug, slug)) ?? null
}

export async function getCategories(): Promise<WCCategory[]> {
  const allCategories = await readCategories(localCategories)
  return allCategories.filter(c =>
    !['uncategorized', 'без-категория', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )
}

export async function getProductsByCategory(categorySlug: string): Promise<WCProduct[]> {
  const allCategories = await readCategories(localCategories)
  const allProducts = await readProducts(localProducts)
  const cat = allCategories.find(c => slugMatch(c.slug, categorySlug))
  if (!cat) return []
  return allProducts.filter(p => p.categories.some(c => c.id === cat.id))
}
