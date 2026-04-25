'use client'
import { useCart } from '@/components/cart/CartContext'
import type { WCProduct } from '@/lib/woocommerce'

export default function AddToCartButton({ product }: { product: WCProduct }) {
  const { items, addItem, openCart } = useCart()
  const inCart = items.some(i => i.id === product.id)

  function handle() {
    if (!inCart) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceBgn: parseFloat(product.price) || 0,
        regularPriceBgn: parseFloat(product.regular_price) || undefined,
        image: product.images[0]?.src,
        permalink: product.permalink,
      })
    }
    openCart()
  }

  return (
    <button
      onClick={handle}
      className="w-full py-4 text-sm font-medium uppercase tracking-[0.12em] transition-all duration-200 bg-(--text-dark) text-white hover:bg-(--sage)"
    >
      {inCart ? 'Виж количката' : 'Добави в количката'}
    </button>
  )
}
