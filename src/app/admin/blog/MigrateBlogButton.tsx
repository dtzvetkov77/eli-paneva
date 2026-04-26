'use client'
import { useState } from 'react'

export default function MigrateBlogButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function run() {
    setState('loading')
    setMsg('')
    try {
      const res = await fetch('/api/admin/migrate-blog', { method: 'POST' })
      const d = await res.json()
      if (!res.ok) {
        setState('error')
        setMsg(d.error ?? 'Грешка')
      } else {
        setState('done')
        setMsg(`Готово: ${d.migrated} внесени, ${d.skipped} вече съществуват`)
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (e) {
      setState('error')
      setMsg(e instanceof Error ? e.message : 'Грешка')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={run}
        disabled={state === 'loading'}
        className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
      >
        {state === 'loading' ? 'Внася...' : '↓ Импорт от WordPress'}
      </button>
      {msg && (
        <span className={`text-sm ${state === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {msg}
        </span>
      )}
    </div>
  )
}
