import { isAuthenticated } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import ProductEditClient from './ProductEditClient'
import { readProducts, readCategories } from '@/lib/supabase-store'
import productsData from '@/data/shop/products.json'
import categoriesData from '@/data/shop/categories.json'
import type { WCProduct, WCCategory } from '@/lib/woocommerce'

interface Props { params: Promise<{ id: string }> }

export default async function ProductEditPage({ params }: Props) {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const { id } = await params
  if (id === 'new') redirect('/admin/products')

  const [products, categories] = await Promise.all([
    readProducts(productsData as WCProduct[]),
    readCategories(categoriesData as WCCategory[]),
  ])

  const product = products.find(p => p.id === parseInt(id))
  if (!product) notFound()

  return <ProductEditClient product={product} allCategories={categories} />
}
