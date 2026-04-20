import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  external?: boolean
}

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  external,
}: ButtonProps) {
  const sizes = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-7 py-3 text-sm',
    lg: 'px-9 py-3.5 text-sm',
  }

  const base = [
    'inline-flex items-center justify-center gap-2 rounded-full',
    'font-medium tracking-[0.06em]',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--sage) focus-visible:ring-offset-2',
    sizes[size],
  ].join(' ')

  const variants = {
    primary: [
      'bg-(--sage) text-white',
      'hover:bg-(--sage-hover) hover:-translate-y-0.5 hover:shadow-lg',
      'active:translate-y-0',
    ].join(' '),
    outline: [
      'border border-(--sage) text-(--sage) bg-transparent',
      'hover:bg-(--sage) hover:text-white hover:-translate-y-0.5 hover:shadow-lg',
      'active:translate-y-0',
    ].join(' '),
    dark: [
      'bg-(--text-dark) text-white',
      'hover:bg-(--sage) hover:-translate-y-0.5 hover:shadow-lg',
      'active:translate-y-0',
    ].join(' '),
    ghost: [
      'text-(--sage) bg-transparent rounded-none',
      'hover:text-(--sage-hover)',
      'relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0',
      'after:bg-(--sage) after:transition-all after:duration-300',
      'hover:after:w-full',
    ].join(' '),
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return external
      ? <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>
      : <Link href={href} className={classes}>{children}</Link>
  }
  return <button onClick={onClick} className={classes}>{children}</button>
}
