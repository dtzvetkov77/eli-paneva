import SectionHeader from '@/components/ui/SectionHeader'
import { testimonials } from '@/data/testimonials'

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <SectionHeader eyebrow="Отзиви" title="Думите на клиентите" centered />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="bg-white border border-[var(--border)] p-8 relative"
          >
            <span className="absolute top-4 right-6 font-serif text-7xl text-[var(--sage-light)] leading-none select-none">"</span>
            <p className="text-[var(--text-dark)] leading-relaxed mb-6 relative z-10">„{t.text}"</p>
            <footer className="flex items-center gap-3">
              <div className="w-8 h-px bg-[var(--gold)]" />
              <span className="text-sm font-medium text-[var(--text-dark)]">{t.name}</span>
              {t.service && <span className="text-xs text-[var(--text-muted)]">· {t.service}</span>}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
