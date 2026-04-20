import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { services } from '@/data/services'

export default function ServicesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <SectionHeader
        eyebrow="Услуги"
        title="Как мога да те подкрепя"
        subtitle="Работя с хора, готови за истинска промяна — в отношенията, кариерата, здравето и идентичността."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, i) => (
          <Link
            key={service.slug}
            href={`/uslugi/${service.slug}`}
            className={[
              'group relative bg-white border border-(--border) rounded-2xl p-8',
              'hover:border-(--sage) hover:shadow-lg',
              'transition-all duration-400 ease-out',
              'flex flex-col',
            ].join(' ')}
          >
            {/* Index number */}
            <span className="absolute top-6 right-7 font-serif text-5xl text-(--border) group-hover:text-(--sage-light) transition-colors duration-400 select-none leading-none">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Icon */}
            <div className={[
              'w-12 h-12 rounded-full flex items-center justify-center mb-6',
              'bg-(--sage-light) text-(--sage) text-xl',
              'group-hover:bg-(--sage) group-hover:text-white transition-all duration-300',
            ].join(' ')}>
              {service.icon}
            </div>

            {/* Content */}
            <h3 className="font-serif text-xl text-(--text-dark) mb-3 group-hover:text-(--sage) transition-colors duration-300 font-normal">
              {service.title}
            </h3>
            <p className="text-(--text-muted) text-sm leading-relaxed flex-1 mb-6">
              {service.description}
            </p>

            {/* Arrow */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-(--sage) font-medium">
              <span>Научи повече</span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="transform group-hover:translate-x-1 transition-transform duration-300"
                aria-hidden
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
