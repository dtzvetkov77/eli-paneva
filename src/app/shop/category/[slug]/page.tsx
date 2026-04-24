import { getProductsByCategory, getCategories } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import FilterDrawer from '@/components/shop/FilterDrawer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() { return [] }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const decoded = decodeURIComponent(slug)
  try {
    const cats = await getCategories()
    const cat = cats.find(c => c.slug === decoded || c.slug === slug)
    return { title: cat?.name ?? 'Категория' }
  } catch {
    return { title: 'Категория' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const decoded = decodeURIComponent(slug)

  let products: import('@/lib/woocommerce').WCProduct[] = []
  let categories: import('@/lib/woocommerce').WCCategory[] = []

  try {
    ;[products, categories] = await Promise.all([
      getProductsByCategory(decoded),
      getCategories(),
    ])
  } catch {
    // API error — show empty state instead of 404
  }

  const category = categories.find(c => c.slug === decoded || c.slug === slug)

  // If category not found in API but slug is valid URL param, show empty state
  const displayName = category?.name ?? decoded
  const visibleCategories = categories.filter(
    c => !['uncategorized', 'без-категория'].includes(c.slug.toLowerCase()) &&
         c.name.toLowerCase() !== 'uncategorized'
  )

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs crumbs={[
          { label: 'Начало', href: '/' },
          { label: 'Магазин', href: '/shop' },
          { label: displayName },
        ]} />
        <FilterDrawer categories={visibleCategories} />
        <SectionHeader eyebrow="Категория" title={displayName} />
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-(--text-dark) mb-3">Няма продукти в тази категория</p>
            <p className="text-(--text-muted) mb-8">Разгледай всички налични продукти или се свържи с нас за повече информация.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="px-6 py-2.5 text-sm bg-(--sage) text-white rounded-full hover:bg-(--text-dark) transition-colors">
                Всички продукти
              </Link>
              <Link href="/kontakti" className="px-6 py-2.5 text-sm border border-(--sage) text-(--sage) rounded-full hover:bg-(--sage) hover:text-white transition-colors">
                Свържи се с нас
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
