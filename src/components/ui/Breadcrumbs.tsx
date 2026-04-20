import Link from 'next/link'

interface Crumb { label: string; href?: string }

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-(--text-muted) mb-8">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {crumb.href
            ? <Link href={crumb.href} className="hover:text-(--sage) transition-colors">{crumb.label}</Link>
            : <span className="text-(--text-dark)">{crumb.label}</span>}
        </span>
      ))}
    </nav>
  )
}
