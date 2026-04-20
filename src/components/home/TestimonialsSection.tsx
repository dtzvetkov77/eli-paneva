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
    <section className="bg-white py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-5">
            Какво казват клиентите
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal">
            Истински истории, истинско въздействие
          </h2>
        </div>

        {/* Horizontal scroll carousel — no JS needed */}
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="shrink-0 w-80 md:w-96 snap-start bg-(--bg) rounded-2xl border border-(--border) p-8"
            >
              <Stars />

              <p className="text-(--text-mid) leading-relaxed mb-6 text-base">
                „{t.text}"
              </p>

              <footer className="flex items-center gap-3 pt-5 border-t border-(--border-light)">
                <div className="w-9 h-9 rounded-full bg-(--sage-light) flex items-center justify-center shrink-0">
                  <span className="font-serif text-sm text-(--sage) font-medium">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-(--text-dark) leading-none">{t.name}</p>
                  {t.service && (
                    <p className="text-xs text-(--text-muted) mt-1">{t.service}</p>
                  )}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${i === 0 ? 'w-6 h-2 bg-(--gold)' : 'w-2 h-2 bg-(--border)'}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
