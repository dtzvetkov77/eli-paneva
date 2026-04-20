import { getProductsByCategory, getCategories } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const cats = await getCategories()
    return cats.map(c => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const cats = await getCategories()
    const cat = cats.find(c => c.slug === slug)
    return { title: cat?.name ?? 'Категория' }
  } catch {
    return { title: 'Категория' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  let products = []
  let categories = []
  try {
    ;[products, categories] = await Promise.all([
      getProductsByCategory(slug),
      getCategories(),
    ])
  } catch {
    notFound()
  }
  const category = categories.find((c: { slug: string }) => c.slug === slug)
  if (!category) notFound()

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs crumbs={[
          { label: 'Начало', href: '/' },
          { label: 'Магазин', href: '/shop' },
          { label: category.name },
        ]} />
        <SectionHeader eyebrow="Категория" title={category.name} />
        {products.length === 0 ? (
          <p className="text-[var(--text-muted)]">Няма продукти в тази категория.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: import('@/lib/woocommerce').WCProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
