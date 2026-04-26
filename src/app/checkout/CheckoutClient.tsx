'use client'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { bgnToEur, formatEur, formatBgn } from '@/lib/currency'
import Image from 'next/image'
import Link from 'next/link'

const BANK_NAME = 'Първа Инвестиционна Банка'
const IBAN = 'BG31FINV91501015509543'
const BIC = 'FINVBGSF'

interface OrderSuccess {
  orderId: number
  orderNumber: string | number
}

export default function CheckoutClient() {
  const { items, total, count, clear: clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<OrderSuccess | null>(null)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postcode: '', note: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lineItems: items.map(i => ({ id: i.id, quantity: i.quantity })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Възникна грешка. Опитай отново.')
      } else {
        clearCart()
        setSuccess({ orderId: data.orderId, orderNumber: data.orderNumber })
      }
    } catch {
      setError('Мрежова грешка. Провери връзката си с интернет.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-(--sage-light) flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14l7 7L23 8" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-serif text-3xl text-(--text-dark) mb-3">Поръчката е получена!</h1>
        <p className="text-(--text-muted) mb-10">
          Поръчка №{success.orderNumber} е регистрирана. Очаквай потвърждение на имейла.
        </p>

        <div className="bg-(--bg-warm) rounded-2xl p-8 text-left space-y-4 mb-8">
          <h2 className="font-serif text-xl text-(--text-dark) mb-4">Данни за банков превод</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <span className="text-(--text-muted) font-medium">Банка</span>
            <span className="text-(--text-dark) font-medium">{BANK_NAME}</span>
            <span className="text-(--text-muted) font-medium">IBAN</span>
            <span className="text-(--text-dark) font-mono tracking-wide">{IBAN}</span>
            <span className="text-(--text-muted) font-medium">BIC / SWIFT</span>
            <span className="text-(--text-dark) font-mono">{BIC}</span>
            <span className="text-(--text-muted) font-medium">Основание</span>
            <span className="text-(--text-dark) font-medium">Поръчка №{success.orderNumber}</span>
          </div>
          <p className="text-xs text-(--text-muted) border-t border-(--border) pt-4 mt-2">
            Моля преведи точната сума и посочи номера на поръчката като основание. Поръчката ще бъде обработена след потвърждаване на превода.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-block text-sm text-(--sage) border border-(--sage) px-8 py-3 rounded-full hover:bg-(--sage) hover:text-white transition-all duration-200"
        >
          Обратно към магазина
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-serif text-2xl text-(--text-dark) mb-4">Количката е празна</p>
        <Link href="/shop" className="text-sm text-(--sage) underline underline-offset-4">
          Към магазина
        </Link>
      </div>
    )
  }

  const eur = bgnToEur(total)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl text-(--text-dark) mb-10">Завърши поръчката</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Billing form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-serif text-xl text-(--text-dark) mb-5">Данни за фактуриране</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-(--text-muted) mb-1.5">Име <span className="text-red-500">*</span></label>
                <input
                  id="firstName" name="firstName" type="text" required
                  value={form.firstName} onChange={handleChange}
                  className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm text-(--text-muted) mb-1.5">Фамилия <span className="text-red-500">*</span></label>
                <input
                  id="lastName" name="lastName" type="text" required
                  value={form.lastName} onChange={handleChange}
                  className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm text-(--text-muted) mb-1.5">Имейл <span className="text-red-500">*</span></label>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-(--text-muted) mb-1.5">Телефон</label>
              <input
                id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm text-(--text-muted) mb-1.5">Адрес</label>
            <input
              id="address" name="address" type="text"
              value={form.address} onChange={handleChange}
              className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-(--text-muted) mb-1.5">Град</label>
              <input
                id="city" name="city" type="text"
                value={form.city} onChange={handleChange}
                className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
              />
            </div>
            <div>
              <label htmlFor="postcode" className="block text-sm text-(--text-muted) mb-1.5">Пощенски код</label>
              <input
                id="postcode" name="postcode" type="text"
                value={form.postcode} onChange={handleChange}
                className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm text-(--text-muted) mb-1.5">Бележка към поръчката</label>
            <textarea
              id="note" name="note" rows={3}
              value={form.note} onChange={handleChange}
              className="w-full border border-(--border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-(--sage) transition-colors resize-none"
            />
          </div>

          {/* Bank transfer notice */}
          <div className="bg-(--bg-warm) rounded-xl p-5 text-sm text-(--text-muted) leading-relaxed">
            <p className="font-medium text-(--text-dark) mb-1">Плащане с банков превод</p>
            <p>След изпращане на поръчката ще получиш данни за превод. Поръчката се обработва след потвърждаване на плащането.</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-(--text-dark) text-white py-4 rounded-2xl text-sm font-medium uppercase tracking-[0.12em] hover:bg-(--sage) transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Изпращане...' : 'Потвърди поръчката'}
          </button>
        </form>

        {/* Order summary */}
        <div className="bg-(--bg-warm) rounded-2xl p-6">
          <h2 className="font-serif text-xl text-(--text-dark) mb-5">Твоята поръчка</h2>

          <ul className="divide-y divide-(--border) mb-6">
            {items.map(item => (
              <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-lg text-(--sage)/30">Е</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--text-dark) line-clamp-2 mb-1">{item.name}</p>
                  <p className="text-xs text-(--text-muted)">x{item.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-(--text-dark) tabular-nums">
                    {formatEur(bgnToEur(item.priceBgn * item.quantity))}
                  </p>
                  <p className="text-xs text-(--text-muted) tabular-nums">
                    {formatBgn(item.priceBgn * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-(--border) pt-4 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-(--text-muted)">Брой артикули</span>
              <span className="text-sm text-(--text-dark)">{count}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-(--text-dark) uppercase tracking-wider">Общо</span>
              <div className="text-right">
                <p className="font-serif text-2xl text-(--text-dark)">{eur.toFixed(2)} €</p>
                <p className="text-xs text-(--text-muted)">{total.toFixed(2)} лв</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
