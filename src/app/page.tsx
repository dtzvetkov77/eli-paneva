import { SOCIAL_SCHEMA_URLS } from '@/lib/social-links'
import HeroSection from '@/components/home/HeroSection'
import StatementSection from '@/components/home/StatementSection'
import AboutTeaser from '@/components/home/AboutTeaser'
import ServicesGrid from '@/components/home/ServicesGrid'
import ProcessSection from '@/components/home/ProcessSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CtaSection from '@/components/home/CtaSection'
import StructuredData from '@/components/ui/StructuredData'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://elipaneva.com/#website',
  url: 'https://elipaneva.com',
  name: 'Ели Панева',
  description: 'Холистичен консултант, трансформационен коуч и автор. Системни констелации, PSYCH-K®, МАК карти в София.',
  inLanguage: 'bg',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://elipaneva.com/blog?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://elipaneva.com/#business',
  name: 'Ели Панева — Холистичен консултант',
  alternateName: 'Eli Paneva',
  description: 'Холистичен консултант и трансформационен коуч в София. Системни констелации, PSYCH-K®, МАК карти, лични консултации и работа с подсъзнателни ограничаващи убеждения.',
  url: 'https://elipaneva.com',
  telephone: '+359882420894',
  email: 'elipaneva2023@gmail.com',
  image: 'https://elipaneva.com/eli-photo.webp',
  logo: 'https://elipaneva.com/logo.webp',
  priceRange: '€€',
  currenciesAccepted: 'BGN, EUR',
  paymentAccepted: 'Cash, Bank transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
    addressLocality: 'София',
    addressRegion: 'Sofia-grad',
    postalCode: '1504',
    addressCountry: 'BG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '42.6977',
    longitude: '23.3219',
  },
  areaServed: [
    { '@type': 'City', name: 'София', sameAs: 'https://www.wikidata.org/wiki/Q472' },
    { '@type': 'Country', name: 'България', sameAs: 'https://www.wikidata.org/wiki/Q219' },
  ],
  openingHours: ['Mo-Fr 09:00-18:00'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Системни констелации', url: 'https://elipaneva.com/uslugi/sistemni-konstelatsi' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Лични консултации', url: 'https://elipaneva.com/uslugi/lichni-konsultatsii' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'МАК карти', url: 'https://elipaneva.com/mac-karti' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Работа с ограничаващи убеждения', url: 'https://elipaneva.com/uslugi/promyana-na-ubezhdenia' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Управление на стреса', url: 'https://elipaneva.com/uslugi/upravlenie-na-stressa' } },
    ],
  },
  sameAs: SOCIAL_SCHEMA_URLS,
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://elipaneva.com/#person',
  name: 'Ели Панева',
  jobTitle: 'Холистичен консултант и трансформационен коуч',
  description: 'Холистичен консултант, трансформационен коуч и автор. Подкрепя хората да разпознаят и освободят семейните сценарии и подсъзнателни модели.',
  url: 'https://elipaneva.com',
  image: 'https://elipaneva.com/eli-photo.webp',
  telephone: '+359882420894',
  email: 'elipaneva2023@gmail.com',
  worksFor: { '@id': 'https://elipaneva.com/#business' },
  knowsAbout: ['Системни констелации', 'PSYCH-K®', 'МАК карти', 'Енергийна психология', 'Трансформационен коучинг', 'Семейни констелации'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
    addressLocality: 'София',
    postalCode: '1504',
    addressCountry: 'BG',
  },
  sameAs: SOCIAL_SCHEMA_URLS,
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://elipaneva.com/#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Какво е системна констелация?',
      acceptedAnswer: { '@type': 'Answer', text: 'Системните констелации са метод, разработен от Берт Хелингер, който разкрива невидимите преплитания и лоялности в семейната система. Чрез поставяне на фигури или представители се открояват скрити динамики, предавани от поколение на поколение, и се намират изцеляващи движения за освобождаване от повтарящи се сценарии.' },
    },
    {
      '@type': 'Question',
      name: 'Какво е PSYCH-K®?',
      acceptedAnswer: { '@type': 'Answer', text: 'PSYCH-K® е метод за трансформиране на ограничаващи убеждения на ниво подсъзнание чрез мозъчна интеграция. Работи бързо и ефективно за промяна на дълбоко вкоренени вярвания за себе си, парите, отношенията и здравето.' },
    },
    {
      '@type': 'Question',
      name: 'Провеждат ли се сесиите онлайн?',
      acceptedAnswer: { '@type': 'Answer', text: 'Да. Всички индивидуални сесии с Ели Панева се предлагат онлайн чрез видеовръзка и присъствено в офис в София, бул. Дондуков 65, ет. 1, офис 2. Онлайн форматът е също толкова ефективен и е подходящ за клиенти от цяла България и чужбина.' },
    },
    {
      '@type': 'Question',
      name: 'Какво представляват МАК картите?',
      acceptedAnswer: { '@type': 'Answer', text: 'МАК картите (метафорични асоциативни карти) са проективен инструмент, работещ на символично ниво. Образите заобикалят защитните механизми на ума и дават достъп до подсъзнателни послания, вътрешни ресурси и скрити желания.' },
    },
    {
      '@type': 'Question',
      name: 'Как да запазя час за консултация?',
      acceptedAnswer: { '@type': 'Answer', text: 'Можете да се свържете с Ели Панева на телефон +359 882 420 894, имейл elipaneva2023@gmail.com или чрез формата за контакт на https://elipaneva.com/kontakti. Отговор се получава в рамките на 24 часа в работни дни.' },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <StructuredData data={websiteSchema} />
      <StructuredData data={localBusinessSchema} />
      <StructuredData data={personSchema} />
      <StructuredData data={faqSchema} />
      <HeroSection />
      <StatementSection />
      <AboutTeaser />
      <ServicesGrid />
      <ProcessSection />
      <TestimonialsSection />
<CtaSection />
    </>
  )
}
