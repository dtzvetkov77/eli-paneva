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
  const [deleting, setDeleting] = useState<number | null>(null)
  const [editName, setEditName] = useState<Record<number, string>>({})
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  function getEditName(cat: WCCategory) {
    return editName[cat.id] ?? cat.name
  }

  function setName(id: number, name: string) {
    setEditName(prev => ({ ...prev, [id]: name }))
    setSaved(null)
    setError('')
  }

  async function save(cat: WCCategory) {
    const name = getEditName(cat)
    if (name === cat.name || !name.trim()) return
    setSaving(cat.id)
    setError('')
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
      } else {
        setError('Грешка при запазване')
      }
    } catch {
      setError('Мрежова грешка')
    } finally {
      setSaving(null)
    }
  }

  async function deleteCategory(cat: WCCategory) {
    if (!confirm(`Изтрий категория „${cat.name}"? Продуктите ще останат без нея.`)) return
    setDeleting(cat.id)
    setError('')
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id }),
      })
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== cat.id))
      } else {
        setError('Грешка при изтриване')
      }
    } catch {
      setError('Мрежова грешка')
    } finally {
      setDeleting(null)
    }
  }

  async function createCategory() {
    if (!newName.trim()) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      })
      if (res.ok) {
        const created = await res.json()
        setCategories(prev => [...prev, created])
        setNewName('')
      } else {
        setError('Грешка при създаване')
      }
    } catch {
      setError('Мрежова грешка')
    } finally {
      setCreating(false)
    }
  }

  const visible = categories.filter(c =>
    !['uncategorized', 'без-категория', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )

  return (
    <div className="space-y-6">
      {/* Add new category */}
      <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Нова категория</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={e => { setNewName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && createCategory()}
            placeholder="Название на категорията..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
          <button
            onClick={createCategory}
            disabled={creating || !newName.trim()}
            className="text-sm px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-30"
          >
            {creating ? '...' : '+ Добави'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 px-1">{error}</p>
      )}

      {/* Existing categories */}
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
              disabled={saving === cat.id || getEditName(cat) === cat.name || !getEditName(cat).trim()}
              className="text-sm px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-30"
            >
              {saving === cat.id ? '...' : saved === cat.id ? '✓ Запазено' : 'Запази'}
            </button>
            <button
              onClick={() => deleteCategory(cat)}
              disabled={deleting === cat.id}
              className="text-sm px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-30"
            >
              {deleting === cat.id ? '...' : 'Изтрий'}
            </button>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Няма категории</p>
      )}
    </div>
  )
}
