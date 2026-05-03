import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import StructuredData from '@/components/ui/StructuredData'
import { services } from '@/data/services'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Услуги',
  description: 'Системни констелации, PSYCH-K®, лични консултации, МАК карти и работа с ограничаващи убеждения с Ели Панева в София.',
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
          title="Как мога да ви подкрепя по пътя към вътрешна промяна"
        />
        <div className="max-w-3xl mb-12 space-y-4 text-(--text-muted) leading-relaxed">
          <p>Аз съм <strong className="text-(--text-dark)">Ели Панева</strong> – холистичен консултант, трансформационен коуч и автор. Работата ми е посветена на хората, които усещат, че е време за промяна, но имат нужда от подкрепа, яснота и сигурно пространство, в което да направят следващата крачка.</p>
          <p>Вярвам, че зад всяко повтарящо се предизвикателство стои послание – неизказана емоция, стар модел, семейна история или подсъзнателно убеждение, което очаква да бъде видяно и освободено.</p>
          <p>В сесиите си помагам на хората да разберат по-дълбоко себе си, своите избори, отношения и вътрешни реакции. Работя с теми като трудности в партньорството, кариерни блокажи, тревожност, ниска самооценка, липса на посока, родови сценарии и усещане, че животът се върти в един и същи кръг.</p>
          <p>Подходът ми е мек, уважителен и дълбинен – без натиск, без осъждане и без готови рецепти. Заедно търсим онова, което е истинско за вас, за да можете да се свържете с вътрешната си сила, да направите по-осъзнати избори и да тръгнете по своя автентичен път. Провеждам индивидуални сесии <strong className="text-(--text-dark)">в София и онлайн</strong>, за да получите подкрепа независимо къде се намирате.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(service => (
            <Link
              key={service.slug}
              href={`/uslugi/${service.slug}`}
              className="group bg-white rounded-2xl border border-(--border) p-8 hover:border-(--sage) hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-5 mb-5">
                <div className="w-11 h-11 rounded-xl bg-(--sage-light) flex items-center justify-center shrink-0">
                  <span className="text-(--sage) text-xl">{service.icon}</span>
                </div>
                <h2 className="font-serif text-xl text-(--text-dark) leading-snug font-normal group-hover:text-(--sage) transition-colors pt-1">
                  {service.title}
                </h2>
              </div>
              <p className="text-sm text-(--text-muted) leading-relaxed mb-5">{service.description}</p>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-(--sage) font-medium">
                Научи повече
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden>
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-16 bg-(--sage-light) p-12 text-center">
          <h3 className="font-serif text-3xl text-(--text-dark) mb-4">Не знаеш откъде да започнеш?</h3>
          <p className="text-(--text-muted) mb-8 max-w-xl mx-auto">Запази безплатна 20-минутна консултация и ще намерим заедно най-подходящия метод за теб.</p>
          <Button href="/kontakti" variant="primary">Запази безплатна консултация</Button>
        </div>
      </div>
    </div>
  )
}
