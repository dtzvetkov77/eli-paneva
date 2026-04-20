import Button from '@/components/ui/Button'

export default function AboutTeaser() {
  return (
    <section className="bg-[var(--sage-light)] py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="aspect-square bg-[var(--sage)]/20 rounded-sm flex items-center justify-center">
          <span className="font-serif text-6xl text-[var(--sage)]/40">Е</span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium block mb-6">За мен</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[var(--text-dark)] leading-tight mb-6">
            Ели Панева
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed mb-4">
            Холистичен консултант, трансформационен коуч и автор с дългогодишен опит в работата с индивидуални клиенти, семейства и бизнес организации.
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed mb-8">
            Специализирам в системни констелации, PSYCH-K®, енергийна психология и метафорични асоциативни карти — методи, работещи на дълбинно ниво за трайна трансформация.
          </p>
          <Button href="/za-men" variant="outline">Запознай се с мен</Button>
        </div>
      </div>
    </section>
  )
}
