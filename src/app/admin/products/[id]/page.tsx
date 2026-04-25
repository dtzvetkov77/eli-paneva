import { isAuthenticated } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import ProductEditClient from './ProductEditClient'

interface Props { params: Promise<{ id: string }> }

async function wcFetch(path: string) {
  const key = process.env.WOOCOMMERCE_KEY!
  const secret = process.env.WOOCOMMERCE_SECRET!
  const base = process.env.WC_API_URL!
  const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${base}/${path}`, {
    headers: { Authorization: auth },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProductEditPage({ params }: Props) {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const { id } = await params
  if (id === 'new') {
    // TODO: create new product form
    redirect('/admin/products')
  }

  const [product, categories] = await Promise.all([
    wcFetch(`products/${id}`),
    wcFetch('products/categories?per_page=100'),
  ])

  if (!product) notFound()

  return <ProductEditClient product={product} allCategories={categories ?? []} />
}
