import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--sage-light)] via-[var(--bg)] to-[var(--bg)]" />
      <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium block mb-6">
            Холистичен консултант · Трансформационен коуч · Автор
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-[var(--text-dark)] leading-[1.05] mb-8">
            Трансформация<br />
            <em className="text-[var(--sage)] not-italic">отвътре</em>
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-md mb-10">
            Подкрепям хората в процеса на вътрешна промяна и личностно развитие чрез системни констелации, енергийна психология, PSYCH-K® и метафорични асоциативни карти.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/kontakti" variant="primary">Запази час</Button>
            <Button href="/uslugi" variant="outline">Разгледай услугите</Button>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-4">
          <div className="aspect-[4/5] bg-[var(--sage-light)] relative overflow-hidden flex items-end p-8">
            <blockquote className="text-[var(--text-dark)] font-serif text-2xl italic leading-snug">
              „Всяка трансформация<br />започва с осъзнаването."
            </blockquote>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Системни констелации', 'PSYCH-K®', 'МАК карти'].map(tag => (
              <div key={tag} className="bg-white border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] text-center">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
