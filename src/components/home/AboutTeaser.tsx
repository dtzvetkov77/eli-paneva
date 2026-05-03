import Button from '@/components/ui/Button'
import Image from 'next/image'

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
  { value: '15+', label: 'години опит в холистичното консултиране' },
]

export default function AboutTeaser() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Two-column: photo left, text right — mirrors Mindify layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">

          {/* Left: photo + caption */}
          <div>
            <div className="aspect-3/2 bg-(--bg-warm) rounded-2xl overflow-hidden relative">
              <Image
                src="/eli-photo.webp"
                alt="Ели Панева"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
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
              Твоето пространство за вътрешна промяна, яснота и емоционален баланс
            </h2>
            <p className="text-(--text-muted) leading-relaxed mb-4">
              <strong className="text-(--text-dark)">Аз съм Ели Панева – трансформационен коуч и холистичен консултант.</strong> Вярвам, че всеки човек има нужда от сигурно пространство, в което да бъде чут, разбран и подкрепен по пътя към себе си.
            </p>
            <p className="text-(--text-muted) leading-relaxed mb-4">
              Повече от 15 години работя с хора, които преминават през тревожност, вътрешно напрежение, трудности във взаимоотношенията, усещане за застой, житейски промени или повтарящи се модели, които не успяват да променят само с воля и логика.
            </p>
            <p className="text-(--text-muted) leading-relaxed mb-4">
              В моята работа съчетавам дълбинни и трансформационни методи като <strong className="text-(--text-dark)">системни констелации, PSYCH-K®, енергийна психология и метафорични асоциативни карти МАК</strong>. Те помагат да се достигне до подсъзнателни убеждения, емоционални блокажи и родови модели, които често стоят зад трудностите в живота.
            </p>
            <p className="text-(--text-muted) leading-relaxed mb-8">
              <strong className="text-(--text-dark)">Моят подход е топъл, личен и без осъждане.</strong> Работим заедно в темпото, което е подходящо за теб, с фокус върху повече вътрешна яснота, спокойствие, увереност и реална промяна в ежедневието ти. <strong className="text-(--text-dark)">Тук не е нужно да бъдеш „силен" през цялото време.</strong>
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
