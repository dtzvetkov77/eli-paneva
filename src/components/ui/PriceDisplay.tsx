import { bgnToEur, formatEur } from '@/lib/currency'

interface PriceDisplayProps {
  priceBgn: number
  className?: string
}

export default function PriceDisplay({ priceBgn, className = '' }: PriceDisplayProps) {
  return (
    <span className={`font-semibold text-(--text-dark) ${className}`}>
      {formatEur(bgnToEur(priceBgn))}
    </span>
  )
}
