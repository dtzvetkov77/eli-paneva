const BGN_PER_EUR = 1.95583

export function bgnToEur(bgn: number): number {
  return Math.round((bgn / BGN_PER_EUR) * 100) / 100
}

export function formatBgn(amount: number): string {
  return `${amount.toFixed(2)} лв`
}

export function formatEur(amount: number): string {
  return `${amount.toFixed(2)} €`
}
