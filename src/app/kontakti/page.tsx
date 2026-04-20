import StructuredData from '@/components/ui/StructuredData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Свържи се с Ели Панева за консултация. София, бул. Дондуков 65, ет. 1, офис 2. Тел: +359 882 420 894.',
  alternates: { canonical: 'https://elipaneva.com/kontakti' },
}

export default function ContactPage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Ели Панева — Холистичен консултант',
    url: 'https://elipaneva.com',
    telephone: '+359882420894',
    email: 'elipaneva2023@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'бул. Дондуков 65, ет. 1, офис 2',
      addressLocality: 'София',
      addressCountry: 'BG',
      postalCode: '1504',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '42.6977',
      longitude: '23.3219',
    },
    openingHours: 'Mo-Fr 09:00-18:00',
  }

  return (
    <div className="pt-16">
      <StructuredData data={localBusinessSchema} />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-(--gold) font-medium block mb-4">Контакти</span>
          <h1 className="font-serif text-5xl text-(--text-dark) font-light">Свържи се с мен</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <p className="text-(--text-muted) leading-relaxed mb-10">
              Запази своята консултация или задай въпрос. Отговарям в рамките на 24 часа в работни дни.
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-(--text-muted) mb-3">Адрес</h3>
                <address className="not-italic text-(--text-dark)">
                  бул. „Дондуков" 65, ет. 1, офис 2<br />
                  1504 София, България
                </address>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-(--text-muted) mb-3">Телефон</h3>
                <a href="tel:+359882420894" className="text-(--text-dark) hover:text-(--sage) transition-colors font-medium">
                  +359 882 420 894
                </a>
                <p className="text-xs text-(--text-muted) mt-1">Viber и WhatsApp: +359 898 436 850</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-(--text-muted) mb-3">Имейл</h3>
                <a href="mailto:elipaneva2023@gmail.com" className="text-(--text-dark) hover:text-(--sage) transition-colors">
                  elipaneva2023@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-(--text-muted) mb-3">Социални мрежи</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'Facebook', href: 'https://www.facebook.com/elipaneva' },
                    { label: 'Instagram', href: 'https://www.instagram.com/elipaneva' },
                    { label: 'YouTube', href: 'https://www.youtube.com/@elipaneva' },
                    { label: 'TikTok', href: 'https://www.tiktok.com/@elipaneva' },
                  ].map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-(--text-muted) hover:text-(--sage) transition-colors border border-(--border) px-4 py-2 hover:border-(--sage)"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-(--border) p-8">
            <h2 className="font-serif text-2xl text-(--text-dark) mb-6">Изпрати съобщение</h2>
            <form action="/api/contact" method="POST" className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-(--text-muted) mb-2">
                  Вашето име *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full border border-(--border) px-4 py-3 text-sm bg-(--bg) focus:outline-none focus:border-(--sage) transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-(--text-muted) mb-2">
                  Имейл адрес *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full border border-(--border) px-4 py-3 text-sm bg-(--bg) focus:outline-none focus:border-(--sage) transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-(--text-muted) mb-2">
                  Телефон
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full border border-(--border) px-4 py-3 text-sm bg-(--bg) focus:outline-none focus:border-(--sage) transition-colors"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-xs uppercase tracking-widest text-(--text-muted) mb-2">
                  Услуга
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full border border-(--border) px-4 py-3 text-sm bg-(--bg) focus:outline-none focus:border-(--sage) transition-colors"
                >
                  <option value="">— Изберете услуга —</option>
                  <option>Лични консултации</option>
                  <option>Системни констелации</option>
                  <option>МАК карти</option>
                  <option>Игра Лийла</option>
                  <option>Тревожност и паники</option>
                  <option>Управление на стреса</option>
                  <option>Медитации</option>
                  <option>Обучение / курс</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-(--text-muted) mb-2">
                  Съобщение *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-(--border) px-4 py-3 text-sm bg-(--bg) focus:outline-none focus:border-(--sage) transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-(--sage) text-white py-3 text-sm font-medium hover:bg-(--text-dark) transition-colors tracking-wide"
              >
                Изпрати съобщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
