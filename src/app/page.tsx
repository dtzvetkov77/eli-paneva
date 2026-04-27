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
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
    addressLocality: 'София',
    postalCode: '1504',
    addressCountry: 'BG',
  },
  sameAs: SOCIAL_SCHEMA_URLS,
}

export default function HomePage() {
  return (
    <>
      <StructuredData data={websiteSchema} />
      <StructuredData data={personSchema} />
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
