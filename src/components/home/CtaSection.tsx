import Button from '@/components/ui/Button'

const benefits = [
  'Без ангажимент',
  'Онлайн или на живо',
  'На английски или български',
]

export default function CtaSection() {
  return (
    <section className="relative bg-(--text-dark) py-28 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-(--sage)/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-(--gold)/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-(--gold) font-medium block mb-8">
          Готов/а за промяна?
        </span>

        <h2 className="font-serif text-4xl md:text-6xl font-light text-white leading-tight mb-6">
          Започни пътя на<br />
          <em className="text-(--sage-muted) not-italic">трансформацията</em>
        </h2>

        <p className="text-white/50 leading-relaxed mb-4 text-lg max-w-xl mx-auto">
          Запази безплатна 20-минутна консултация и разбери кой метод е най-подходящ за теб.
        </p>

        {/* Benefit pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {benefits.map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-(--gold) inline-block" />
              {b}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/kontakti" variant="primary" size="lg">
            Запази безплатна консултация
          </Button>
          <Button href="/shop" variant="dark" size="lg">
            Разгледай магазина
          </Button>
        </div>
      </div>
    </section>
  )
}
