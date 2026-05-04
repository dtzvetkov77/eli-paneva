'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import RichEditor from '@/components/admin/RichEditor'
import type { BlogPost } from '@/lib/blog'
import { useRouter } from 'next/navigation'

interface Props { post: BlogPost; isNew?: boolean }

export default function PostEditClient({ post, isNew = false }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    published: post.published,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
    setError('')
  }

  function autoSlug(title: string) {
    return title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\wЀ-ӿ-]/g, '')
      .slice(0, 80)
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (res.ok && d.url) set('coverImage', d.url)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function save() {
    if (!form.title.trim()) { setError('Заглавието е задължително'); return }
    setSaving(true); setError('')
    try {
      const body = {
        title: form.title,
        slug: form.slug || autoSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        published: form.published,
      }
      let res: Response
      if (isNew) {
        res = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else {
        res = await fetch(`/api/admin/blog/${post.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Грешка при запазване'); return }
      setSaved(true)
      if (isNew && d.post?.id) router.replace(`/admin/blog/${d.post.id}`)
    } finally {
      setSaving(false)
    }
  }

  async function deletPost() {
    if (!confirm('Изтрий публикацията?')) return
    setDeleting(true)
    await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
    router.push('/admin/blog')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <a href="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </a>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{isNew ? 'Нова публикация' : form.title || 'Редактиране'}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{isNew ? 'Нова статия в блога' : 'Блог'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button onClick={deletPost} disabled={deleting} className="text-red-400 hover:text-red-600 text-sm transition-colors disabled:opacity-50">
              Изтрий
            </button>
          )}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => set('published', !form.published)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.published ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm text-gray-600">{form.published ? 'Публикувана' : 'Чернова'}</span>
          </label>
          <button
            onClick={save}
            disabled={saving}
            className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Запазване...' : saved ? 'Запазено ✓' : 'Запази'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Заглавие</label>
          <input
            value={form.title}
            onChange={e => {
              set('title', e.target.value)
              if (isNew || !form.slug) set('slug', autoSlug(e.target.value))
            }}
            placeholder="Заглавие на публикацията"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL slug</label>
          <input
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="url-na-statiqta"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Корица</label>
          {form.coverImage ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src={form.coverImage} alt="Корица" fill className="object-cover" />
              <button
                onClick={() => set('coverImage', '')}
                className="absolute top-2 right-2 bg-white rounded-lg px-2.5 py-1 text-xs text-gray-600 shadow hover:shadow-md transition-shadow"
              >
                Смени
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-10 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Качване...' : '+ Добави корица'}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadCover} />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Кратко описание</label>
          <textarea
            value={form.excerpt}
            onChange={e => set('excerpt', e.target.value)}
            rows={3}
            placeholder="Кратко описание за листа на блога..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Съдържание</label>
          <RichEditor
            value={form.content}
            onChange={html => set('content', html)}
            placeholder="Напишете съдържанието на публикацията..."
          />
        </div>
      </div>

      {/* Bottom save */}
      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
        {error && <span className="text-red-500 text-sm self-center">{error}</span>}
        <button
          onClick={save}
          disabled={saving}
          className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Запазване...' : saved ? 'Запазено ✓' : 'Запази промените'}
        </button>
      </div>
    </div>
  )
}
