'use client'
import { useState, useRef } from 'react'

interface UploadedImage {
  name: string
  url: string
  id?: number
}

export default function ImageManager() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(files: FileList) {
    setUploading(true)
    setError(null)
    const uploaded: UploadedImage[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Грешка при качване')
      } else {
        uploaded.push({ name: data.name, url: data.url, id: data.id })
      }
    }
    setImages(prev => [...uploaded, ...prev])
    setUploading(false)
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
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
          <p className="text-gray-500 text-sm animate-pulse">Качване в WordPress...</p>
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p className="text-gray-700 font-medium mb-1">Плъзни снимки тук или кликни за избор</p>
            <p className="text-gray-400 text-sm">JPG, PNG, WebP, GIF — макс. 10 MB</p>
            <p className="text-gray-400 text-xs mt-2">Снимките се качват директно в WordPress медия библиотека</p>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-700">
        <p className="font-medium mb-1">Как да качвам снимки?</p>
        <ol className="list-decimal pl-4 space-y-1 text-blue-600">
          <li>Кликни горе или плъзни файл — снимката се качва в WordPress</li>
          <li>Копирай URL-а и го постави където е нужно</li>
          <li>За да виждаш всички снимки: <a href="https://elipaneva.com/wp-admin/upload.php" target="_blank" rel="noopener noreferrer" className="underline font-medium">WordPress медия библиотека →</a></li>
        </ol>
        <p className="mt-2 text-xs text-blue-500">Изисква WP_USERNAME и WP_APP_PASSWORD в Vercel environment variables.</p>
      </div>

      {/* Gallery of just-uploaded in this session */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Качени в тази сесия</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(img => (
              <div key={img.url} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI(img.url)}
                  alt={img.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-2">
                  <p className="text-xs text-gray-500 truncate" title={img.name}>{img.name}</p>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <button
                    onClick={() => copy(img.url)}
                    className="w-full text-xs bg-white text-gray-900 rounded-lg py-1.5 font-medium hover:bg-gray-100 transition-colors"
                  >
                    {copied === img.url ? '✓ Копирано' : 'Копирай URL'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
