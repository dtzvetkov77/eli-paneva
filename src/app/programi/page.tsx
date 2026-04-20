import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'
import { getProducts } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Програми',
  description: 'Трансформационни програми за индивидуална и групова работа с Ели Панева в София.',
  alternates: { canonical: 'https://elipaneva.com/programi' },
}

const staticPrograms = [
  {
    title: 'Индивидуална трансформационна програма',
    desc: 'Персонализирана програма от 3-6 месеца за дълбока и трайна вътрешна промяна. Комбинира системни констелации, PSYCH-K® и коучинг.',
    duration: '3–6 месеца',
    format: 'Индивидуален',
    href: '/kontakti',
  },
  {
    title: 'Фамилна програма',
    desc: 'Работа с фамилната система за подобряване на отношенията и освобождаване на наследени модели.',
    duration: '2–4 месеца',
    format: 'Семейство',
    href: '/kontakti',
  },
  {
    title: 'Управление на стреса — 8 седмици',
    desc: 'Структурирана програма за справяне с хроничен стрес, изграждане на ресурси и превенция на прегаряне.',
    duration: '8 седмици',
    format: 'Индивидуален / Група',
    href: '/kontakti',
  },
  {
    title: 'Програма за целеви постижения',
    desc: 'Помагам ти да идентифицираш и премахнеш вътрешните блокажи, спиращи те от постигане на целите.',
    duration: '6–8 сесии',
    format: 'Индивидуален',
    href: '/kontakti',
  },
]

export default async function ProgramsPage() {
  let allProducts: Awaited<ReturnType<typeof getProducts>> = []
  try { allProducts = await getProducts() } catch { /* API unavailable */ }
  const programProducts = allProducts.filter(p =>
    p.categories.some(c =>
      c.slug.includes('program') ||
      c.name.toLowerCase().includes('програм')
    ) ||
    p.name.toLowerCase().includes('програм')
  )

  return (
    <div className="pt-16">
      <div className="bg-(--sage-light) py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Програми"
            title="Трансформационни програми"
            subtitle="Структурирани пътеки за дълбока и трайна вътрешна промяна."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {programProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {programProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {staticPrograms.map(prog => (
              <div key={prog.title} className="border border-(--border) p-8 flex flex-col">
                <div className="flex gap-3 mb-4">
                  <span className="text-xs border border-(--sage) text-(--sage) px-3 py-1">{prog.format}</span>
                  <span className="text-xs border border-(--border) text-(--text-muted) px-3 py-1">{prog.duration}</span>
                </div>
                <h3 className="font-serif text-xl text-(--text-dark) mb-3">{prog.title}</h3>
                <p className="text-(--text-muted) text-sm leading-relaxed flex-1 mb-6">{prog.desc}</p>
                <Button href={prog.href} variant="outline">Запитване</Button>
              </div>
            ))}
          </div>
        )}

        {/* Internal link to services */}
        <div className="border-t border-(--border) pt-12">
          <h2 className="font-serif text-2xl text-(--text-dark) mb-6">Свързани услуги</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Лични консултации', href: '/uslugi/lichni-konsultatsii' },
              { label: 'Системни констелации', href: '/uslugi/sistemni-konstelatsi' },
              { label: 'Управление на стреса', href: '/uslugi/upravlenie-na-stressa' },
              { label: 'МАК карти', href: '/mac-karti' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm border border-(--border) px-4 py-2 text-(--text-muted) hover:border-(--sage) hover:text-(--sage) transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
