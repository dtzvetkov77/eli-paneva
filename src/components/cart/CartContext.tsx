'use client'
import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import type { CartItem } from '@/lib/cart'
import { cartTotal, cartCount } from '@/lib/cart'

interface CartState { items: CartItem[]; open: boolean }

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'REMOVE'; id: number }
  | { type: 'SET_QTY'; id: number; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items }
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id)
      const items = existing
        ? state.items.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, action.item]
      return { ...state, open: true, items }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'SET_QTY':
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i.id !== action.id) }
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, quantity: action.qty } : i) }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
  }
}

interface CartCtx {
  items: CartItem[]
  open: boolean
  count: number
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  setQty: (id: number, qty: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eli_cart')
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) })
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('eli_cart', JSON.stringify(state.items))
  }, [state.items, hydrated])

  const value: CartCtx = {
    items: state.items,
    open: state.open,
    count: cartCount(state.items),
    total: cartTotal(state.items),
    addItem: item => dispatch({ type: 'ADD', item: { ...item, quantity: 1 } }),
    removeItem: id => dispatch({ type: 'REMOVE', id }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
    openCart: () => dispatch({ type: 'OPEN' }),
    closeCart: () => dispatch({ type: 'CLOSE' }),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
