'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface WCCategory { id: number; name: string; slug: string }
interface WCImage { id: number; src: string; alt: string }
interface WCProduct {
  id: number; name: string; slug: string; permalink: string
  description: string; short_description: string
  price: string; regular_price: string; sale_price: string
  status: string; featured: boolean; stock_status: string
  images: WCImage[]; categories: WCCategory[]
  audio_url?: string
  audio_urls?: string[]
}

interface Props { product: WCProduct; allCategories: WCCategory[]; isNew?: boolean }

const BGN_PER_EUR = 1.95583

function eurToBgn(eur: string): string {
  const n = parseFloat(eur)
  return isNaN(n) || n === 0 ? '' : (n * BGN_PER_EUR).toFixed(2)
}
function bgnToEur(bgn: string): string {
  const n = parseFloat(bgn)
  return isNaN(n) || n === 0 ? '' : (n / BGN_PER_EUR).toFixed(2)
}
function eurLabel(eur: string): string {
  const bgn = eurToBgn(eur)
  return bgn ? `= ${bgn} лв` : ''
}

export default function ProductEditClient({ product, allCategories, isNew = false }: Props) {
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
    audio_urls: product.audio_urls?.length
      ? product.audio_urls
      : product.audio_url ? [product.audio_url] : [],
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'description' | 'media'>('general')
  const [catSearch, setCatSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [audioUploading, setAudioUploading] = useState(false)
  const [audioError, setAudioError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)
  const MAX_AUDIO = 3

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false); setError('')
  }

  function toggleCategory(id: number) {
    set('category_ids', form.category_ids.includes(id)
      ? form.category_ids.filter(x => x !== id)
      : [...form.category_ids, id])
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) { setUploadError(d.error ?? 'Грешка при качване'); return }
      const newImage: WCImage = { id: Date.now(), src: d.url, alt: '' }
      set('images', [...form.images, newImage])
    } catch { setUploadError('Мрежова грешка') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  function removeImage(src: string) {
    set('images', form.images.filter(img => img.src !== src))
  }

  function moveToMain(src: string) {
    const img = form.images.find(i => i.src === src)
    if (!img) return
    set('images', [img, ...form.images.filter(i => i.src !== src)])
  }

  async function uploadAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (form.audio_urls.length >= MAX_AUDIO) { setAudioError(`Максимум ${MAX_AUDIO} аудио файла`); return }
    setAudioUploading(true); setAudioError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) { setAudioError(d.error ?? 'Грешка при качване'); return }
      set('audio_urls', [...form.audio_urls, d.url])
    } catch { setAudioError('Мрежова грешка') }
    finally { setAudioUploading(false); if (audioRef.current) audioRef.current.value = '' }
  }

  function removeAudio(index: number) {
    set('audio_urls', form.audio_urls.filter((_, i) => i !== index))
  }

  async function save() {
    if (!form.name.trim()) { setError('Наименованието е задължително'); return }
    setSaving(true); setError('')
    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${product.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          regular_price: eurToBgn(form.regular_price),
          sale_price: eurToBgn(form.sale_price),
          audio_urls: form.audio_urls.length ? form.audio_urls : null,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Грешка при запазване')
      } else {
        if (isNew) {
          const d = await res.json()
          window.location.href = `/admin/products/${d.product.id}`
        } else {
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        }
      }
    } catch { setError('Мрежова грешка') }
    finally { setSaving(false) }
  }

  const visibleCategories = allCategories.filter(c =>
    !['uncategorized', 'shop'].includes(c.slug.toLowerCase()) &&
    c.name.toLowerCase() !== 'uncategorized'
  )
  const filteredCats = visibleCategories.filter(c =>
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  )

  const tabs = [
    { key: 'general' as const, label: 'Основни' },
    { key: 'description' as const, label: 'Описание' },
    { key: 'media' as const, label: 'Медия' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <a href="/admin/products" className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Продукти
          </a>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">{isNew ? 'Нов продукт' : product.name}</h1>
          {!isNew && <p className="text-xs text-gray-400 font-mono mt-0.5">#{product.id}</p>}
        </div>
        {!isNew && (
          <a href={product.permalink} target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 mt-1">
            Виж в сайта
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-xl mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.key === 'media' && (form.images.length > 0 || form.audio_urls.length > 0) && (
              <span className="ml-1.5 text-xs text-[#C8A96E]">
                {form.images.length > 0 && form.audio_urls.length > 0
                  ? `🖼+🎵${form.audio_urls.length}`
                  : form.images.length > 0 ? form.images.length : `🎵${form.audio_urls.length}`}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Наименование *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Редовна цена</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                <input type="number" step="0.01" min="0" value={form.regular_price}
                  onChange={e => set('regular_price', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="0.00"
                />
              </div>
              {form.regular_price && (
                <p className="text-xs text-gray-400 mt-1 pl-1">{eurLabel(form.regular_price)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Намалена цена</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                <input type="number" step="0.01" min="0" value={form.sale_price}
                  onChange={e => set('sale_price', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                  placeholder="0.00"
                />
              </div>
              {form.sale_price && (
                <p className="text-xs text-emerald-600 mt-1 pl-1 font-medium">{eurLabel(form.sale_price)}</p>
              )}
            </div>
          </div>

          {/* Status + Stock + Featured */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Статус</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="publish">Публикуван</option>
                <option value="draft">Чернова</option>
                <option value="private">Частен</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Наличност</label>
              <select value={form.stock_status} onChange={e => set('stock_status', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="instock">В наличност</option>
                <option value="outofstock">Изчерпан</option>
                <option value="onbackorder">По заявка</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer border border-gray-200 rounded-xl px-3 py-2.5 hover:border-gray-300 transition-colors">
                <div className={`w-8 h-5 rounded-full transition-colors relative ${form.featured ? 'bg-[#C8A96E]' : 'bg-gray-200'}`}
                  onClick={() => set('featured', !form.featured)}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-gray-700">Препоръчан</span>
              </label>
            </div>
          </div>

          {/* Short description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Кратко описание</label>
            <textarea value={form.short_description} onChange={e => set('short_description', e.target.value)}
              rows={4} placeholder="Кратко описание на продукта (HTML е позволен)..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-y font-mono"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              Категории
              {form.category_ids.length > 0 && (
                <span className="ml-2 text-[#C8A96E] font-normal normal-case">{form.category_ids.length} избрани</span>
              )}
            </label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100">
                <input type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)}
                  placeholder="Търси категория..."
                  className="w-full text-sm focus:outline-none text-gray-700 placeholder-gray-300"
                />
              </div>
              <div className="p-3 max-h-44 overflow-y-auto grid grid-cols-2 gap-1">
                {filteredCats.map(cat => (
                  <label key={cat.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                    form.category_ids.includes(cat.id) ? 'bg-[#C8A96E]/10 text-[#a88940]' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      form.category_ids.includes(cat.id) ? 'bg-[#C8A96E] border-[#C8A96E]' : 'border-gray-300'
                    }`} onClick={() => toggleCategory(cat.id)}>
                      {form.category_ids.includes(cat.id) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <span className="truncate" onClick={() => toggleCategory(cat.id)}>{cat.name}</span>
                  </label>
                ))}
                {filteredCats.length === 0 && <p className="text-xs text-gray-400 col-span-2 py-2">Няма намерени</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {activeTab === 'description' && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Пълно описание</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={22} placeholder="Пълно описание (HTML е позволен)..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-y font-mono"
          />
        </div>
      )}

      {/* Media */}
      {activeTab === 'media' && (
        <div className="space-y-8">

          {/* Images section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Снимки
                {form.images.length > 0 && (
                  <span className="ml-2 text-[#C8A96E] font-normal normal-case">{form.images.length} файла</span>
                )}
              </label>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400 hover:text-gray-900 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                )}
                {uploading ? 'Качване...' : 'Добави снимка'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            </div>
            {uploadError && <p className="text-xs text-red-500 mb-2">{uploadError}</p>}
            {form.images.length === 0 ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-10 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="text-sm">Кликни за да добавиш снимки</span>
              </button>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {form.images.map((img, i) => (
                  <div key={img.src} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                    <Image src={img.src} alt={img.alt || ''} fill className="object-cover" unoptimized sizes="120px" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-1.5 bg-[#C8A96E] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md leading-none">
                        Основна
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      {i !== 0 && (
                        <button
                          onClick={() => moveToMain(img.src)}
                          className="bg-white text-gray-800 rounded-lg px-2 py-1 text-[10px] font-medium hover:bg-[#C8A96E] hover:text-white transition-colors"
                          title="Задай за основна"
                        >
                          ★
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(img.src)}
                        className="bg-white text-red-500 rounded-lg px-2 py-1 text-[10px] font-medium hover:bg-red-500 hover:text-white transition-colors"
                        title="Премахни"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all disabled:opacity-40"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span className="text-[10px]">Добави</span>
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Audio section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Аудио файлове ({form.audio_urls.length}/{MAX_AUDIO})
              </label>
              {form.audio_urls.length < MAX_AUDIO && (
                <button
                  onClick={() => audioRef.current?.click()}
                  disabled={audioUploading}
                  className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400 hover:text-gray-900 transition-all disabled:opacity-50"
                >
                  {audioUploading
                    ? <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  }
                  {audioUploading ? 'Качване...' : 'Добави аудио'}
                </button>
              )}
              <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={uploadAudio} />
            </div>
            {audioError && <p className="text-xs text-red-500 mb-2">{audioError}</p>}

            {/* Existing audio files */}
            {form.audio_urls.length > 0 && (
              <div className="space-y-2 mb-3">
                {form.audio_urls.map((url, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                    <audio controls src={url} className="w-full h-9 mb-2" />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-gray-400 truncate">{url.split('/').pop()}</p>
                      <button
                        onClick={() => removeAudio(i)}
                        className="text-xs text-red-500 border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-50 transition-colors shrink-0"
                      >
                        Премахни
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone when empty */}
            {form.audio_urls.length === 0 && (
              <button
                onClick={() => audioRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span className="text-sm">Кликни за да качиш аудио</span>
                <span className="text-xs">MP3, WAV, OGG, AAC, FLAC · макс. 3 файла</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* Save bar */}
      <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-3">
        <button onClick={save} disabled={saving}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {saving ? 'Запазване...' : 'Запази'}
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Запазено
          </span>
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  )
}
