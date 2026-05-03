'use client'
import { useState } from 'react'

interface WCCategory { id: number; name: string; slug: string }
interface WCImage { id: number; src: string; alt: string }
interface WCProduct {
  id: number; name: string; slug: string; permalink: string
  description: string; short_description: string
  price: string; regular_price: string; sale_price: string
  status: string; featured: boolean; stock_status: string
  images: WCImage[]; categories: WCCategory[]
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
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'description'>('general')
  const [catSearch, setCatSearch] = useState('')

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false); setError('')
  }

  function toggleCategory(id: number) {
    set('category_ids', form.category_ids.includes(id)
      ? form.category_ids.filter(x => x !== id)
      : [...form.category_ids, id])
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
