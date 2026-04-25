'use client'
import { useState } from 'react'

interface WCCategory {
  id: number
  name: string
  slug: string
  count: number
}

export default function CategoriesClient({ initialCategories }: { initialCategories: WCCategory[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const [editName, setEditName] = useState<Record<number, string>>({})

  function getEditName(cat: WCCategory) {
    return editName[cat.id] ?? cat.name
  }

  function setName(id: number, name: string) {
    setEditName(prev => ({ ...prev, [id]: name }))
    setSaved(null)
  }

  async function save(cat: WCCategory) {
    const name = getEditName(cat)
    if (name === cat.name) return
    setSaving(cat.id)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, name }),
      })
      if (res.ok) {
        setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name } : c))
        setSaved(cat.id)
        setTimeout(() => setSaved(null), 2000)
      }
    } finally {
      setSaving(null)
    }
  }

  const visible = categories.filter(c =>
    !['uncategorized', 'без-категория', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )

  return (
    <div className="space-y-2">
      {visible.map(cat => (
        <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 px-6 py-4 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={getEditName(cat)}
              onChange={e => setName(cat.id, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save(cat)}
              className="w-full text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none py-1 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-0.5">{cat.slug} · {cat.count} продукта</p>
          </div>
          <button
            onClick={() => save(cat)}
            disabled={saving === cat.id || getEditName(cat) === cat.name}
            className="text-sm px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-30"
          >
            {saving === cat.id ? '...' : saved === cat.id ? 'Запазено' : 'Запази'}
          </button>
        </div>
      ))}
    </div>
  )
}
