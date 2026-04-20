import Button from '@/components/ui/Button'

const stats = [
  { value: '10+', label: 'години опит' },
  { value: '500+', label: 'трансформирани животи' },
  { value: '4', label: 'метода' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-(--bg)">

      {/* Soft background gradient — no clip-path, no overlap */}
      <div className="absolute inset-0 bg-gradient-to-br from-(--bg-warm)/60 via-(--bg) to-(--bg) pointer-events-none" aria-hidden />
      <div className="absolute top-1/3 right-[8%] w-80 h-80 rounded-full bg-(--sage-light) opacity-50 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/3 left-[5%] w-48 h-48 rounded-full bg-(--gold-light) opacity-70 blur-2xl pointer-events-none" aria-hidden />

      {/* Main content — grows to fill space */}
      <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-6 pt-28 pb-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* Left: Text */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-8 h-px bg-(--gold)" />
              <span className="text-xs uppercase tracking-[0.25em] text-(--gold) font-medium">
                Холистичен консултант · Коуч · Автор
              </span>
            </div>

            <h1
              className="font-serif text-(--text-dark) mb-6 font-normal"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)', lineHeight: 1.1 }}
            >
              Трансформация<br />
              <em className="text-(--sage)">отвътре</em>
            </h1>

            <p className="text-(--text-muted) text-lg leading-relaxed max-w-[44ch] mb-10">
              Подкрепям хората в процеса на вътрешна промяна чрез системни констелации, PSYCH-K®, енергийна психология и МАК карти.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button href="/kontakti" variant="primary" size="lg">
                Запази час
              </Button>
              <Button href="/uslugi" variant="outline" size="lg">
                Услуги
              </Button>
            </div>
          </div>

          {/* Right: Image + quote — no negative margins */}
          <div className="hidden md:flex flex-col gap-5 animate-fade-up delay-200">
            <div className="relative aspect-4/5 bg-(--sage-light) rounded-2xl overflow-hidden">
              {/* Decorative inner frame */}
              <div className="absolute inset-4 border border-(--sage-muted)/40 rounded-xl pointer-events-none z-10" />
              {/* Quote overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-(--text-dark)/75 to-transparent p-8 z-20 rounded-b-2xl">
                <blockquote className="font-serif text-white text-xl font-normal italic leading-snug">
                  „Всяка трансформация<br />започва с осъзнаването."
                </blockquote>
              </div>
              {/* Monogram placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-(--sage-muted)/30 select-none leading-none" style={{ fontSize: '12rem' }}>Е</span>
              </div>
            </div>

            {/* Method tags */}
            <div className="grid grid-cols-3 gap-2">
              {['Системни констелации', 'PSYCH-K®', 'МАК карти'].map(tag => (
                <div
                  key={tag}
                  className="bg-white border border-(--border) rounded-full px-3 py-2.5 text-[10px] uppercase tracking-wider text-(--text-muted) text-center font-medium"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar — sits naturally at bottom, no absolute overlap */}
      <div className="relative border-t border-(--border) bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 divide-x divide-(--border)">
          {stats.map(s => (
            <div key={s.label} className="text-center px-4">
              <div className="font-serif text-2xl md:text-3xl text-(--text-dark) font-medium">{s.value}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-(--text-muted) mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
