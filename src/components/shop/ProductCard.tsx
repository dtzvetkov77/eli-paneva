import Link from 'next/link'
import Image from 'next/image'
import AddToCartButton from '@/components/cart/AddToCartButton'
import { bgnToEur, formatEur, formatBgn } from '@/lib/currency'
import type { WCProduct } from '@/lib/woocommerce'

export default function ProductCard({ product }: { product: WCProduct }) {
  const price = parseFloat(product.price) || 0
  const regularPrice = parseFloat(product.regular_price) || 0
  const isOnSale = !!product.sale_price && parseFloat(product.sale_price) > 0 && regularPrice > price
  const image = product.images[0]

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-(--border) hover:border-(--sage) hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="aspect-square bg-(--sage-light) relative overflow-hidden">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

        <div className="p-5 pb-2">
          <h3 className="font-serif text-lg text-(--text-dark) mb-2 group-hover:text-(--sage) transition-colors duration-300 line-clamp-2 leading-snug font-normal">
            {product.name}
          </h3>

          {price > 0 && (
            <div className="space-y-0.5">
              {/* Current price — EUR primary */}
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-(--text-dark)">{formatEur(bgnToEur(price))}</span>
                <span className="text-xs text-(--text-muted)">/ {formatBgn(price)}</span>
              </div>
              {/* Strikethrough original if on sale */}
              {isOnSale && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-(--text-muted) line-through">{formatEur(bgnToEur(regularPrice))}</span>
                  <span className="text-xs text-(--text-muted) line-through">{formatBgn(regularPrice)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="px-5 pb-5 mt-auto">
        <AddToCartButton
          id={product.id}
          slug={product.slug}
          name={product.name}
          priceBgn={price}
          regularPriceBgn={regularPrice}
          image={image?.src}
          permalink={product.permalink}
        />
      </div>
    </div>
  )
}
