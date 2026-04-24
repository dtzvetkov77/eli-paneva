'use client'
import { useState } from 'react'
import { useCart } from './CartContext'
import type { CartItem } from '@/lib/cart'

type Props = Omit<CartItem, 'quantity'>

export default function AddToCartButton(props: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    addItem(props)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      className={`block w-full text-center text-xs font-medium uppercase tracking-[0.12em] py-2.5 rounded-xl border transition-all duration-200 mt-3 ${
        added
          ? 'bg-(--sage) border-(--sage) text-white'
          : 'border-(--sage) text-(--sage) hover:bg-(--sage) hover:text-white'
      }`}
    >
      {added ? '✓ Добавено' : 'Добави в количката'}
    </button>
  )
}
