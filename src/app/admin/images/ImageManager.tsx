'use client'
import { useState, useRef, useEffect } from 'react'

interface BlobImage { url: string; name: string; pathname: string }

export default function ImageManager() {
  const [images, setImages] = useState<BlobImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/upload').then(r => r.json()).then(data => {
      setImages(Array.isArray(data) ? data.reverse() : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function upload(files: FileList) {
    setUploading(true)
    setError(null)
    const uploaded: BlobImage[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Грешка при качване')
      else uploaded.push({ url: data.url, name: data.name, pathname: data.pathname })
    }
    setImages(prev => [...uploaded, ...prev])
    setUploading(false)
  }

  async function deleteImage(img: BlobImage) {
    if (!confirm(`Изтрий „${img.name}"?`)) return
    setDeleting(img.url)
    const res = await fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: img.url }) })
    if (res.ok) setImages(prev => prev.filter(i => i.url !== img.url))
    else setError('Грешка при изтриване')
    setDeleting(null)
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) upload(e.dataTransfer.files)
  }

  return (
    <div>
      {error && <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">{error}</div>}

      <div
        onDrop={onDrop} onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-gray-500 transition-colors mb-8"
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => e.target.files && upload(e.target.files)} />
        {uploading ? (
          <p className="text-gray-500 text-sm animate-pulse">Качване в Blob...</p>
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p className="text-gray-700 font-medium mb-1">Плъзни снимки тук или кликни за избор</p>
            <p className="text-gray-400 text-sm">JPG, PNG, WebP, GIF — макс. 10 MB</p>
          </>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Зарежда...</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Все още няма качени снимки</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.url} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.name} className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="text-xs text-gray-500 truncate" title={img.name}>{img.name}</p>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button onClick={e => { e.stopPropagation(); copy(img.url) }}
                  className="w-full text-xs bg-white text-gray-900 rounded-lg py-1.5 font-medium hover:bg-gray-100 transition-colors">
                  {copied === img.url ? '✓ Копирано' : 'Копирай URL'}
                </button>
                <button onClick={e => { e.stopPropagation(); deleteImage(img) }}
                  disabled={deleting === img.url}
                  className="w-full text-xs bg-red-500 text-white rounded-lg py-1.5 font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
                  {deleting === img.url ? '...' : 'Изтрий'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
