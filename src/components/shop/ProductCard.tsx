import Link from 'next/link'
import Image from 'next/image'
import PriceDisplay from '@/components/ui/PriceDisplay'
import type { WCProduct } from '@/lib/woocommerce'

export default function ProductCard({ product }: { product: WCProduct }) {
  const price = parseFloat(product.price) || 0
  const regularPrice = parseFloat(product.regular_price) || 0
  const isOnSale = product.sale_price && parseFloat(product.sale_price) > 0 && regularPrice > price
  const image = product.images[0]

  return (
    <Link href={`/shop/${product.slug}`} className="group bg-white block rounded-2xl overflow-hidden border border-(--border) hover:border-(--sage) hover:shadow-lg transition-all duration-400">
      <div className="aspect-square bg-(--sage-light) relative overflow-hidden">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-5xl text-(--sage)/20 select-none">Е</span>
          </div>
        )}

        {isOnSale && (
          <span className="absolute top-3 left-3 bg-(--gold) text-white text-xs font-medium px-3 py-1 rounded-full">
            Промо
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg text-(--text-dark) mb-2.5 group-hover:text-(--sage) transition-colors duration-300 line-clamp-2 leading-snug font-normal">
          {product.name}
        </h3>

        {price > 0 && (
          <div className="flex items-baseline gap-3">
            <PriceDisplay priceBgn={price} />
            {isOnSale && (
              <span className="text-xs text-(--text-muted) line-through">
                {regularPrice.toFixed(2)} лв
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
