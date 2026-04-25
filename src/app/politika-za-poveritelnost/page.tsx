import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика за поверителност',
  description: 'Политика за поверителност на Ели Панева — как събираме и обработваме лични данни.',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-(--text-dark) mb-4">Политика за поверителност</h1>
        <p className="text-sm text-(--text-muted) mb-12">Последна актуализация: 25 април 2026 г.</p>

        <div className="prose max-w-none text-(--text-muted) leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">1. Кой събира данните</h2>
            <p>
              Администратор на личните данни е <strong>Ели Панева</strong>, холистичен консултант и трансформационен коуч,
              с адрес бул. „Дондуков" 65, ет. 1, офис 2, 1504 София, България.
              Контакт: <a href="mailto:elipaneva2023@gmail.com" className="text-(--sage) hover:underline">elipaneva2023@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">2. Какви данни събираме</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Имена, имейл адрес и телефон — при попълване на формата за контакт или поръчка</li>
              <li>Адрес за доставка — при покупка на физически продукт</li>
              <li>IP адрес и данни за посещението — автоматично чрез бисквитки и лог файлове</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">3. Цел и основание за обработване</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Изпълнение на договор</strong> — обработка на поръчки и записвания за консултации</li>
              <li><strong>Законен интерес</strong> — защита срещу измами, подобряване на сайта</li>
              <li><strong>Съгласие</strong> — изпращане на маркетингови съобщения (само ако сте дали изрично съгласие)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">4. Съхранение и сигурност</h2>
            <p>
              Данните се съхраняват на сигурни сървъри в ЕС. Прилагаме технически и организационни мерки
              за защита срещу неоторизиран достъп, загуба или унищожаване.
              Данните не се предоставят на трети страни извън ЕС без подходящи гаранции.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">5. Вашите права</h2>
            <p>Съгласно GDPR имате право на:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Достъп до личните си данни</li>
              <li>Коригиране на неточни данни</li>
              <li>Изтриване („право да бъдеш забравен")</li>
              <li>Ограничаване на обработването</li>
              <li>Преносимост на данните</li>
              <li>Възражение срещу обработване въз основа на законен интерес</li>
            </ul>
            <p className="mt-4">
              За упражняване на правата си пишете на{' '}
              <a href="mailto:elipaneva2023@gmail.com" className="text-(--sage) hover:underline">elipaneva2023@gmail.com</a>.
              Имате право да подадете жалба до{' '}
              <a href="https://www.cpdp.bg" target="_blank" rel="noopener noreferrer" className="text-(--sage) hover:underline">
                КЗЛД
              </a> (Комисия за защита на личните данни).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">6. Бисквитки</h2>
            <p>
              Сайтът използва бисквитки. Подробности в нашата{' '}
              <a href="/politika-za-biskvitki" className="text-(--sage) hover:underline">Политика за бисквитки</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
