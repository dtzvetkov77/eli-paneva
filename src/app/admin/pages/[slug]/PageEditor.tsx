'use client'
import { useState } from 'react'

interface Props {
  slug: string
  fields: Record<string, string>
  initialContent: Record<string, string>
}

export default function PageEditor({ slug, fields, initialContent }: Props) {
  const [content, setContent] = useState<Record<string, string>>(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function update(key: string, value: string) {
    setContent(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    setError('')

    // Fetch current full content, merge this page's fields
    const getRes = await fetch('/api/admin/content')
    const all: Record<string, Record<string, string>> = getRes.ok ? await getRes.json() : {}
    all[slug] = content

    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all),
    })

    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Грешка при запазване')
    }
  }

  const isMultiline = (key: string, label: string) =>
    label.toLowerCase().includes('параграф') ||
    label.toLowerCase().includes('текст') ||
    label.toLowerCase().includes('заглавие') && (content[key]?.includes('\n') ?? false)

  return (
    <div className="space-y-6">
      {Object.entries(fields).map(([key, label]) => (
        <div key={key}>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            {label}
          </label>
          {isMultiline(key, label) ? (
            <textarea
              value={content[key] ?? ''}
              onChange={e => update(key, e.target.value)}
              rows={key.includes('paragraph') ? 4 : 3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-y"
            />
          ) : (
            <input
              type="text"
              value={content[key] ?? ''}
              onChange={e => update(key, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          )}
        </div>
      ))}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Запазване...' : 'Запази'}
        </button>
        {saved && <span className="text-sm text-green-600">✓ Запазено успешно</span>}
      </div>
    </div>
  )
}
