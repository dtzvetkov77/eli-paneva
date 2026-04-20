import Button from '@/components/ui/Button'
import StructuredData from '@/components/ui/StructuredData'
import { getProducts } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'МАК карти',
  description: 'Метафорични асоциативни карти (МАК) — индивидуални сесии, обучения и комплекти. Работи с вътрешната си мъдрост чрез образи с Ели Панева.',
  alternates: { canonical: 'https://elipaneva.com/mac-karti' },
}

const benefits = [
  { title: 'Достъп до подсъзнанието', desc: 'Образите заобикалят защитните механизми на ума и позволяват достъп до по-дълбоките слоеве.' },
  { title: 'Без нужда от интерпретация', desc: 'Всяка карта носи точно онова послание, от което имаш нужда в момента — няма грешен избор.' },
  { title: 'За всяка тема', desc: 'Отношения, кариера, здраве, себепознание — МАК картите работят с всяка сфера от живота.' },
  { title: 'Индивидуален и групов формат', desc: 'Подходящи за лична работа, групови сесии, коучинг и обучение.' },
]

export default async function MacKartiPage() {
  let allProducts: Awaited<ReturnType<typeof getProducts>> = []
  try { allProducts = await getProducts() } catch { /* API unavailable */ }
  const macProducts = allProducts
    .filter(p =>
      p.name.toLowerCase().includes('мак') ||
      p.name.toLowerCase().includes('карт') ||
      p.categories.some(c => c.slug.includes('kart') || c.slug.includes('card') || c.name.toLowerCase().includes('карт'))
    )
    .slice(0, 6)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'МАК карти — Метафорични асоциативни карти',
    description: 'Индивидуални сесии, обучения и продукти с метафорични асоциативни карти.',
    provider: { '@type': 'Person', name: 'Ели Панева', url: 'https://elipaneva.com' },
    url: 'https://elipaneva.com/mac-karti',
    areaServed: { '@type': 'City', name: 'София' },
  }

  return (
    <div className="pt-16">
      <StructuredData data={serviceSchema} />

      {/* Hero */}
      <section className="bg-[var(--sage-light)] py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium block mb-6">
              Метафорични асоциативни карти
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--text-dark)] font-light leading-tight mb-8">
              МАК карти
            </h1>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              МАК картите са мощен проективен инструмент за работа с подсъзнателните послания, скрити желания и вътрешни ресурси. Работят на символично ниво, заобикаляйки защитните механизми на ума.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-8">
              Предлагам индивидуални сесии с МАК карти, обучения за специалисти и физически комплекти за самостоятелна практика.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/kontakti" variant="primary">Запази сесия с МАК</Button>
              <Button href="/shop" variant="outline">Купи карти</Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {['Себепознание', 'Отношения', 'Цели', 'Ресурси'].map((tag, i) => (
              <div
                key={tag}
                className={`aspect-square flex items-center justify-center font-serif text-lg text-[var(--text-dark)] border border-[var(--border)] ${i % 2 === 0 ? 'bg-white' : 'bg-[var(--sage)]/10'}`}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium block mb-4">Защо МАК карти</span>
          <h2 className="font-serif text-4xl text-[var(--text-dark)]">Силата на образите</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map(b => (
            <div key={b.title} className="flex gap-6 p-6 border border-[var(--border)]">
              <span className="text-[var(--sage)] text-2xl mt-1">◎</span>
              <div>
                <h3 className="font-serif text-lg text-[var(--text-dark)] mb-2">{b.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="bg-[var(--sage-light)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium block mb-4">Формати</span>
            <h2 className="font-serif text-4xl text-[var(--text-dark)]">Как можем да работим</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Индивидуална сесия', desc: 'Лична работа с МАК карти — онлайн или присъствено в София. 60-90 минути.', cta: 'Запази сесия', href: '/kontakti' },
              { title: 'Онлайн обучение', desc: 'Научи се да работиш с МАК карти самостоятелно или като специалист помагащи професии.', cta: 'Виж курсовете', href: '/kursove' },
              { title: 'Комплекти карти', desc: 'Физически комплекти с МАК карти за самостоятелна практика и работа с клиенти.', cta: 'Разгледай магазина', href: '/shop' },
            ].map(f => (
              <div key={f.title} className="bg-white p-8">
                <h3 className="font-serif text-xl text-[var(--text-dark)] mb-3">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">{f.desc}</p>
                <Button href={f.href} variant="outline">{f.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      {macProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium block mb-4">Магазин</span>
            <h2 className="font-serif text-4xl text-[var(--text-dark)]">Продукти с МАК карти</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {macProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--text-dark)] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium block mb-6">Готов/а?</span>
          <h2 className="font-serif text-4xl text-white font-light mb-6">
            Остави образите да говорят
          </h2>
          <p className="text-white/60 mb-10">
            Запази индивидуална сесия с МАК карти и открий посланията, които чакат да бъдат чути.
          </p>
          <Button href="/kontakti" variant="primary" className="bg-[var(--sage)] hover:bg-white hover:text-[var(--text-dark)]">
            Запази сесия
          </Button>
        </div>
      </section>
    </div>
  )
}
