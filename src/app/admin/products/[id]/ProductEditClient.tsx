'use client'
import { useState } from 'react'
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

export default function ProductEditClient({ product, allCategories }: Props) {
  const [form, setForm] = useState({
    name: product.name,
    short_description: product.short_description,
    description: product.description,
    regular_price: product.regular_price,
    sale_price: product.sale_price,
    status: product.status,
    stock_status: product.stock_status,
    featured: product.featured,
    category_ids: product.categories.map(c => c.id),
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'description' | 'images'>('general')

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

  async function save() {
    if (!form.name.trim()) { setError('Наименованието е задължително'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          ['images', 'Снимки'],
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
          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Наименование *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Редовна цена (лв)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.regular_price}
                onChange={e => set('regular_price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Намалена цена (лв)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.sale_price}
                onChange={e => set('sale_price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Status row */}
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

          {/* Short description */}
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

          {/* Categories */}
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
        <div>
          <p className="text-sm text-gray-500 mb-6">
            Снимките се управляват директно в WooCommerce.{' '}
            <a href={product.permalink + 'wp-admin/post.php?action=edit'} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline">
              Отвори в WP Admin
            </a>
            {' '}за да добавяш/премахваш снимки, или качи снимки от{' '}
            <a href="/admin/images" className="text-gray-900 underline">Мениджър на снимки</a>
            {' '}и копирай URL-а.
          </p>
          {product.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                  <Image src={img.src} alt={img.alt || product.name} fill className="object-cover" sizes="150px" />
                  {i === 0 && (
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5">Главна</div>
                  )}
                </div>
              ))}
            </div>
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
        {saved && <span className="text-sm text-green-600">Запазено в WooCommerce</span>}
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

      {saved && (
        <p className="mt-3 text-xs text-gray-400">
          Промените са запазени в WooCommerce. Изпълни <code className="bg-gray-100 px-1 rounded">node scripts/sync-products.mjs</code> и deploy за да се отразят в магазина.
        </p>
      )}
    </div>
  )
}
