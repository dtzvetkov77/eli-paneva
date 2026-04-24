import { getProducts, getCategories, type WCProduct, type WCCategory } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import FilterDrawer from '@/components/shop/FilterDrawer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Магазин',
  description: 'Курсове, консултации, медитации и продукти за личностно развитие и трансформация с Ели Панева.',
  alternates: { canonical: 'https://elipaneva.com/shop' },
}

export const revalidate = 3600

const formatFilters = ['Онлайн', 'Физически продукт', 'На живо']
const topicFilters = ['Констелации', 'МАК карти', 'Тревожност', 'Медитации', 'Стрес']

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
      {/* Page header */}
      <div className="bg-(--bg-warm) py-10 border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-3">Магазин</span>
          <h1 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal">
            Продукти за трансформация
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Mobile filter trigger (rendered inside FilterDrawer) */}
        <FilterDrawer categories={visibleCategories} />

        <div className="flex gap-10">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-8">
            <div>
              <Link href="/shop" className="block text-sm font-medium text-(--sage) mb-4 hover:underline">
                Всички продукти
              </Link>
            </div>

            {visibleCategories.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-3">Категории</h3>
                <ul className="space-y-2">
                  {visibleCategories.map(cat => (
                    <li key={cat.id}>
                      <Link
                        href={`/shop/category/${cat.slug}`}
                        className="text-sm text-(--text-mid) hover:text-(--sage) transition-colors flex items-center justify-between group"
                      >
                        <span>{cat.name}</span>
                        <span className="text-(--text-muted) group-hover:text-(--sage) transition-colors">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-3">Формат</h3>
              <ul className="space-y-2">
                {formatFilters.map(f => (
                  <li key={f} className="text-sm text-(--text-mid)">{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-medium mb-3">Тема</h3>
              <ul className="space-y-2">
                {topicFilters.map(f => (
                  <li key={f} className="text-sm text-(--text-mid)">{f}</li>
                ))}
              </ul>
            </div>

            <div className="bg-(--sage-light) rounded-2xl p-5 border border-(--border)">
              <p className="text-sm text-(--text-dark) font-medium mb-1">Нужна помощ?</p>
              <p className="text-xs text-(--text-muted) mb-3 leading-relaxed">Свържи се с Ели за препоръка.</p>
              <Link
                href="/kontakti"
                className="block text-center text-xs font-medium text-(--sage) border border-(--sage) rounded-full px-4 py-2 hover:bg-(--sage) hover:text-white transition-all duration-200"
              >
                Запитай
              </Link>
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {error ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-(--text-dark) mb-3">Не може да се зареди магазинът</p>
                <p className="text-sm text-(--text-muted)">Провери WooCommerce API ключовете в .env.local</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-(--text-dark) mb-3">Зарежда се...</p>
                <p className="text-sm text-(--text-muted)">Добави WooCommerce API ключове в .env.local</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: WCProduct) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
