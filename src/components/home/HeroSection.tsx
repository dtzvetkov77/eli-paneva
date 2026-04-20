import Button from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'

const pills = [
  { label: 'Констелации', href: '/uslugi/sistemni-konstelatsi' },
  { label: 'МАК карти', href: '/shop/category/карти-и-талисмани' },
  { label: 'PSYCH-K®', href: '/uslugi/trevozhnost-i-paniki' },
  { label: 'Игра Лийла', href: '/uslugi/igra-liyla' },
]

const floatingLabels = [
  { label: 'Поверително', color: 'bg-(--gold)', position: 'top-10 -right-5' },
  { label: 'Безопасно', color: 'bg-(--sage)', position: 'top-2/5 -left-6' },
  { label: 'Трансформиращо', color: 'bg-(--text-dark)', position: 'bottom-14 -right-5' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-(--bg) pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Left: Text */}
          <div className="animate-fade-up order-2 md:order-1">
            <p className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium mb-6 md:mb-8">
              Холистичен консултант · Трансформационен коуч
            </p>

            <h1
              className="font-serif text-(--text-dark) font-normal leading-[1.08] mb-6 md:mb-8"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
            >
              Намерете мира.<br />Намерете себе си.
            </h1>

            <p className="text-(--text-muted) text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-[44ch]">
              Подкрепям хората в процеса на вътрешна промяна чрез системни констелации, PSYCH-K®, енергийна психология и МАК карти.
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
              {pills.map(p => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="text-xs text-(--text-muted) border border-(--border) hover:border-(--sage) hover:text-(--sage) px-4 py-2 rounded-full transition-all duration-200"
                >
                  {p.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Button href="/kontakti" variant="primary" size="lg">Запази час</Button>
              <Button href="/uslugi" variant="outline" size="lg">Разгледай услугите</Button>
            </div>
          </div>

          {/* Right: Photo — visible on both mobile and desktop */}
          <div className="relative order-1 md:order-2 animate-fade-in delay-200">
            {/* max-w-xs on mobile keeps the photo small enough to look sharp */}
            <div className="max-w-xs sm:max-w-sm md:max-w-none mx-auto">
              <div className="aspect-square md:aspect-4/5 rounded-3xl overflow-hidden relative bg-(--bg-warm)">
                <Image
                  src="/eli-photo.webp"
                  alt="Ели Панева — холистичен консултант и трансформационен коуч"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 50vw"
                />
              </div>
            </div>

            {/* Floating labels — hidden on small mobile, shown from sm up */}
            {floatingLabels.map(l => (
              <div
                key={l.label}
                className={`absolute ${l.position} hidden sm:flex bg-white rounded-full px-4 py-2 md:px-5 md:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] items-center gap-2.5 border border-(--border-light)`}
              >
                <span className={`w-2 h-2 rounded-full ${l.color} inline-block shrink-0`} />
                <span className="text-xs md:text-sm font-medium text-(--text-dark) whitespace-nowrap">{l.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
