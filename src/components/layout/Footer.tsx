import Link from 'next/link'
import { SOCIAL_LINKS } from '@/lib/social-links'

const serviceLinks = [
  { label: 'Лични консултации', href: '/uslugi/lichni-konsultatsii' },
  { label: 'Системни констелации', href: '/uslugi/sistemni-konstelatsi' },
  { label: 'МАК карти', href: '/mac-karti' },
  { label: 'Тревожност и паники', href: '/uslugi/trevozhnost-i-paniki' },
  { label: 'Медитации', href: '/uslugi/meditatsii' },
]

export default function Footer() {
  return (
    <footer className="bg-(--text-dark) text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="font-serif text-2xl text-white block mb-4">Ели Панева</span>
          <p className="text-sm leading-relaxed max-w-sm">
            Холистичен консултант, трансформационен коуч и автор. Подкрепям хората в процеса на вътрешна промяна чрез системни констелации, PSYCH-K® и МАК карти.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-(--gold) transition-colors text-sm">{s.label}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-white text-sm uppercase tracking-widest mb-4">Услуги</h3>
          <ul className="space-y-2">
            {serviceLinks.map(s => (
              <li key={s.href}>
                <Link href={s.href} className="text-sm hover:text-(--gold) transition-colors">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white text-sm uppercase tracking-widest mb-4">Контакт</h3>
          <address className="not-italic text-sm space-y-2">
            <p>бул. „Дондуков" 65, ет. 1, офис 2<br />София, България</p>
            <a href="tel:+359882420894" className="hover:text-(--gold) transition-colors block">+359 882 420 894</a>
            <a href="mailto:elipaneva2023@gmail.com" className="hover:text-(--gold) transition-colors block">elipaneva2023@gmail.com</a>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/40">
        <span>© {new Date().getFullYear()} Ели Панева. Всички права запазени.</span>
        <div className="flex gap-4">
          <Link href="/politika-za-poveritelnost" className="hover:text-white/70 transition-colors">Поверителност</Link>
          <Link href="/obshti-uslovia" className="hover:text-white/70 transition-colors">Общи условия</Link>
          <Link href="/politika-za-biskvitki" className="hover:text-white/70 transition-colors">Бисквитки</Link>
        </div>
      </div>
    </footer>
  )
}
