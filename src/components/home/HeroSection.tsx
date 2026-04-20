import Button from '@/components/ui/Button'
import Link from 'next/link'

const pills = [
  { label: 'Констелации', href: '/uslugi/sistemni-konstelatsi' },
  { label: 'МАК карти', href: '/shop/category/карти-и-талисмани' },
  { label: 'PSYCH-K®', href: '/uslugi/trevozhnost-i-paniki' },
  { label: 'Игра Лийла', href: '/uslugi/igra-liyla' },
]

const floatingLabels = [
  { label: 'Поверително', color: 'bg-(--gold)', position: 'top-12 -right-6' },
  { label: 'Безопасно', color: 'bg-(--sage)', position: 'top-2/5 -left-7' },
  { label: 'Трансформиращо', color: 'bg-(--text-dark)', position: 'bottom-16 -right-6' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh flex items-center overflow-hidden bg-(--bg) pt-16">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center w-full">

        {/* Left: Text */}
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium mb-8">
            Холистичен консултант · Трансформационен коуч
          </p>

          <h1
            className="font-serif text-(--text-dark) font-normal leading-[1.08] mb-8"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)' }}
          >
            Намерете мира.<br />Намерете себе си.
          </h1>

          <p className="text-(--text-muted) text-lg leading-relaxed mb-10 max-w-[44ch]">
            Подкрепям хората в процеса на вътрешна промяна чрез системни констелации, PSYCH-K®, енергийна психология и МАК карти.
          </p>

          {/* Service pills */}
          <div className="flex flex-wrap gap-2 mb-10">
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

        {/* Right: Photo with floating labels */}
        <div className="relative hidden md:block animate-fade-in delay-200">
          <div className="w-full aspect-4/5 bg-(--bg-warm) rounded-3xl overflow-hidden relative">
            {/* Decorative corner frames */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-(--gold)/60 rounded-tl-sm" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-(--gold)/60 rounded-br-sm" />
            {/* Monogram placeholder — replace with <Image> once photo is available */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-[170px] text-(--sage)/10 select-none leading-none">Е</span>
            </div>
          </div>

          {/* Floating labels */}
          {floatingLabels.map(l => (
            <div
              key={l.label}
              className={`absolute ${l.position} bg-white rounded-full px-5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-2.5 border border-(--border-light)`}
            >
              <span className={`w-2 h-2 rounded-full ${l.color} inline-block shrink-0`} />
              <span className="text-sm font-medium text-(--text-dark) whitespace-nowrap">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
