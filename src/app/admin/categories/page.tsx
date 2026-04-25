import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import CategoriesClient from './CategoriesClient'

async function fetchCategories() {
  const key = process.env.WOOCOMMERCE_KEY
  const secret = process.env.WOOCOMMERCE_SECRET
  const base = process.env.WC_API_URL
  if (!key || !secret || !base) return []

  try {
    const auth = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
    const res = await fetch(`${base}/products/categories?per_page=100`, {
      headers: { Authorization: auth },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const categories = await fetchCategories()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Назад</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">Категории</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Промените се записват директно в WooCommerce. След промяна стартирай sync-products.mjs за да обновиш локалния каталог.
      </p>
      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
