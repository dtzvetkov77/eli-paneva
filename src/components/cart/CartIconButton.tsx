'use client'
import { useCart } from './CartContext'
import { CartIcon } from './CartDrawer'

export default function CartIconButton() {
  const { openCart, count } = useCart()
  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-(--bg-warm) transition-colors text-(--text-dark) cursor-pointer"
      aria-label="Количка"
    >
      <CartIcon className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-(--gold) text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none tabular-nums">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
