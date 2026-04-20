import { getProduct, getProducts } from '@/lib/woocommerce'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PriceDisplay from '@/components/ui/PriceDisplay'
import Button from '@/components/ui/Button'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StructuredData from '@/components/ui/StructuredData'
import { bgnToEur } from '@/lib/currency'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const products = await getProducts()
    return products.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
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
  const eur = bgnToEur(price)

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
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            {product.images[0] ? (
              <div className="aspect-square relative overflow-hidden bg-[var(--sage-light)]">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square bg-[var(--sage-light)] flex items-center justify-center">
                <span className="font-serif text-4xl text-[var(--sage)]/40">Е</span>
              </div>
            )}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {product.images.slice(1, 5).map(img => (
                  <div key={img.id} className="aspect-square relative overflow-hidden bg-[var(--sage-light)]">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-[var(--text-dark)] mb-4">{product.name}</h1>
            {price > 0 && (
              <div className="mb-6">
                <div className="text-3xl font-light text-[var(--text-dark)]">
                  {price.toFixed(2)} лв
                </div>
                <div className="text-[var(--text-muted)] text-sm mt-1">{eur.toFixed(2)} €</div>
              </div>
            )}
            <div
              className="text-[var(--text-muted)] leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
            <Button href={product.permalink} variant="primary" external className="w-full justify-center mb-4">
              Купи сега
            </Button>
            <div
              className="prose prose-sm max-w-none text-[var(--text-muted)] mt-8"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
