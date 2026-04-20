import { bgnToEur, formatBgn, formatEur } from '@/lib/currency'

interface PriceDisplayProps {
  priceBgn: number
  className?: string
}

export default function PriceDisplay({ priceBgn, className = '' }: PriceDisplayProps) {
  const eur = bgnToEur(priceBgn)
  return (
    <span className={`font-semibold text-[var(--text-dark)] ${className}`}>
      {formatBgn(priceBgn)}{' '}
      <span className="text-[var(--text-muted)] font-normal text-sm">/ {formatEur(eur)}</span>
    </span>
  )
}
