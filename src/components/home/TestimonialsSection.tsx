import SectionHeader from '@/components/ui/SectionHeader'
import { testimonials } from '@/data/testimonials'

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <SectionHeader eyebrow="Отзиви" title="Думите на клиентите" centered />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="bg-white border border-(--border) rounded-2xl p-8 relative group hover:border-(--sage) hover:shadow-md transition-all duration-400"
          >
            {/* SVG quote mark */}
            <svg
              className="absolute top-6 right-7 w-8 h-8 text-(--sage-muted) opacity-60"
              viewBox="0 0 40 40"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 26c0-5.523 4.477-10 10-10V10C9.163 10 1 18.163 1 29v1h9v-4zm20 0c0-5.523 4.477-10 10-10V10c-10.837 0-19 8.163-19 19v1h9v-4z" />
            </svg>

            {/* Service badge */}
            {t.service && (
              <span className="inline-block text-xs uppercase tracking-[0.15em] text-(--gold) bg-(--gold-light) px-3 py-1 rounded-full mb-5 font-medium">
                {t.service}
              </span>
            )}

            <p className="text-(--text-dark) leading-relaxed mb-6 text-base">
              „{t.text}"
            </p>

            <footer className="flex items-center gap-3 pt-4 border-t border-(--border-light)">
              <div className="w-8 h-8 rounded-full bg-(--sage-light) flex items-center justify-center shrink-0">
                <span className="font-serif text-sm text-(--sage) font-medium">{t.name[0]}</span>
              </div>
              <span className="text-sm font-medium text-(--text-dark)">{t.name}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
