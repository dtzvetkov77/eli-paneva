import { getProductsByCategory, getCategories } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const cats = await getCategories()
    return cats
      .filter(c => !['uncategorized', 'без-категория'].includes(c.slug.toLowerCase()))
      .map(c => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const decoded = decodeURIComponent(slug)
    const cats = await getCategories()
    const cat = cats.find(c => c.slug === decoded || c.slug === slug)
    const name = cat?.name ?? decoded
    return {
      title: name,
      description: `${name} — продукти от Ели Панева. Системни констелации, МАК карти и инструменти за трансформация.`,
      alternates: { canonical: `https://elipaneva.com/shop/category/${slug}` },
    }
  } catch {
    return { title: 'Категория' }
  }
}

export default async function CategoryPage({ params }: Props) {
  let slug = ''
  let decoded = ''

  try {
    const p = await params
    slug = p.slug ?? ''
    decoded = decodeURIComponent(slug)
  } catch {
    decoded = slug
  }

  let products: import('@/lib/woocommerce').WCProduct[] = []
  let categories: import('@/lib/woocommerce').WCCategory[] = []

  try {
    ;[products, categories] = await Promise.all([
      getProductsByCategory(decoded),
      getCategories(),
    ])
  } catch (err) {
    console.error('[CategoryPage] fetch error:', err)
  }

  const displayName = categories.find(
    c => c.slug === decoded || c.slug === slug
  )?.name ?? decoded

  const visibleCategories = categories.filter(
    c => !['uncategorized', 'без-категория'].includes(c.slug.toLowerCase()) &&
         c.name.toLowerCase() !== 'uncategorized'
  )

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-(--text-muted) mb-8">
          <Link href="/" className="hover:text-(--sage)">Начало</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-(--sage)">Магазин</Link>
          <span>/</span>
          <span className="text-(--text-dark)">{displayName}</span>
        </nav>

        {/* Category nav */}
        {visibleCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/shop" className="px-4 py-1.5 text-sm border border-(--border) rounded-full text-(--text-muted) hover:border-(--sage) hover:text-(--sage) transition-colors">
              Всички
            </Link>
            {visibleCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/shop/category/${cat.slug}`}
                className="px-4 py-1.5 text-sm border border-(--border) rounded-full text-(--text-muted) hover:border-(--sage) hover:text-(--sage) transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <h1 className="font-serif text-4xl text-(--text-dark) mb-10">{displayName}</h1>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-(--text-dark) mb-3">Няма продукти в тази категория</p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link href="/shop" className="px-6 py-2.5 text-sm bg-(--sage) text-white rounded-full hover:bg-(--text-dark) transition-colors">
                Всички продукти
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
