import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Общи условия',
  description: 'Общи условия за ползване на сайта и магазина на Ели Панева.',
  robots: { index: false },
}

export default function TermsPage() {
  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-(--text-dark) mb-4">Общи условия</h1>
        <p className="text-sm text-(--text-muted) mb-12">Последна актуализация: 25 април 2026 г.</p>

        <div className="prose max-w-none text-(--text-muted) leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">1. Страни</h2>
            <p>
              Настоящите общи условия уреждат отношенията между <strong>Ели Панева</strong>
              (по-долу „Доставчик"), bул. „Дондуков" 65, ет. 1, офис 2, 1504 София,
              и всяко физическо или юридическо лице, използващо сайта <strong>elipaneva.com</strong>
              (по-долу „Потребител").
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">2. Услуги и продукти</h2>
            <p>
              Доставчикът предлага холистични консултации, коучинг сесии, онлайн курсове и физически продукти.
              Описанията на услугите са ориентировъчни. Конкретните условия за всяка услуга се уточняват
              индивидуално преди началото на работа.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">3. Поръчки и плащане</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Поръчките се считат за потвърдени след получаване на потвърдителен имейл</li>
              <li>Плащането се извършва по банков път или чрез одобрен платежен метод</li>
              <li>Цените са в лева (BGN) с включен ДДС (ако е приложимо)</li>
              <li>Доставчикът си запазва правото да откаже поръчка при технически грешки в цените</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">4. Право на отказ</h2>
            <p>
              Потребителите имат право да се откажат от поръчка в срок от <strong>14 дни</strong> от
              получаването й (за физически продукти) или преди началото на предоставяне на услугата.
              Цифровите продукти (курсове, записи) не подлежат на връщане след предоставяне на достъп.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">5. Отговорност</h2>
            <p>
              Холистичните консултации и коучинг сесиите не заместват медицинска помощ, психиатрично
              или психологическо лечение. Потребителят носи отговорност за решенията, взети в резултат
              на работата с Доставчика.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">6. Интелектуална собственост</h2>
            <p>
              Всички материали на сайта — текстове, изображения, курсове — са собственост на Ели Панева
              и са защитени от авторско право. Забранено е възпроизвеждането им без писмено разрешение.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">7. Приложимо право</h2>
            <p>
              Настоящите общи условия се уреждат от законодателството на Република България.
              Споровете се разглеждат от компетентния съд в гр. София.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">8. Контакт</h2>
            <p>
              Въпроси: <a href="mailto:elipaneva2023@gmail.com" className="text-(--sage) hover:underline">elipaneva2023@gmail.com</a>
              {' | '}
              <a href="tel:+359882420894" className="text-(--sage) hover:underline">+359 882 420 894</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
