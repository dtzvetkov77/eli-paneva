'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-(--border) shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-(--text-muted) flex-1">
          Използваме бисквитки за функционалност на сайта и количката за пазаруване.{' '}
          <Link href="/politika-za-biskvitki" className="text-(--sage) hover:underline">
            Научете повече
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-(--text-muted) hover:text-(--text-dark) transition-colors px-4 py-2 border border-(--border) rounded-lg"
          >
            Отказвам
          </button>
          <button
            onClick={accept}
            className="text-sm bg-(--sage) text-white px-4 py-2 rounded-lg hover:bg-(--text-dark) transition-colors"
          >
            Приемам
          </button>
        </div>
      </div>
    </div>
  )
}
