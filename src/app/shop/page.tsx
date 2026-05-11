import { getProducts, getCategories, type WCProduct, type WCCategory } from '@/lib/woocommerce'
import ShopClient from '@/components/shop/ShopClient'
import StructuredData from '@/components/ui/StructuredData'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Магазин',
  description: 'Курсове, консултации, медитации и продукти за личностно развитие и трансформация с Ели Панева.',
  alternates: { canonical: 'https://elipaneva.com/shop' },
}

export const revalidate = 3600

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://elipaneva.com' },
    { '@type': 'ListItem', position: 2, name: 'Магазин', item: 'https://elipaneva.com/shop' },
  ],
}

export default async function ShopPage() {
  let products: WCProduct[] = []
  let categories: WCCategory[] = []
  let error = false

  try {
    ;[products, categories] = await Promise.all([getProducts(), getCategories()])
  } catch {
    error = true
  }

  const visibleCategories = categories.filter(
    c => !['uncategorized', 'без-категория'].includes(c.slug.toLowerCase()) &&
         c.name.toLowerCase() !== 'uncategorized'
  )

  return (
    <div className="pt-16">
      <StructuredData data={breadcrumbSchema} />
      <div className="bg-(--bg-warm) py-10 border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs crumbs={[{ label: 'Начало', href: '/' }, { label: 'Магазин' }]} />
          <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-3">Магазин</span>
          <h1 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal">
            Продукти за трансформация
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {error ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-(--text-dark) mb-3">Не може да се зареди магазинът</p>
            <p className="text-sm text-(--text-muted)">Провери WooCommerce API ключовете в .env.local</p>
          </div>
        ) : (
          <ShopClient products={products} categories={visibleCategories} />
        )}
      </div>
    </div>
  )
}
