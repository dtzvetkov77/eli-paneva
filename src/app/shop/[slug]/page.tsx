import { getProduct } from '@/lib/woocommerce'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StructuredData from '@/components/ui/StructuredData'
import AddToCartButton from '@/components/shop/AddToCartButton'
import ProductGallery from '@/components/shop/ProductGallery'
import { bgnToEur } from '@/lib/currency'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProduct(slug)
    if (!product) return {}
    return {
      title: product.name,
      description: product.short_description.replace(/<[^>]+>/g, '').slice(0, 160),
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
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'BGN',
      availability: product.stock_status === 'instock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://elipaneva.com/shop/${product.slug}`,
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

            {/* Price — EUR primary, BGN secondary */}
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
                <p className="text-sm text-(--text-muted) mt-1 tabular-nums">
                  {price.toFixed(2)} лв
                  {hasDiscount && (
                    <span className="line-through ml-2">{regularPrice.toFixed(2)} лв</span>
                  )}
                </p>
              </div>
            )}

            {/* Short description */}
            {product.short_description && (
              <div
                className="text-(--text-muted) leading-relaxed mb-8 text-base"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            <AddToCartButton product={product} />

            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.categories.map(c => (
                  <span key={c.id} className="text-xs text-(--text-muted) border border-(--border) rounded-full px-3 py-1">
                    {c.name}
                  </span>
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
