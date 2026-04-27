'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface WCCategory { id: number; name: string; slug: string }
interface WCImage { id: number; src: string; alt: string }
interface WCProduct {
  id: number
  name: string
  slug: string
  permalink: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  status: string
  featured: boolean
  stock_status: string
  images: WCImage[]
  categories: WCCategory[]
}

interface Props {
  product: WCProduct
  allCategories: WCCategory[]
}

const BGN_PER_EUR = 1.95583
function bgnToEur(bgn: string) {
  const n = parseFloat(bgn)
  return isNaN(n) || n === 0 ? '' : (n / BGN_PER_EUR).toFixed(2)
}
function eurToBgn(eur: string) {
  const n = parseFloat(eur)
  return isNaN(n) || n === 0 ? '' : (n * BGN_PER_EUR).toFixed(2)
}

export default function ProductEditClient({ product, allCategories }: Props) {
  const [form, setForm] = useState({
    name: product.name,
    short_description: product.short_description,
    description: product.description,
    regular_price: bgnToEur(product.regular_price),
    sale_price: bgnToEur(product.sale_price),
    status: product.status,
    stock_status: product.stock_status,
    featured: product.featured,
    category_ids: product.categories.map(c => c.id),
    images: product.images,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'description' | 'images'>('general')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
    setError('')
  }

  function toggleCategory(id: number) {
    set('category_ids', form.category_ids.includes(id)
      ? form.category_ids.filter(x => x !== id)
      : [...form.category_ids, id]
    )
  }

  async function uploadImage(file: File) {
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) {
      setUploadError(data.error ?? 'Грешка при качване')
    } else {
      const newImg: WCImage = { id: Date.now(), src: data.url, alt: file.name.replace(/\.[^.]+$/, '') }
      set('images', [...form.images, newImg])
    }
    setUploading(false)
  }

  async function removeImage(idx: number) {
    set('images', form.images.filter((_, i) => i !== idx))
  }

  function moveToMain(idx: number) {
    if (idx === 0) return
    const imgs = [...form.images]
    const [img] = imgs.splice(idx, 1)
    imgs.unshift(img)
    set('images', imgs)
  }

  async function save() {
    if (!form.name.trim()) { setError('Наименованието е задължително'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          regular_price: eurToBgn(form.regular_price),
          sale_price: eurToBgn(form.sale_price),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Грешка при запазване')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Мрежова грешка')
    } finally {
      setSaving(false)
    }
  }

  const visibleCategories = allCategories.filter(c =>
    !['uncategorized', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/products" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Продукти</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">{product.name}</h1>
        <span className="text-xs text-gray-400 font-mono ml-1">#{product.id}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {([
          ['general', 'Основни'],
          ['description', 'Описание'],
          ['images', `Снимки${form.images.length ? ` (${form.images.length})` : ''}`],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Наименование *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Редовна цена (€)</label>
              <input
                type="number" step="0.01" min="0"
                value={form.regular_price}
                onChange={e => set('regular_price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Намалена цена (€)</label>
              <input
                type="number" step="0.01" min="0"
                value={form.sale_price}
                onChange={e => set('sale_price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Статус</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
              >
                <option value="publish">Публикуван</option>
                <option value="draft">Чернова</option>
                <option value="private">Частен</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Наличност</label>
              <select
                value={form.stock_status}
                onChange={e => set('stock_status', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
              >
                <option value="instock">В наличност</option>
                <option value="outofstock">Изчерпан</option>
                <option value="onbackorder">По заявка</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded accent-gray-900"
                />
                <span className="text-sm text-gray-700">Препоръчан</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Кратко описание</label>
            <textarea
              value={form.short_description}
              onChange={e => set('short_description', e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-y font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">HTML е позволен</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Категории</label>
            <div className="border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {visibleCategories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={form.category_ids.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 rounded accent-gray-900 shrink-0"
                  />
                  <span className="truncate">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Description tab */}
      {activeTab === 'description' && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Пълно описание</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={20}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-y font-mono"
          />
          <p className="text-xs text-gray-400 mt-1">HTML е позволен</p>
        </div>
      )}

      {/* Images tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          {/* Upload area */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) uploadImage(file)
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }}
            />
            {uploading ? (
              <p className="text-sm text-gray-500">Качване...</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">Провлачи снимка или <span className="text-gray-900 underline">избери файл</span></p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF — макс. 10 MB</p>
              </>
            )}
          </div>
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

          {/* Current images */}
          {form.images.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                Снимки — влачи за наредба, първата е главна
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <Image src={img.src} alt={img.alt || product.name} fill className="object-cover" sizes="150px" unoptimized />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5">Главна</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {i !== 0 && (
                        <button
                          onClick={() => moveToMain(i)}
                          className="bg-white text-gray-900 text-xs rounded px-2 py-1 hover:bg-gray-100"
                          title="Направи главна"
                        >
                          ★
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(i)}
                        className="bg-red-500 text-white text-xs rounded px-2 py-1 hover:bg-red-600"
                        title="Премахни"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Няма снимки — качи от горе</p>
          )}
        </div>
      )}

      {/* Save bar */}
      <div className="mt-10 pt-6 border-t border-gray-200 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Запазване...' : 'Запази промените'}
        </button>
        {saved && <span className="text-sm text-green-600">Запазено</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
        <a
          href={product.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          Виж в сайта →
        </a>
      </div>
    </div>
  )
}
