import Button from '@/components/ui/Button'

export default function CtaSection() {
  return (
    <section className="bg-[var(--text-dark)] py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium block mb-6">
          Готов/а за промяна?
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
          Започни пътя на трансформацията
        </h2>
        <p className="text-white/60 leading-relaxed mb-10 text-lg">
          Запази безплатна 20-минутна консултация и разбери кой метод е най-подходящ за теб.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/kontakti" variant="primary">
            Запази безплатна консултация
          </Button>
          <Button href="/shop" variant="ghost" className="text-white/70 hover:text-white">
            Разгледай магазина
          </Button>
        </div>
      </div>
    </section>
  )
}
