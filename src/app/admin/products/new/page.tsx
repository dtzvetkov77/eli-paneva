import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { readCategories } from '@/lib/supabase-store'
import categoriesData from '@/data/shop/categories.json'
import type { WCCategory, WCProduct } from '@/lib/woocommerce'
import ProductEditClient from '../[id]/ProductEditClient'

const emptyProduct: WCProduct = {
  id: 0,
  name: '',
  slug: '',
  permalink: '',
  description: '',
  short_description: '',
  price: '0',
  regular_price: '0',
  sale_price: '',
  status: 'draft',
  stock_status: 'instock',
  featured: false,
  categories: [],
  images: [],
}

export default async function NewProductPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const allCategories = await readCategories(categoriesData as WCCategory[])

  return (
    <ProductEditClient
      product={emptyProduct}
      allCategories={allCategories}
      isNew
    />
  )
}
