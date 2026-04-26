import { getPost, getPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StructuredData from '@/components/ui/StructuredData'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const posts = await getPosts(1, 100)
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]+>/g, '').slice(0, 160),
    alternates: { canonical: `https://elipaneva.com/blog/${slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const date = new Date(post.date).toLocaleDateString('bg-BG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt.replace(/<[^>]+>/g, '').slice(0, 160),
    datePublished: post.date,
    url: `https://elipaneva.com/blog/${slug}`,
    author: {
      '@type': 'Person',
      '@id': 'https://elipaneva.com/#person',
      name: 'Ели Панева',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ели Панева',
      url: 'https://elipaneva.com',
      logo: { '@type': 'ImageObject', url: 'https://elipaneva.com/logo.webp' },
    },
    ...(post.coverImage ? { image: post.coverImage } : {}),
  }

  return (
    <div className="pt-16">
      <StructuredData data={articleSchema} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumbs crumbs={[
          { label: 'Начало', href: '/' },
          { label: 'Блог', href: '/blog' },
          { label: post.title },
        ]} />
        <time className="text-xs text-(--gold) uppercase tracking-widest block mb-4">{date}</time>
        <h1 className="font-serif text-4xl md:text-5xl text-(--text-dark) leading-tight mb-8">
          {post.title}
        </h1>
        {post.coverImage && (
          <div className="aspect-video relative overflow-hidden mb-10 bg-(--sage-light)">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div
          className="prose prose-lg max-w-none text-(--text-dark) prose-headings:font-serif prose-a:text-(--sage) prose-a:no-underline hover:prose-a:underline prose-img:rounded-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="mt-16 pt-8 border-t border-(--border)">
          <div className="bg-(--sage-light) p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div>
              <p className="font-serif text-2xl text-(--text-dark) mb-1">Искаш да работим заедно?</p>
              <p className="text-sm text-(--text-muted)">Запази час за консултация с Ели.</p>
            </div>
            <Button href="/kontakti" variant="primary">Запази час</Button>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/blog" className="text-sm text-(--sage) hover:underline">← Обратно към блога</Link>
        </div>
      </div>
    </div>
  )
}
