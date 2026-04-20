import Button from '@/components/ui/Button'

const steps = [
  {
    num: '1',
    title: 'Начален разговор',
    text: 'Запазваш безплатна 20-минутна консултация. Изясняваме твоята тема и виждаме дали подходът ми е подходящ за теб — без ангажимент.',
  },
  {
    num: '2',
    title: 'Персонализиран план',
    text: 'Заедно изграждаме подход, съобразен с твоите конкретни нужди и цели — независимо дали работиш с тревожност, отношения, кариера или себепознание.',
  },
  {
    num: '3',
    title: 'Онлайн или на живо сесии',
    text: 'Работим заедно в атмосфера на безопасност и уважение. Всяка сесия завършва с конкретни насоки за интеграция в ежедневието.',
  },
]

export default function ProcessSection() {
  return (
    <section className="bg-(--bg) py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.28em] text-(--gold) font-medium block mb-5">
            Как работя
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-normal leading-tight">
            Просто, удобно, ефективно
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex flex-col items-center text-center px-6">

              {/* Connector arrow — hidden on last step and on mobile */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+52px)] right-0 pointer-events-none">
                  <svg viewBox="0 0 80 24" fill="none" className="w-full max-w-20 mx-auto text-(--border)">
                    <path
                      d="M4 12 Q40 2 76 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      fill="none"
                    />
                    <path
                      d="M70 8 L76 12 L70 16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}

              {/* Large number */}
              <div className="font-serif text-8xl md:text-9xl font-normal text-(--gold)/30 leading-none mb-6 select-none">
                {step.num}
              </div>

              <h3 className="font-serif text-xl md:text-2xl text-(--text-dark) font-normal mb-4 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-(--text-muted) leading-relaxed max-w-[28ch] mx-auto">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer + CTA */}
        <div className="mt-20 text-center">
          <p className="text-xs text-(--text-muted) italic mb-8 max-w-lg mx-auto">
            Сесиите са подкрепящи и развиващи и не заместват медицинска или психотерапевтична грижа.
          </p>
          <Button href="/kontakti" variant="primary" size="lg">
            Запази безплатна консултация
          </Button>
        </div>
      </div>
    </section>
  )
}
