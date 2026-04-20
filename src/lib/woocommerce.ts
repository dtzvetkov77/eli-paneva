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

async function wcFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const key = process.env.WOOCOMMERCE_KEY!
  const secret = process.env.WOOCOMMERCE_SECRET!
  const baseUrl = process.env.WC_API_URL!

  const url = new URL(`${baseUrl}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${credentials}` },
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`WC API error: ${res.status} ${endpoint}`)
  return res.json()
}

export async function getProducts(params: Record<string, string> = {}): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>('products', { per_page: '100', status: 'publish', ...params })
}

export async function getProduct(slug: string): Promise<WCProduct | null> {
  const products = await wcFetch<WCProduct[]>('products', { slug, status: 'publish' })
  return products[0] ?? null
}

export async function getCategories(): Promise<WCCategory[]> {
  return wcFetch<WCCategory[]>('products/categories', { per_page: '50', hide_empty: 'true' })
}

export async function getProductsByCategory(categorySlug: string): Promise<WCProduct[]> {
  const cats = await wcFetch<WCCategory[]>('products/categories', { slug: categorySlug })
  if (!cats[0]) return []
  return wcFetch<WCProduct[]>('products', { category: String(cats[0].id), per_page: '50', status: 'publish' })
}
