import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { readProducts } from '@/lib/supabase-store'
import productsData from '@/data/shop/products.json'
import type { WCProduct } from '@/lib/woocommerce'
import ProductsTableClient from './ProductsTableClient'

export default async function ProductsPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const products = await readProducts(productsData as WCProduct[])

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Продукти</h1>
          <p className="text-sm text-gray-400 mt-0.5">Клик на статуса за бърза промяна</p>
        </div>
      </div>
      <ProductsTableClient initialProducts={products} />
    </div>
  )
}
