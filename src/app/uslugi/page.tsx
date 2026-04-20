import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import StructuredData from '@/components/ui/StructuredData'
import { services } from '@/data/services'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Услуги',
  description: 'Системни констелации, PSYCH-K®, лични консултации, МАК карти и медитации с Ели Панева в София.',
}

export default function ServicesPage() {
  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        url: `https://elipaneva.com/uslugi/${s.slug}`,
        description: s.description,
        provider: { '@type': 'Person', name: 'Ели Панева' },
      },
    })),
  }

  return (
    <div className="pt-16">
      <StructuredData data={serviceListSchema} />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader
          eyebrow="Услуги"
          title="Как мога да те подкрепя"
          subtitle="Избери услугата, която резонира с теб, и направи първата стъпка към трансформацията."
        />
        <div className="space-y-px bg-[var(--border)]">
          {services.map(service => (
            <Link
              key={service.slug}
              href={`/uslugi/${service.slug}`}
              className="group bg-[var(--bg)] hover:bg-white flex items-start gap-8 p-8 transition-colors"
            >
              <span className="text-4xl text-[var(--sage)] shrink-0 mt-1">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-2xl text-[var(--text-dark)] mb-2 group-hover:text-[var(--sage)] transition-colors">
                  {service.title}
                </h2>
                <p className="text-[var(--text-muted)] leading-relaxed">{service.description}</p>
              </div>
              <span className="shrink-0 text-[var(--sage)] text-2xl mt-2 group-hover:translate-x-2 transition-transform hidden sm:block">→</span>
            </Link>
          ))}
        </div>
        <div className="mt-16 bg-[var(--sage-light)] p-12 text-center">
          <h3 className="font-serif text-3xl text-[var(--text-dark)] mb-4">Не знаеш откъде да започнеш?</h3>
          <p className="text-[var(--text-muted)] mb-8 max-w-xl mx-auto">Запази безплатна 20-минутна консултация и ще намерим заедно най-подходящия метод за теб.</p>
          <Button href="/kontakti" variant="primary">Запази безплатна консултация</Button>
        </div>
      </div>
    </div>
  )
}
