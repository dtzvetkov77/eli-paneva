import Link from 'next/link'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Страницата не е намерена',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 text-center py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-(--gold) font-medium mb-6">Грешка 404</p>
        <h1 className="font-serif text-5xl md:text-6xl text-(--text-dark) font-normal mb-6 leading-tight">
          Страницата не е намерена
        </h1>
        <p className="text-(--text-muted) leading-relaxed mb-10">
          Страницата, която търсите, не съществува или е преместена.
          Провери URL адреса или се върни към началото.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary">Към началото</Button>
          <Button href="/blog" variant="outline">Блог</Button>
          <Button href="/uslugi" variant="outline">Услуги</Button>
        </div>
        <div className="mt-16 pt-8 border-t border-(--border)">
          <p className="text-sm text-(--text-muted) mb-4">Търсите нещо конкретно?</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              { label: 'Магазин', href: '/shop' },
              { label: 'За мен', href: '/za-men' },
              { label: 'Контакти', href: '/kontakti' },
              { label: 'МАК карти', href: '/mac-karti' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-(--sage) hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
