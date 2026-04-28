import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { readProducts } from '@/lib/supabase-store'
import productsData from '@/data/shop/products.json'
import type { WCProduct } from '@/lib/woocommerce'
import ProductsTableClient from './ProductsTableClient'
import Link from 'next/link'

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
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Нов продукт
        </Link>
      </div>
      <ProductsTableClient initialProducts={products} />
    </div>
  )
}
