import Button from '@/components/ui/Button'
import StructuredData from '@/components/ui/StructuredData'
import Link from 'next/link'
import { services } from '@/data/services'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'За мен',
  description: 'Ели Панева — холистичен консултант, трансформационен коуч и автор. Системни констелации, PSYCH-K® и МАК карти в София.',
  alternates: { canonical: 'https://elipaneva.com/za-men' },
}

const methods = [
  {
    name: 'Системни констелации',
    desc: 'Работа с фамилната и организационна система за разкриване на скрити динамики и изцеляващо движение.',
    href: '/uslugi/sistemni-konstelatsi',
  },
  {
    name: 'PSYCH-K®',
    desc: 'Метод за трансформиране на ограничаващи убеждения на ниво подсъзнание — бързо и трайно.',
    href: '/uslugi/trevozhnost-i-paniki',
  },
  {
    name: 'Енергийна психология',
    desc: 'Соматичен подход за освобождаване на емоционални и телесни блокажи.',
    href: '/uslugi/lichni-konsultatsii',
  },
  {
    name: 'МАК карти',
    desc: 'Метафорични асоциативни карти за достъп до вътрешната мъдрост и ресурси.',
    href: '/mac-karti',
  },
]

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ели Панева',
    jobTitle: 'Холистичен консултант и трансформационен коуч',
    url: 'https://elipaneva.com/za-men',
    telephone: '+359882420894',
    email: 'elipaneva2023@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
      addressLocality: 'София',
      addressCountry: 'BG',
    },
    knowsAbout: methods.map(m => m.name),
    sameAs: [
      'https://www.facebook.com/elipaneva',
      'https://www.instagram.com/elipaneva',
    ],
  }

  return (
    <div className="pt-16">
      <StructuredData data={personSchema} />

      {/* Hero */}
      <section className="bg-(--sage-light) py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-(--gold) font-medium block mb-6">За мен</span>
            <h1 className="font-serif text-5xl md:text-6xl text-(--text-dark) font-light leading-tight mb-8">
              Ели Панева
            </h1>
            <p className="text-lg text-(--text-muted) leading-relaxed mb-4">
              Холистичен консултант, трансформационен коуч и автор с дългогодишен опит в работата с индивидуални клиенти, семейства и организации.
            </p>
            <p className="text-(--text-muted) leading-relaxed mb-8">
              Моята мисия е да подкрепям хората в процеса на вътрешна промяна — да разпознават и освобождават наследени модели, да намират своя автентичен път и да живеят в по-голяма хармония.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/kontakti" variant="primary">Запази час</Button>
              <Button href="/uslugi" variant="outline">Разгледай услугите</Button>
            </div>
          </div>
          <div className="hidden md:block aspect-[4/5] bg-(--sage)/20 relative">
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 p-6">
              <p className="font-serif text-lg text-(--text-dark) italic">
                „Когато промените начина, по който гледате на нещата, нещата, на които гледате, се променят."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-(--gold) font-medium block mb-4">Методи</span>
          <h2 className="font-serif text-4xl text-(--text-dark)">С какво работя</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {methods.map(m => (
            <Link
              key={m.name}
              href={m.href}
              className="group border border-(--border) p-8 hover:border-(--sage) transition-colors"
            >
              <h3 className="font-serif text-xl text-(--text-dark) mb-3 group-hover:text-(--sage) transition-colors">
                {m.name}
              </h3>
              <p className="text-(--text-muted) text-sm leading-relaxed">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-(--text-dark) py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-(--gold) font-medium block mb-6">Моята мисия</span>
          <blockquote className="font-serif text-3xl md:text-4xl text-white font-light leading-relaxed mb-8">
            „Подкрепям хората в процеса на вътрешна промяна и личностно развитие — защото истинската трансформация идва отвътре."
          </blockquote>
          <Button href="/kontakti" variant="outline" className="border-white text-white hover:bg-white hover:text-(--text-dark)">
            Запази безплатна консултация
          </Button>
        </div>
      </section>

      {/* Services teaser */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-(--gold) font-medium block mb-4">Услуги</span>
          <h2 className="font-serif text-4xl text-(--text-dark)">Как мога да те подкрепя</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map(s => (
            <Link
              key={s.slug}
              href={`/uslugi/${s.slug}`}
              className="group flex items-center gap-3 p-4 border border-(--border) hover:border-(--sage) transition-colors"
            >
              <span className="text-xl text-(--sage)">{s.icon}</span>
              <span className="text-sm text-(--text-dark) group-hover:text-(--sage) transition-colors">{s.shortTitle}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
