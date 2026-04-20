import Link from 'next/link'
import Image from 'next/image'
import PriceDisplay from '@/components/ui/PriceDisplay'
import type { WCProduct } from '@/lib/woocommerce'

export default function ProductCard({ product }: { product: WCProduct }) {
  const price = parseFloat(product.price) || 0
  const image = product.images[0]
  return (
    <Link href={`/shop/${product.slug}`} className="group bg-white block">
      <div className="aspect-square bg-[var(--sage-light)] relative overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="p-5 border border-t-0 border-[var(--border)]">
        <h3 className="font-serif text-lg text-[var(--text-dark)] mb-2 group-hover:text-[var(--sage)] transition-colors line-clamp-2">
          {product.name}
        </h3>
        {price > 0 && <PriceDisplay priceBgn={price} />}
      </div>
    </Link>
  )
}
