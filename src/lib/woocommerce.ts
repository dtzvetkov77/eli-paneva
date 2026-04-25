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

export async function getProducts(params: Record<string, string> = {}): Promise<WCProduct[]> {
  let products = allProducts
  if (params.category) {
    const catId = parseInt(params.category)
    products = products.filter(p => p.categories.some(c => c.id === catId))
  }
  return products
}

export async function getProduct(slug: string): Promise<WCProduct | null> {
  return allProducts.find(p => p.slug === slug) ?? null
}

export async function getCategories(): Promise<WCCategory[]> {
  return allCategories.filter(
    c => !['uncategorized', 'без-категория'].includes(c.slug.toLowerCase()) &&
         c.name.toLowerCase() !== 'uncategorized'
  )
}

export async function getProductsByCategory(categorySlug: string): Promise<WCProduct[]> {
  const decoded = decodeURIComponent(categorySlug)
  const cat = allCategories.find(c => c.slug === decoded || c.slug === categorySlug)
  if (!cat) return []
  return allProducts.filter(p => p.categories.some(c => c.id === cat.id))
}
