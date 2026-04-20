import { testimonials } from '@/data/testimonials'

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 звезди">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-(--gold)" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M8 1.5l1.647 3.337 3.681.536-2.664 2.596.629 3.665L8 9.787l-3.293 1.732.629-3.665-2.664-2.596 3.681-.536L8 1.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-(--bg-warm) py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-5">
            Отзиви
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal">
            Истории от клиенти
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="bg-white rounded-2xl p-8 border border-(--border) hover:shadow-md transition-shadow duration-300"
            >
              <Stars />

              {t.service && (
                <span className="inline-block text-xs uppercase tracking-[0.15em] text-(--gold) bg-(--gold-light) px-3 py-1 rounded-full mb-5 font-medium">
                  {t.service}
                </span>
              )}

              <p className="text-(--text-mid) leading-relaxed mb-6 text-base">
                „{t.text}"
              </p>

              <footer className="flex items-center gap-3 pt-5 border-t border-(--border-light)">
                <div className="w-9 h-9 rounded-full bg-(--sage-light) flex items-center justify-center shrink-0">
                  <span className="font-serif text-sm text-(--sage) font-medium">{t.name[0]}</span>
                </div>
                <span className="text-sm font-medium text-(--text-dark)">{t.name}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
