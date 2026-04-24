import { bgnToEur, formatBgn, formatEur } from '@/lib/currency'

interface PriceDisplayProps {
  priceBgn: number
  className?: string
}

export default function PriceDisplay({ priceBgn, className = '' }: PriceDisplayProps) {
  const eur = bgnToEur(priceBgn)
  return (
    <span className={`font-semibold text-(--text-dark) ${className}`}>
      {formatEur(eur)}{' '}
      <span className="text-(--text-muted) font-normal text-sm">/ {formatBgn(priceBgn)}</span>
    </span>
  )
}
