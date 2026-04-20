import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  children: React.ReactNode
  className?: string
  external?: boolean
}

export default function Button({ href, onClick, variant = 'primary', children, className = '', external }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-7 py-3 text-sm font-medium tracking-wide transition-all duration-200'
  const variants = {
    primary: 'bg-[var(--sage)] text-white hover:bg-[var(--text-dark)]',
    outline: 'border border-[var(--sage)] text-[var(--sage)] hover:bg-[var(--sage)] hover:text-white',
    ghost: 'text-[var(--sage)] hover:text-[var(--text-dark)] underline-offset-4 hover:underline',
  }
  const classes = `${base} ${variants[variant]} ${className}`
  if (href) {
    return external
      ? <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>
      : <Link href={href} className={classes}>{children}</Link>
  }
  return <button onClick={onClick} className={classes}>{children}</button>
}
