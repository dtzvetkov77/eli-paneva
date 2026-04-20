import Button from '@/components/ui/Button'

export default function CtaSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Warm layered background — mimics Mindify's stone/marble texture */}
      <div className="absolute inset-0 bg-(--bg-warm)" />
      <div className="absolute inset-0 bg-linear-to-br from-(--gold-light)/60 via-(--bg-warm) to-(--sage-light)/40" />
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-(--gold-light)/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-(--sage-light)/60 blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-6">
          Вашето ново начало
        </span>

        <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal leading-tight mb-6">
          Направете първата стъпка<br />към живота, който заслужавате
        </h2>

        <p className="text-(--text-muted) text-lg leading-relaxed mb-10 max-w-[40ch] mx-auto">
          Над 500 клиенти са си върнали увереността, подобрили са отношенията си и са открили вътрешен мир. И вие можете.
        </p>

        <Button href="/kontakti" variant="primary" size="lg">
          Запази час
        </Button>
      </div>
    </section>
  )
}
