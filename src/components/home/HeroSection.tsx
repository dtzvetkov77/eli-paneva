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
  { label: 'Поверително', color: 'bg-(--gold)', position: 'top-8 -right-4' },
  { label: 'Безопасно', color: 'bg-(--sage)', position: 'top-2/5 -left-5' },
  { label: 'Трансформиращо', color: 'bg-(--text-dark)', position: 'bottom-12 -right-4' },
]

export default function HeroSection() {
  return (
    <section className="relative bg-(--bg) pt-16 overflow-x-hidden min-h-dvh flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-0 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Photo column — first on mobile, second on desktop */}
          <div className="order-1 md:order-2 animate-fade-in delay-200">
            {/* Constrain width on mobile so it's a clean small card */}
            <div className="max-w-64 sm:max-w-xs md:max-w-none mx-auto relative">

              {/* Photo */}
              <div className="aspect-square md:aspect-3/2 rounded-3xl overflow-hidden relative bg-(--bg-warm)">
                <Image
                  src="/eli-photo.webp"
                  alt="Ели Панева"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 45vw"
                />
              </div>

              {/* Caption below photo */}
              <div className="mt-3 text-center">
                <p className="font-serif text-base text-(--text-dark) font-normal leading-snug">Ели Панева</p>
                <p className="text-xs text-(--text-muted) mt-0.5">Холистичен консултант · Трансформационен коуч</p>
              </div>

              {/* Floating labels — only on md+ to avoid overflow on mobile */}
              {floatingLabels.map(l => (
                <div
                  key={l.label}
                  className={`absolute ${l.position} hidden md:flex bg-white rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)] items-center gap-2 border border-(--border-light)`}
                >
                  <span className={`w-2 h-2 rounded-full ${l.color} inline-block shrink-0`} />
                  <span className="text-xs font-medium text-(--text-dark) whitespace-nowrap">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text column — second on mobile, first on desktop */}
          <div className="order-2 md:order-1 animate-fade-up text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium mb-5">
              Холистичен консултант · Трансформационен коуч
            </p>

            <h1
              className="font-serif text-(--text-dark) font-normal leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)' }}
            >
              Освободи вътрешните блокажи<br />и създай живот с повече<br /><em className="text-(--sage)">лекота, яснота и увереност</em>
            </h1>

            <p className="text-(--text-muted) text-base leading-relaxed mb-7 max-w-[42ch] mx-auto md:mx-0">
              <strong className="text-(--text-dark)">Аз съм Ели Панева – трансформационен коуч и холистичен консултант.</strong> Подкрепям хората в процеса на лична промяна чрез системни констелации, PSYCH-K®, енергийна психология и МАК карти.
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap gap-2 mb-7 justify-center md:justify-start">
              {pills.map(p => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="text-xs text-(--text-muted) border border-(--border) hover:border-(--sage) hover:text-(--sage) px-3 py-1.5 rounded-full transition-all duration-200"
                >
                  {p.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
              <Button href="/kontakti" variant="primary" size="lg">Запази час</Button>
              <Button href="/uslugi" variant="outline" size="lg">Разгледай услугите</Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
