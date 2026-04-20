import HeroSection from '@/components/home/HeroSection'
import AboutTeaser from '@/components/home/AboutTeaser'
import ServicesGrid from '@/components/home/ServicesGrid'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import BlogPreview from '@/components/home/BlogPreview'
import CtaSection from '@/components/home/CtaSection'
import StructuredData from '@/components/ui/StructuredData'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ели Панева',
  jobTitle: 'Холистичен консултант и трансформационен коуч',
  url: 'https://elipaneva.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
    addressLocality: 'София',
    addressCountry: 'BG',
  },
  telephone: '+359882420894',
  email: 'elipaneva2023@gmail.com',
  sameAs: [
    'https://www.facebook.com/elipaneva',
    'https://www.instagram.com/elipaneva',
  ],
}

export default function HomePage() {
  return (
    <>
      <StructuredData data={personSchema} />
      <HeroSection />
      <ServicesGrid />
      <AboutTeaser />
      <TestimonialsSection />
      <BlogPreview />
      <CtaSection />
    </>
  )
}
