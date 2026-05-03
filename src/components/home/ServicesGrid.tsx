import Link from 'next/link'
import Button from '@/components/ui/Button'
import { services } from '@/data/services'

export default function ServicesGrid() {
  return (
    <section className="bg-(--bg) py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row — eyebrow + heading + CTA aligned like Mindify */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-4">
            Моите услуги
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal leading-tight max-w-xl">
            Как мога да ви подкрепя по пътя към вътрешна промяна
          </h2>
          <div className="shrink-0">
            <Button href="/kontakti" variant="primary">Запази час</Button>
          </div>
        </div>

        {/* 2×3 horizontal card grid — each card: colored left strip + text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(service => (
            <Link
              key={service.slug}
              href={`/uslugi/${service.slug}`}
              className="group flex rounded-2xl bg-white border border-(--border) overflow-hidden hover:shadow-lg hover:border-(--sage)/40 transition-all duration-300"
            >
              {/* Image / icon side */}
              <div className="w-32 md:w-40 shrink-0 bg-(--bg-warm) relative flex items-center justify-center overflow-hidden">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-(--gold-light)/60 to-(--sage-light)/80" />
                <span className="relative z-10 font-serif text-4xl text-(--sage)/40 select-none group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </span>
              </div>

              {/* Text side */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="font-serif text-lg md:text-xl text-(--text-dark) font-normal leading-snug mb-2 group-hover:text-(--sage) transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-(--text-muted) leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: link to all services */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/uslugi"
            className="text-sm text-(--sage) border border-(--sage) px-6 py-3 rounded-full hover:bg-(--sage) hover:text-white transition-all duration-300 inline-flex items-center gap-2"
          >
            Всички услуги
          </Link>
        </div>

      </div>
    </section>
  )
}
