import { notFound } from 'next/navigation'
import { services } from '@/data/services'
import { getProducts } from '@/lib/woocommerce'
import Button from '@/components/ui/Button'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StructuredData from '@/components/ui/StructuredData'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = services.find(s => s.slug === slug)
  if (!service) return {}
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `https://elipaneva.com/uslugi/${slug}` },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = services.find(s => s.slug === slug)
  if (!service) notFound()

  let related: import('@/lib/woocommerce').WCProduct[] = []
  try {
    const allProducts = await getProducts()
    related = service.relatedProducts && service.relatedProducts.length > 0
      ? allProducts.filter(p => service.relatedProducts!.includes(p.slug)).slice(0, 3)
      : []
  } catch {
    related = []
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.longDescription,
    provider: { '@type': 'Person', name: 'Ели Панева', url: 'https://elipaneva.com' },
    areaServed: { '@type': 'City', name: 'София' },
    url: `https://elipaneva.com/uslugi/${service.slug}`,
  }

  const otherServices = services.filter(s => s.slug !== slug).slice(0, 4)

  return (
    <div className="pt-16">
      <StructuredData data={serviceSchema} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs crumbs={[
          { label: 'Начало', href: '/' },
          { label: 'Услуги', href: '/uslugi' },
          { label: service.title },
        ]} />
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <span className="text-5xl text-[var(--sage)] block mb-6">{service.icon}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--text-dark)] mb-8 leading-tight">{service.title}</h1>
            <div className="text-lg text-[var(--text-muted)] leading-relaxed mb-10">{service.longDescription}</div>
            <Button href="/kontakti" variant="primary">Запази час за {service.shortTitle}</Button>
          </div>
          <aside className="space-y-6">
            <div className="bg-[var(--sage-light)] p-6">
              <h3 className="font-serif text-lg text-[var(--text-dark)] mb-4">Други услуги</h3>
              <ul className="space-y-3">
                {otherServices.map(s => (
                  <li key={s.slug}>
                    <Link
                      href={`/uslugi/${s.slug}`}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--sage)] transition-colors flex items-center gap-2"
                    >
                      <span>{s.icon}</span>{s.shortTitle}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/uslugi" className="text-sm text-[var(--sage)] hover:underline">Всички услуги →</Link>
                </li>
              </ul>
            </div>
            <div className="bg-[var(--text-dark)] text-white p-6">
              <h3 className="font-serif text-lg mb-3">Запази час</h3>
              <p className="text-white/60 text-sm mb-4">Свържи се с Ели за безплатна консултация.</p>
              <Button href="/kontakti" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-[var(--text-dark)] w-full justify-center">
                Свържи се
              </Button>
            </div>
          </aside>
        </div>
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl text-[var(--text-dark)] mb-8">Свързани продукти</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
