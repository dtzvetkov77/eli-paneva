import { SOCIAL_SCHEMA_URLS } from '@/lib/social-links'
import Button from '@/components/ui/Button'
import StructuredData from '@/components/ui/StructuredData'
import Link from 'next/link'
import Image from 'next/image'
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
    desc: 'Метод за разкриване на скрити семейни и организационни динамики — работа с представители или фигури за намиране на изцеляващото движение.',
    href: '/uslugi/sistemni-konstelatsi',
    icon: '⬡',
  },
  {
    name: 'PSYCH-K®',
    desc: 'Бърз и ефективен метод за трансформиране на ограничаващи убеждения на ниво подсъзнание чрез мозъчна интеграция.',
    href: '/uslugi/trevozhnost-i-paniki',
    icon: '◷',
  },
  {
    name: 'Енергийна психология',
    desc: 'Соматичен подход, работещ едновременно с тялото, емоциите и убежденията за освобождаване на дълбоко вкоренени блокажи.',
    href: '/uslugi/lichni-konsultatsii',
    icon: '◌',
  },
  {
    name: 'МАК карти',
    desc: 'Метафорични асоциативни карти — инструмент за достъп до вътрешната мъдрост, подходящ за индивидуална работа и обучения.',
    href: '/shop/category/карти-и-талисмани',
    icon: '◎',
  },
]

const values = [
  {
    title: 'Безопасно пространство',
    text: 'Всяка сесия протича в среда на абсолютна поверителност и уважение — без осъждане, без натиск.',
  },
  {
    title: 'Работа с корена',
    text: 'Не лекуваме симптоми — търсим и трансформираме дълбоката причина, за да бъде промяната трайна.',
  },
  {
    title: 'Уважение към ритъма',
    text: 'Всеки човек е различен. Темпото и методите се адаптират изцяло към тебе и твоите нужди.',
  },
  {
    title: 'Интеграция в живота',
    text: 'Трансформацията не приключва в кабинета. Всяка сесия завършва с конкретни насоки за прилагане.',
  },
]

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://elipaneva.com/#person',
    name: 'Ели Панева',
    jobTitle: 'Холистичен консултант и трансформационен коуч',
    description: 'Холистичен консултант, трансформационен коуч и автор. Подкрепя хората да разпознаят и освободят семейните сценарии и подсъзнателни модели чрез системни констелации, PSYCH-K® и МАК карти.',
    url: 'https://elipaneva.com',
    image: 'https://elipaneva.com/eli-photo.webp',
    telephone: '+359882420894',
    email: 'elipaneva2023@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
      addressLocality: 'София',
      postalCode: '1504',
      addressCountry: 'BG',
    },
    knowsAbout: methods.map(m => m.name),
    sameAs: SOCIAL_SCHEMA_URLS,
  }

  return (
    <div className="pt-16">
      <StructuredData data={personSchema} />

      {/* Hero */}
      <section className="bg-(--bg-warm) py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-(--gold) font-medium block mb-6">За мен</span>
            <h1 className="font-serif text-5xl md:text-6xl text-(--text-dark) font-normal leading-[1.05] mb-8">
              Ели Панева
            </h1>
            <p className="text-lg text-(--text-mid) leading-relaxed mb-5">
              Аз съм холистичен консултант, трансформационен коуч и автор. Подкрепям хората да разпознаят и освободят семейните сценарии и подсъзнателни модели, които ги задържат назад — и да открият своя автентичен път.
            </p>
            <p className="text-(--text-muted) leading-relaxed mb-8">
              Работя с хора от всички сфери на живота — с проблеми в отношенията, кариерни блокажи, тревожност, ниска самооценка и търсене на смисъл. Сесиите се провеждат в София и онлайн.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/kontakti" variant="primary">Запази час</Button>
              <Button href="/uslugi" variant="outline">Разгледай услугите</Button>
            </div>
          </div>

          <div>
            <div className="aspect-3/2 bg-(--sage-light) relative overflow-hidden rounded-2xl">
              <Image
                src="/eli-photo.webp"
                alt="Ели Панева"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* My story */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-(--gold) font-medium block mb-6">Моята история</span>
            <h2 className="font-serif text-4xl text-(--text-dark) font-normal leading-tight mb-8">
              Пътят към трансформацията
            </h2>
            <div className="space-y-5 text-(--text-muted) leading-relaxed">
              <p>
                Пътят ми към холистичното консултиране започна от лично търсене. Дълго време търсех отговори на въпроси, на които конвенционалните методи не успяваха да дадат — защо повтарям едни и същи модели, защо определени неща в живота ми сякаш „не се получават", въпреки усилията.
              </p>
              <p>
                Системните констелации промениха всичко. За пръв път видях ясно семейните динамики, действащи зад сцената на живота ми. Тогава разбрах, че истинската промяна идва отвътре — и решила да споделя тези методи с другите.
              </p>
              <p>
                Обучавах се при водещи специалисти в България и чужбина. Сертифицирала съм се по системни констелации, PSYCH-K®, енергийна психология и МАК карти. Работя с клиенти от повече от 10 години.
              </p>
              <p>
                Мисията ми е ясна: да подкрепям хората в тяхната уникална трансформация — с уважение, с грижа и с доверие в мъдростта на всяка душа.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-(--bg-warm) rounded-2xl p-6 border border-(--border)">
                <h3 className="font-serif text-lg text-(--text-dark) mb-3 font-normal">{v.title}</h3>
                <p className="text-sm text-(--text-muted) leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="bg-(--bg-warm) py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.22em] text-(--gold) font-medium block mb-4">Методи</span>
            <h2 className="font-serif text-4xl text-(--text-dark) font-normal">С какво работя</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {methods.map(m => (
              <Link
                key={m.name}
                href={m.href}
                className="group bg-white rounded-2xl border border-(--border) p-8 hover:border-(--sage) hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <span className="text-3xl text-(--sage) shrink-0 mt-0.5">{m.icon}</span>
                  <div>
                    <h3 className="font-serif text-xl text-(--text-dark) mb-3 font-normal group-hover:text-(--sage) transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-sm text-(--text-muted) leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-(--text-dark) py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-(--gold) font-medium block mb-8">Моята мисия</span>
          <blockquote className="font-serif text-2xl md:text-3xl text-white font-normal leading-relaxed mb-10">
            „Вярвам, че всеки човек носи в себе си мъдростта и ресурсите за своята трансформация. Моята роля е да създам пространство, в което те могат да се проявят."
          </blockquote>
          <cite className="text-white/50 text-sm not-italic block mb-10">— Ели Панева</cite>
          <Button href="/kontakti" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-(--text-dark)">
            Запази безплатна консултация
          </Button>
        </div>
      </section>

      {/* Services teaser */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-(--gold) font-medium block mb-4">Услуги</span>
            <h2 className="font-serif text-4xl text-(--text-dark) font-normal">Как мога да те подкрепя</h2>
          </div>
          <Link
            href="/uslugi"
            className="shrink-0 text-sm text-(--sage) border border-(--sage) px-5 py-2.5 rounded-full hover:bg-(--sage) hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            Всички услуги
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map(s => (
            <Link
              key={s.slug}
              href={`/uslugi/${s.slug}`}
              className="group flex items-center gap-3 p-5 bg-(--bg-warm) rounded-xl border border-(--border) hover:border-(--sage) hover:bg-white transition-all duration-300"
            >
              <span className="text-xl text-(--sage) shrink-0">{s.icon}</span>
              <span className="text-sm font-medium text-(--text-dark) group-hover:text-(--sage) transition-colors">{s.shortTitle}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
