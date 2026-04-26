'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import type { BlogPost } from '@/app/api/admin/blog/route'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-а-яёА-ЯЁ]/g, '')
    .slice(0, 80)
}

export default function BlogEditorClient({ post }: { post: BlogPost | null }) {
  const isNew = !post
  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    coverImage: post?.coverImage ?? '',
    published: post?.published ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
    setError('')
  }

  function handleTitleChange(title: string) {
    setForm(prev => ({
      ...prev,
      title,
      slug: isNew ? slugify(title) : prev.slug,
    }))
    setSaved(false)
  }

  async function uploadImage(file: File) {
    setUploading(true)
    setUploadDone(false)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/blog-image', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      set('coverImage', url)
      setUploadDone(true)
      setTimeout(() => setUploadDone(false), 3000)
    } catch {
      setError('Грешка при качване на снимката')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!form.title.trim()) { setError('Заглавието е задължително'); return }
    setSaving(true)
    setError('')
    try {
      const method = isNew ? 'POST' : 'PUT'
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${post!.id}`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        let msg = 'Грешка при запазване'
        try { const d = await res.json(); msg = d.error ?? msg } catch {}
        setError(msg)
      } else {
        const created: BlogPost = await res.json()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        if (isNew) {
          window.location.href = `/admin/blog/${created.id}`
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Мрежова грешка')
    } finally {
      setSaving(false)
    }
  }

  async function deletePost() {
    if (!confirm('Изтриване на статията?')) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/blog/${post!.id}`, { method: 'DELETE' })
      window.location.href = '/admin/blog'
    } catch {
      setError('Грешка при изтриване')
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/blog" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Блог</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">{isNew ? 'Нова статия' : (form.title || 'Редактиране')}</h1>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Заглавие *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            placeholder="Заглавие на статията"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">URL slug</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors font-mono"
              placeholder="url-na-statiyata"
            />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Корица</label>
          <div className="flex gap-3 items-start">
            <input
              type="text"
              value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="URL на снимката или качи по-долу"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="shrink-0 border border-gray-200 rounded-xl px-4 py-3 text-sm hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Качва...' : uploadDone ? '✓ Качено' : 'Качи'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]) }} />
          </div>
          {form.coverImage && (
            <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
              <Image src={form.coverImage} alt="Корица" fill className="object-cover" sizes="800px" />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Кратко описание</label>
          <textarea
            value={form.excerpt}
            onChange={e => set('excerpt', e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-y"
            placeholder="Кратко описание за preview картата"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Съдържание</label>
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={24}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-y font-mono"
            placeholder="HTML съдържание на статията..."
          />
          <p className="text-xs text-gray-400 mt-1">HTML е позволен. Параграфи: &lt;p&gt;...&lt;/p&gt;, заглавия: &lt;h2&gt;, &lt;h3&gt;</p>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => set('published', e.target.checked)}
              className="w-4 h-4 rounded accent-gray-900"
            />
            <span className="text-sm text-gray-700">Публикувана</span>
          </label>
          {!isNew && (
            <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Виж в сайта →
            </a>
          )}
        </div>

        {/* Save bar */}
        <div className="pt-6 border-t border-gray-200 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Запазване...' : isNew ? 'Публикувай' : 'Запази промените'}
          </button>
          {saved && <span className="text-sm text-green-600">Запазено ✓</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
          {!isNew && (
            <button
              onClick={deletePost}
              disabled={deleting}
              className="ml-auto text-sm text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Изтриване...' : 'Изтрий статията'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
