import productsData from '@/data/shop/products.json'
import categoriesData from '@/data/shop/categories.json'

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
}

const allProducts = productsData as WCProduct[]
const allCategories = categoriesData as WCCategory[]

function safeDecodeURIComponent(s: string): string {
  try { return decodeURIComponent(s) } catch { return s }
}

function slugMatch(stored: string, query: string): boolean {
  const storedDecoded = safeDecodeURIComponent(stored)
  const queryDecoded = safeDecodeURIComponent(query)
  return stored === query || storedDecoded === query || stored === queryDecoded || storedDecoded === queryDecoded
}

export async function getProducts(params: Record<string, string> = {}): Promise<WCProduct[]> {
  let products = allProducts
  if (params.category) {
    const catId = parseInt(params.category)
    products = products.filter(p => p.categories.some(c => c.id === catId))
  }
  return products
}

export async function getProduct(slug: string): Promise<WCProduct | null> {
  return allProducts.find(p => slugMatch(p.slug, slug)) ?? null
}

export async function getCategories(): Promise<WCCategory[]> {
  return allCategories.filter(c => {
    const decoded = safeDecodeURIComponent(c.slug).toLowerCase()
    return !['uncategorized', 'без-категория'].includes(decoded) &&
           c.name.toLowerCase() !== 'uncategorized'
  })
}

export async function getProductsByCategory(categorySlug: string): Promise<WCProduct[]> {
  const cat = allCategories.find(c => slugMatch(c.slug, categorySlug))
  if (!cat) return []
  return allProducts.filter(p => p.categories.some(c => c.id === cat.id))
}
