import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'
import { getProducts } from '@/lib/woocommerce'
import ProductCard from '@/components/shop/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Курсове',
  description: 'Онлайн курсове за личностно развитие, системни констелации и МАК карти с Ели Панева.',
  alternates: { canonical: 'https://elipaneva.com/kursove' },
}

export default async function CoursesPage() {
  let allProducts: Awaited<ReturnType<typeof getProducts>> = []
  try { allProducts = await getProducts() } catch { /* API unavailable */ }
  const courseProducts = allProducts.filter(p =>
    p.categories.some(c =>
      c.slug.includes('course') ||
      c.slug.includes('kurs') ||
      c.name.toLowerCase().includes('курс') ||
      c.name.toLowerCase().includes('обучение')
    ) ||
    p.name.toLowerCase().includes('курс') ||
    p.name.toLowerCase().includes('обучение') ||
    p.name.toLowerCase().includes('уебинар')
  )

  return (
    <div className="pt-16">
      <div className="bg-(--sage-light) py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Курсове"
            title="Онлайн обучения"
            subtitle="Научи се да работиш с мощни методи за трансформация от удобството на дома си."
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {courseProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[
              {
                title: 'Онлайн обучение за работа с МАК карти',
                desc: 'Пълен курс за специалисти помагащи професии и всички, които искат да работят с метафорични асоциативни карти.',
                badge: 'Онлайн курс',
              },
              {
                title: 'Уебинар МАК карти',
                desc: 'Въвеждащ уебинар в света на метафоричните асоциативни карти — теория и практика.',
                badge: 'Уебинар',
              },
            ].map(c => (
              <div key={c.title} className="border border-(--border) p-8">
                <span className="text-xs uppercase tracking-widest text-(--gold) block mb-3">{c.badge}</span>
                <h3 className="font-serif text-2xl text-(--text-dark) mb-3">{c.title}</h3>
                <p className="text-(--text-muted) text-sm leading-relaxed mb-6">{c.desc}</p>
                <Button href="/kontakti" variant="outline">Запитване</Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-(--text-dark) p-12 text-center">
          <h2 className="font-serif text-3xl text-white mb-4">Търсиш нещо конкретно?</h2>
          <p className="text-white/60 mb-8">Свържи се с Ели и ще намерим най-подходящата програма за теб.</p>
          <Button href="/kontakti" variant="outline" className="border-white text-white hover:bg-white hover:text-(--text-dark)">
            Свържи се
          </Button>
        </div>
      </div>
    </div>
  )
}
