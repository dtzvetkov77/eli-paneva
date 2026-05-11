import { getProductsByCategory, getCategories } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import StructuredData from '@/components/ui/StructuredData'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://elipaneva.com' },
      { '@type': 'ListItem', position: 2, name: 'Магазин', item: 'https://elipaneva.com/shop' },
      { '@type': 'ListItem', position: 3, name: displayName, item: `https://elipaneva.com/shop/category/${slug}` },
    ],
  }

  const itemListSchema = products.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: displayName,
    url: `https://elipaneva.com/shop/category/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        url: `https://elipaneva.com/shop/${p.slug}`,
        image: p.images[0]?.src,
        offers: {
          '@type': 'Offer',
          price: parseFloat(p.price) > 0 ? parseFloat(p.price).toFixed(2) : undefined,
          priceCurrency: 'BGN',
          availability: p.stock_status === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    })),
  } : null

  return (
    <div className="pt-16">
      <StructuredData data={breadcrumbSchema} />
      {itemListSchema && <StructuredData data={itemListSchema} />}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs crumbs={[
          { label: 'Начало', href: '/' },
          { label: 'Магазин', href: '/shop' },
          { label: displayName },
        ]} />

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
