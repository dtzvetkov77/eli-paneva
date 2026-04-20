import Button from '@/components/ui/Button'

const credentials = [
  'Системни констелации',
  'PSYCH-K®',
  'Енергийна психология',
  'МАК карти',
]

const stats = [
  { value: '10+', label: 'години опит' },
  { value: '500+', label: 'клиенти' },
  { value: '4', label: 'метода' },
]

export default function AboutTeaser() {
  return (
    <section className="bg-(--bg-warm) py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Image column — no negative-margin floating cards */}
        <div className="flex flex-col gap-5">
          <div className="aspect-4/5 bg-(--sage-light) relative overflow-hidden rounded-2xl">
            {/* Corner frame decoration */}
            <div className="absolute top-5 left-5 w-14 h-14 border-t-2 border-l-2 border-(--gold) z-10 rounded-tl-sm" />
            <div className="absolute bottom-5 right-5 w-14 h-14 border-b-2 border-r-2 border-(--gold) z-10 rounded-br-sm" />
            {/* Monogram placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-8xl text-(--sage)/25 select-none">Е</span>
            </div>
          </div>

          {/* Stats row — inline, no overflow */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 text-center border border-(--border)">
                <div className="font-serif text-2xl text-(--text-dark) font-medium">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-(--text-muted) mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Text column */}
        <div>
          <span className="text-xs uppercase tracking-[0.22em] text-(--gold) font-medium block mb-6">За мен</span>
          <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) leading-tight mb-6 font-normal">
            Ели Панева
          </h2>
          <p className="text-(--text-muted) leading-relaxed mb-4">
            Холистичен консултант, трансформационен коуч и автор с дългогодишен опит в работата с индивидуални клиенти, семейства и бизнес организации.
          </p>
          <p className="text-(--text-muted) leading-relaxed mb-8">
            Специализирам в методи, работещи на дълбинно ниво — за трайна трансформация, а не временни промени.
          </p>

          {/* Credential tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {credentials.map(c => (
              <span
                key={c}
                className="text-xs border border-(--sage-muted) text-(--sage) px-3 py-1.5 rounded-full font-medium"
              >
                {c}
              </span>
            ))}
          </div>

          <Button href="/za-men" variant="outline">Запознай се с мен</Button>
        </div>
      </div>
    </section>
  )
}
