import { getProducts, getCategories, type WCProduct, type WCCategory } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Магазин',
  description: 'Курсове, консултации, медитации и продукти за личностно развитие и трансформация с Ели Панева.',
  alternates: { canonical: 'https://elipaneva.com/shop' },
}

export default async function ShopPage() {
  let products: WCProduct[] = []
  let categories: WCCategory[] = []
  try {
    ;[products, categories] = await Promise.all([getProducts(), getCategories()])
  } catch {
    // API not configured yet — show empty state
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader
          eyebrow="Магазин"
          title="Продукти за трансформация"
          subtitle="Онлайн курсове, консултации, медитации и физически продукти."
        />
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="/shop" className="px-4 py-2 text-sm border border-(--sage) bg-(--sage) text-white">
              Всички
            </Link>
            {categories.map((cat: WCCategory) => (
              <Link
                key={cat.id}
                href={`/shop/category/${cat.slug}`}
                className="px-4 py-2 text-sm border border-(--border) text-(--text-muted) hover:border-(--sage) hover:text-(--sage) transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: WCProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-(--text-muted)">
            <p className="font-serif text-2xl mb-4">Магазинът се зарежда...</p>
            <p className="text-sm">Добави WooCommerce API ключове в .env.local</p>
          </div>
        )}
      </div>
    </div>
  )
}
