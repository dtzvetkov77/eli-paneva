export interface CartItem {
  id: number
  slug: string
  name: string
  priceBgn: number
  regularPriceBgn?: number
  image?: string
  permalink: string
  quantity: number
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceBgn * i.quantity, 0)
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}
