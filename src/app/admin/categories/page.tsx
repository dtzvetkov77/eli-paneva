import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import CategoriesClient from './CategoriesClient'
import { readCategories } from '@/lib/supabase-store'
import categoriesData from '@/data/shop/categories.json'
import type { WCCategory } from '@/lib/woocommerce'

export default async function CategoriesPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const categories = await readCategories(categoriesData as WCCategory[])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Назад</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">Категории</h1>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CategoriesClient initialCategories={categories as any} />
    </div>
  )
}
