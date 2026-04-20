import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { services } from '@/data/services'

export default function ServicesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <SectionHeader
        eyebrow="Услуги"
        title="Как мога да те подкрепя"
        subtitle="Работя с хора, готови за истинска промяна — в отношенията, кариерата, здравето и идентичността."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/uslugi/${service.slug}`}
            className="group bg-[var(--bg)] p-8 hover:bg-white transition-colors"
          >
            <span className="text-3xl text-[var(--sage)] block mb-4">{service.icon}</span>
            <h3 className="font-serif text-xl text-[var(--text-dark)] mb-3 group-hover:text-[var(--sage)] transition-colors">
              {service.title}
            </h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">{service.description}</p>
            <span className="block mt-6 text-xs uppercase tracking-widest text-[var(--sage)] group-hover:tracking-[0.3em] transition-all">
              Научи повече →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
