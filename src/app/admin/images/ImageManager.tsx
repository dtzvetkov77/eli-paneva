'use client'
import { useState, useEffect, useRef } from 'react'

interface ImageFile {
  name: string
  url: string
  size: number
  mtime: number
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const res = await fetch('/api/admin/images')
    if (res.ok) setImages(await res.json())
  }

  useEffect(() => { load() }, [])

  async function upload(files: FileList) {
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      await fetch('/api/admin/upload', { method: 'POST', body: fd })
    }
    await load()
    setUploading(false)
  }

  async function remove(name: string) {
    if (!confirm(`Изтрий "${name}"?`)) return
    setDeleting(name)
    await fetch('/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await load()
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
      {/* Upload zone */}
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-gray-500 transition-colors mb-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && upload(e.target.files)}
        />
        {uploading ? (
          <p className="text-gray-500 text-sm">Качване...</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-1">Плъзни снимки тук или кликни</p>
            <p className="text-gray-400 text-sm">JPG, PNG, WebP, GIF — макс. 10 MB</p>
          </>
        )}
      </div>

      {/* Gallery */}
      {images.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">Все още няма качени снимки.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.name} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-2">
                <p className="text-xs text-gray-500 truncate" title={img.name}>{img.name}</p>
                <p className="text-xs text-gray-400">{(img.size / 1024).toFixed(0)} KB</p>
              </div>
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => copy(img.url)}
                  className="w-full text-xs bg-white text-gray-900 rounded-lg py-1.5 font-medium hover:bg-gray-100 transition-colors"
                >
                  {copied === img.url ? '✓ Копирано' : 'Копирай URL'}
                </button>
                <button
                  onClick={() => remove(img.name)}
                  disabled={deleting === img.name}
                  className="w-full text-xs bg-red-500 text-white rounded-lg py-1.5 font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting === img.name ? '...' : 'Изтрий'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
