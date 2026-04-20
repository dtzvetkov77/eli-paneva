import Button from '@/components/ui/Button'

const credentials = [
  'Системни констелации',
  'PSYCH-K®',
  'МАК карти',
  'Енергийна психология',
  'Игра Лийла',
]

const stats = [
  { value: '500+', label: 'клиенти, насочени към по-голямо вътрешно равновесие' },
  { value: '95%', label: 'от клиентите усещат разлика след само няколко сесии' },
  { value: '10+', label: 'години опит в холистичното консултиране' },
]

export default function AboutTeaser() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Two-column: photo left, text right — mirrors Mindify layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">

          {/* Left: photo + caption */}
          <div>
            <div className="aspect-4/5 bg-(--bg-warm) rounded-2xl overflow-hidden relative">
              <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-(--gold)/50 rounded-tl-sm" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-(--gold)/50 rounded-br-sm" />
              {/* Replace with <Image> once photo is available */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[160px] text-(--sage)/10 select-none leading-none">Е</span>
              </div>
            </div>
            <div className="mt-5 text-center">
              <p className="font-serif text-lg text-(--text-dark) font-normal">Ели Панева</p>
              <p className="text-sm text-(--text-muted) mt-1">Холистичен консултант · Трансформационен коуч</p>
            </div>
          </div>

          {/* Right: bio + credentials */}
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-6">
              Запознайте се с мен
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal leading-tight mb-8">
              Надежден партньор за вашето емоционално благополучие
            </h2>
            <p className="text-(--text-muted) leading-relaxed mb-5">
              Аз съм Ели Панева. Вярвам, че всеки заслужава пространство, в което да говори, да бъде чут и да расте. С повече от 10 години опит като холистичен консултант, помогнах на стотици хора да преодолеят предизвикателства като тревожност, проблеми в отношенията и житейски преходи.
            </p>
            <p className="text-(--text-muted) leading-relaxed mb-8">
              Специализирам в методи, работещи на дълбинно ниво — системни констелации, PSYCH-K®, МАК карти и енергийна психология. Моят подход е топъл, без осъждане и изцяло насочен към теб.
            </p>

            {/* Credential badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {credentials.map(c => (
                <span
                  key={c}
                  className="text-xs text-(--text-muted) border border-(--border) px-4 py-1.5 rounded-full"
                >
                  ✓ {c}
                </span>
              ))}
            </div>

            <Button href="/za-men" variant="primary">Разбери повече</Button>
          </div>
        </div>

        {/* Stats bar — full width below the grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-(--border) pt-12">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`text-center px-8 py-6 ${i < stats.length - 1 ? 'md:border-r border-(--border)' : ''}`}
            >
              <div className="font-serif text-5xl md:text-6xl text-(--gold) font-normal leading-none mb-3">
                {s.value}
              </div>
              <p className="text-sm text-(--text-muted) leading-relaxed max-w-[22ch] mx-auto">
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
