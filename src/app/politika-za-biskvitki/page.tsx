import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика за бисквитки',
  description: 'Политика за бисквитки на elipaneva.com — какви бисквитки използваме и защо.',
  robots: { index: false },
}

export default function CookiePolicyPage() {
  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-(--text-dark) mb-4">Политика за бисквитки</h1>
        <p className="text-sm text-(--text-muted) mb-12">Последна актуализация: 25 април 2026 г.</p>

        <div className="prose max-w-none text-(--text-muted) leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">Какво са бисквитките</h2>
            <p>
              Бисквитките (cookies) са малки текстови файлове, които уебсайтовете съхраняват в браузъра ви.
              Те позволяват на сайта да „помни" вашите действия и предпочитания за определен период от време.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">Видове бисквитки, които използваме</h2>

            <div className="space-y-6">
              <div className="border border-(--border) rounded-xl p-6">
                <h3 className="font-semibold text-(--text-dark) mb-2">Задължителни бисквитки</h3>
                <p className="text-sm mb-3">Необходими за основното функциониране на сайта. Не могат да бъдат изключени.</p>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-(--border)">
                    <th className="text-left pb-2 font-medium text-(--text-dark)">Бисквитка</th>
                    <th className="text-left pb-2 font-medium text-(--text-dark)">Цел</th>
                    <th className="text-left pb-2 font-medium text-(--text-dark)">Срок</th>
                  </tr></thead>
                  <tbody className="divide-y divide-(--border)">
                    <tr><td className="py-2 font-mono text-xs">admin_token</td><td className="py-2">Сесия на администратора</td><td className="py-2">24 ч.</td></tr>
                    <tr><td className="py-2 font-mono text-xs">cookie_consent</td><td className="py-2">Запомня вашия избор за бисквитки</td><td className="py-2">1 година</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-(--border) rounded-xl p-6">
                <h3 className="font-semibold text-(--text-dark) mb-2">Функционални бисквитки</h3>
                <p className="text-sm mb-3">Подобряват функционалността — запомнят количката за пазаруване.</p>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-(--border)">
                    <th className="text-left pb-2 font-medium text-(--text-dark)">Бисквитка</th>
                    <th className="text-left pb-2 font-medium text-(--text-dark)">Цел</th>
                    <th className="text-left pb-2 font-medium text-(--text-dark)">Срок</th>
                  </tr></thead>
                  <tbody>
                    <tr><td className="py-2 font-mono text-xs">cart</td><td className="py-2">Запазва съдържанието на количката</td><td className="py-2">7 дни</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">Как да управлявате бисквитките</h2>
            <p>
              Можете да изтриете или блокирате бисквитките от настройките на браузъра си. Имайте предвид,
              че блокирането на задължителните бисквитки може да наруши функционалността на сайта.
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3 text-sm">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-(--sage) hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-(--sage) hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-(--sage) hover:underline">Safari</a></li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-(--text-dark) mb-4">Контакт</h2>
            <p>
              Въпроси относно бисквитките:{' '}
              <a href="mailto:elipaneva2023@gmail.com" className="text-(--sage) hover:underline">elipaneva2023@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
