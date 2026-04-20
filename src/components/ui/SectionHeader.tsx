interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  const align = centered ? 'text-center items-center' : 'text-left items-start'
  const textColor = light ? 'text-white' : 'text-(--text-dark)'
  const subColor = light ? 'text-white/60' : 'text-(--text-muted)'

  return (
    <div className={`flex flex-col gap-4 mb-14 ${align}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
          <span className="block w-6 h-px bg-(--gold)" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-(--gold) font-medium">
            {eyebrow}
          </span>
          <span className="block w-6 h-px bg-(--gold)" />
        </div>
      )}
      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-light ${textColor} leading-[1.05]`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`${subColor} text-lg leading-relaxed max-w-2xl`}>{subtitle}</p>
      )}
    </div>
  )
}
