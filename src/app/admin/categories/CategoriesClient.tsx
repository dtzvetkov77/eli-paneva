'use client'
import { useState } from 'react'

interface WCCategory { id: number; name: string; slug: string; count: number }

export default function CategoriesClient({ initialCategories }: { initialCategories: WCCategory[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [editName, setEditName] = useState<Record<number, string>>({})
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const visible = categories.filter(c =>
    !['uncategorized', 'без-категория', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )

  function getName(cat: WCCategory) { return editName[cat.id] ?? cat.name }

  async function save(cat: WCCategory) {
    const name = getName(cat)
    if (!name.trim() || name === cat.name) return
    setSaving(cat.id); setError('')
    const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: cat.id, name }) })
    if (res.ok) {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name } : c))
      setEditName(prev => { const n = { ...prev }; delete n[cat.id]; return n })
    } else setError('Грешка при запазване')
    setSaving(null)
  }

  async function del(cat: WCCategory) {
    if (!confirm(`Изтрий „${cat.name}"?`)) return
    setDeleting(cat.id); setError('')
    const res = await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: cat.id }) })
    if (res.ok) setCategories(prev => prev.filter(c => c.id !== cat.id))
    else setError('Грешка при изтриване')
    setDeleting(null)
  }

  async function create() {
    if (!newName.trim()) return
    setCreating(true); setError('')
    const res = await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) })
    if (res.ok) {
      const created = await res.json()
      setCategories(prev => [...prev, created])
      setNewName('')
    } else setError('Грешка при създаване')
    setCreating(false)
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* New category */}
      <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Нова категория</p>
        <div className="flex gap-3">
          <input type="text" value={newName}
            onChange={e => { setNewName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && create()}
            placeholder="Название на категорията..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
          <button onClick={create} disabled={creating || !newName.trim()}
            className="text-sm px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-30">
            {creating ? '...' : '+ Добави'}
          </button>
        </div>
      </div>

      {/* Table */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Няма категории</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                <th className="text-left px-6 py-4 font-medium">Категория</th>
                <th className="text-left px-6 py-4 font-medium">Slug</th>
                <th className="text-left px-6 py-4 font-medium">Продукти</th>
                <th className="text-right px-6 py-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map(cat => {
                const isDirty = getName(cat) !== cat.name
                return (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="text" value={getName(cat)}
                        onChange={e => setEditName(prev => ({ ...prev, [cat.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && save(cat)}
                        className="w-full text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none py-0.5 transition-colors" />
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-500">{cat.count}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isDirty && (
                          <button onClick={() => save(cat)} disabled={saving === cat.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50">
                            {saving === cat.id ? '...' : 'Запази'}
                          </button>
                        )}
                        <button onClick={() => del(cat)} disabled={deleting === cat.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-30">
                          {deleting === cat.id ? '...' : 'Изтрий'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
