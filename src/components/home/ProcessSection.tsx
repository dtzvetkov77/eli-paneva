import Button from '@/components/ui/Button'

const steps = [
  {
    num: '01',
    title: 'Начало и фокус на сесията',
    text: 'Сесията започва с кратък разговор, в който изясняваме твоята заявка — тема, въпрос или ситуация, с която искаш да работим. Фокусът се определя заедно, без натиск и без предварителни очаквания.',
  },
  {
    num: '02',
    title: 'Работа по темата',
    text: 'В зависимост от заявката използвам подходящи методи — системни констелации, МАК карти, PSYCH-K®, енергийна психология или коучинг. Работата се води внимателно, с уважение към личните граници и вътрешния ритъм на човека.',
  },
  {
    num: '03',
    title: 'Осъзнаване и интеграция',
    text: 'По време на процеса се създава пространство за осъзнаване, яснота и нов поглед към ситуацията. Целта не е „бързо решение", а дълбоко разбиране и вътрешно подреждане.',
  },
  {
    num: '04',
    title: 'Практични насоки',
    text: 'В края на сесията получаваш конкретни насоки, упражнения или въпроси за интеграция в ежедневието, така че промяната да бъде устойчива.',
  },
]

export default function ProcessSection() {
  return (
    <section className="bg-(--bg-warm) py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-(--gold) font-medium block mb-4">Как работя</span>
            <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal leading-tight">
              Как протича<br />една сесия?
            </h2>
          </div>
          <blockquote className="max-w-sm text-(--text-muted) text-base leading-relaxed border-l-2 border-(--gold) pl-5 italic font-serif">
            Всяка сесия протича в спокойно, безопасно и поверително пространство, съобразено с твоята тема и вътрешна готовност.
          </blockquote>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-7 border border-(--border) hover:border-(--sage) hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-(--sage) flex items-center justify-center mb-5">
                <span className="text-white font-medium text-sm">{step.num}</span>
              </div>
              <h3 className="font-serif text-lg text-(--text-dark) mb-3 font-normal leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-(--text-muted) leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-(--text-muted) text-center mb-8 italic">
          Сесиите са подкрепящи и развиващи и не заместват медицинска или психотерапевтична грижа.
        </p>

        <div className="text-center">
          <Button href="/kontakti" variant="primary" size="lg">Свържи се с мен</Button>
        </div>
      </div>
    </section>
  )
}
