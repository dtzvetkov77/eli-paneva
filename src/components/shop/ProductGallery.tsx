'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { WCImage } from '@/lib/woocommerce'

export default function ProductGallery({ images, name }: { images: WCImage[]; name: string }) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-square bg-(--sage-light) flex items-center justify-center rounded-2xl">
        <span className="font-serif text-4xl text-(--sage)/40">Е</span>
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-square relative overflow-hidden bg-(--sage-light) rounded-2xl">
        <Image
          src={images[active].src}
          alt={images[active].alt || name}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`aspect-square relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                i === active ? 'border-(--sage)' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
