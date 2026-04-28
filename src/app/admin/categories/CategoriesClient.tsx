'use client'
import { useState, useRef, useEffect } from 'react'

interface WCCategory { id: number; name: string; slug: string; count: number }

export default function CategoriesClient({ initialCategories }: { initialCategories: WCCategory[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const editRef = useRef<HTMLInputElement>(null)
  const addRef = useRef<HTMLInputElement>(null)

  const visible = categories.filter(c =>
    !['uncategorized', 'без-категория', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )

  useEffect(() => {
    if (editing !== null) editRef.current?.focus()
  }, [editing])

  function startEdit(cat: WCCategory) {
    setEditing(cat.id)
    setEditValue(cat.name)
    setError('')
  }

  function cancelEdit() {
    setEditing(null)
    setEditValue('')
  }

  async function save(cat: WCCategory) {
    const name = editValue.trim()
    if (!name || name === cat.name) { cancelEdit(); return }
    setSaving(cat.id); setError('')
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cat.id, name }),
    })
    if (res.ok) {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name } : c))
      cancelEdit()
    } else setError('Грешка при запазване')
    setSaving(null)
  }

  async function del(cat: WCCategory) {
    if (!confirm(`Изтрий „${cat.name}"?`)) return
    setDeleting(cat.id); setError('')
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cat.id }),
    })
    if (res.ok) setCategories(prev => prev.filter(c => c.id !== cat.id))
    else setError('Грешка при изтриване')
    setDeleting(null)
  }

  async function create() {
    const name = newName.trim()
    if (!name) return
    setCreating(true); setError('')
    const res = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const created = await res.json()
      setCategories(prev => [...prev, created])
      setNewName('')
      addRef.current?.focus()
    } else setError('Грешка при създаване')
    setCreating(false)
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Header stats */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold tabular-nums text-gray-900">{visible.length}</span>
          <span className="text-sm text-gray-400 ml-2">категории</span>
        </div>
        <p className="text-xs text-gray-400">Клик на категория за редактиране</p>
      </div>

      {/* Chip cloud */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        {visible.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Няма категории — добави първата</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visible.map(cat => {
              const isEditing = editing === cat.id
              const isDeleting = deleting === cat.id
              const isSaving = saving === cat.id

              if (isEditing) {
                return (
                  <div
                    key={cat.id}
                    className="inline-flex items-center gap-1.5 bg-gray-900 text-white rounded-full pl-3.5 pr-1.5 py-1.5 shadow-sm"
                  >
                    <input
                      ref={editRef}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') save(cat)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="bg-transparent text-sm text-white outline-none w-32 placeholder:text-white/40"
                      placeholder={cat.name}
                    />
                    <button
                      onClick={() => save(cat)}
                      disabled={isSaving}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                      title="Запази"
                    >
                      {isSaving ? (
                        <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                      title="Отказ"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                )
              }

              return (
                <div
                  key={cat.id}
                  className="group inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-full pl-3.5 pr-1.5 py-1.5 transition-all cursor-default"
                >
                  <span
                    className="text-sm font-medium cursor-pointer select-none"
                    onClick={() => startEdit(cat)}
                    title="Клик за редактиране"
                  >
                    {cat.name}
                  </span>
                  {cat.count > 0 && (
                    <span className="text-[10px] text-gray-400 tabular-nums font-medium bg-gray-200 rounded-full px-1.5 py-0.5 leading-none">
                      {cat.count}
                    </span>
                  )}
                  <button
                    onClick={() => del(cat)}
                    disabled={isDeleting}
                    className="w-5 h-5 rounded-full bg-transparent opacity-0 group-hover:opacity-100 hover:bg-red-100 flex items-center justify-center transition-all disabled:opacity-50"
                    title="Изтрий"
                  >
                    {isDeleting ? (
                      <svg className="animate-spin text-red-400" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    ) : (
                      <svg className="text-red-400" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add new */}
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5">
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-3 font-medium">Добави категория</p>
        <div className="flex gap-2">
          <input
            ref={addRef}
            type="text"
            value={newName}
            onChange={e => { setNewName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && create()}
            placeholder="Ново название..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
          <button
            onClick={create}
            disabled={creating || !newName.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-30"
          >
            {creating ? (
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            )}
            Добави
          </button>
        </div>
      </div>
    </div>
  )
}
