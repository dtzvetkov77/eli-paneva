import { getProduct, getProducts } from '@/lib/woocommerce'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StructuredData from '@/components/ui/StructuredData'
import AddToCartButton from '@/components/shop/AddToCartButton'
import ProductGallery from '@/components/shop/ProductGallery'
import { bgnToEur } from '@/lib/currency'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const allProducts = await getProducts()
    return allProducts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProduct(slug)
    if (!product) return {}
    const desc = product.short_description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 155)
    return {
      title: product.name,
      description: desc,
      alternates: { canonical: `https://elipaneva.com/shop/${slug}` },
      openGraph: {
        images: product.images[0] ? [{ url: product.images[0].src }] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  let product
  try {
    product = await getProduct(slug)
  } catch {
    notFound()
  }
  if (!product) notFound()

  const price = parseFloat(product.price) || 0
  const regularPrice = parseFloat(product.regular_price) || 0
  const hasDiscount = regularPrice > price && regularPrice > 0
  const eur = bgnToEur(price)
  const regularEur = bgnToEur(regularPrice)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description.replace(/<[^>]+>/g, ''),
    image: product.images.map(i => i.src),
    sku: String(product.id),
    brand: { '@type': 'Brand', name: 'Ели Панева' },
    offers: {
      '@type': 'Offer',
      price: eur.toFixed(2),
      priceCurrency: 'EUR',
      availability: product.stock_status === 'instock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://elipaneva.com/shop/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Ели Панева',
        url: 'https://elipaneva.com',
      },
    },
  }

  return (
    <div className="pt-16">
      <StructuredData data={productSchema} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs crumbs={[
          { label: 'Начало', href: '/' },
          { label: 'Магазин', href: '/shop' },
          { label: product.name },
        ]} />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-(--text-dark) mb-5 leading-tight">
              {product.name}
            </h1>

            {price > 0 && (
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-light text-(--text-dark) tabular-nums">
                    {eur.toFixed(2)} €
                  </span>
                  {hasDiscount && (
                    <span className="text-base line-through text-(--text-muted) tabular-nums">
                      {regularEur.toFixed(2)} €
                    </span>
                  )}
                </div>
                <p className="text-sm text-(--text-muted) mt-1 tabular-nums">{price.toFixed(2)} лв</p>
              </div>
            )}

            {/* Short description */}
            {product.short_description && (
              <div
                className="text-(--text-muted) leading-relaxed mb-8 text-base"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {(() => {
              const urls = product.audio_urls?.length
                ? product.audio_urls
                : product.audio_url ? [product.audio_url] : []
              return urls.length > 0 ? (
                <div className="mb-8 border border-(--border) rounded-2xl p-4 bg-(--bg-warm) space-y-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-(--text-muted)">Аудио преглед</p>
                  {urls.map((url, i) => (
                    <audio key={i} controls src={url} className="w-full" />
                  ))}
                </div>
              ) : null
            })()}

            {price > 0 && <AddToCartButton product={product} />}

            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.categories.map(c => (
                  <Link key={c.id} href={`/shop/category/${c.slug}`} className="text-xs text-(--text-muted) border border-(--border) rounded-full px-3 py-1 hover:border-(--sage) hover:text-(--sage) transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full description below */}
        {product.description && (
          <div className="mt-16 pt-12 border-t border-(--border)">
            <h2 className="font-serif text-2xl text-(--text-dark) mb-6">Описание</h2>
            <div
              className="prose prose-lg max-w-3xl text-(--text-muted) prose-headings:font-serif prose-headings:text-(--text-dark)"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
