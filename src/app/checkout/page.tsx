import type { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Поръчка',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <div className="pt-16 min-h-dvh">
      <CheckoutClient />
    </div>
  )
}
