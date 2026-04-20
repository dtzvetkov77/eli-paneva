interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({ eyebrow, title, subtitle, centered = false }: SectionHeaderProps) {
  const align = centered ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-3 mb-12 ${align}`}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium">{eyebrow}</span>
      )}
      <h2 className="text-4xl md:text-5xl font-light text-[var(--text-dark)] leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-[var(--text-muted)] text-lg max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}
