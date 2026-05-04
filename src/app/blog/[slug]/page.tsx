import { getPost, getPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import StructuredData from '@/components/ui/StructuredData'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPosts(1, 100)
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt?.slice(0, 160) || '',
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Ели Панева' },
    publisher: { '@type': 'Person', name: 'Ели Панева' },
    image: post.coverImage || undefined,
    url: `https://elipaneva.com/blog/${post.slug}`,
  }

  return (
    <div className="pt-16">
      <StructuredData data={articleSchema} />
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--sage) transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Всички статии
        </Link>

        <time className="text-xs text-(--gold) uppercase tracking-widest block mb-4">
          {new Date(post.date).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <h1 className="font-serif text-4xl md:text-5xl text-(--text-dark) leading-tight mb-8">{post.title}</h1>

        {post.coverImage && (
          <div className="aspect-video relative overflow-hidden mb-10 bg-(--sage-light)">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-(--text-dark) prose-headings:font-serif prose-a:text-(--sage) prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-(--border)">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <p className="font-serif text-xl text-(--text-dark) mb-1">Искаш да работим заедно?</p>
              <p className="text-sm text-(--text-muted)">Запази час за консултация с Ели.</p>
            </div>
            <Link
              href="/kontakti"
              className="bg-(--sage) text-white text-sm px-6 py-3 hover:bg-(--text-dark) transition-colors"
            >
              Запази час
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
