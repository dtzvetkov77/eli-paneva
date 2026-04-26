import Link from 'next/link'

interface Crumb { label: string; href?: string }

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://elipaneva.com${crumb.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
    </>
  )
}
