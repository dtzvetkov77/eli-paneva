import { put, list } from '@vercel/blob'
import type { WCProduct, WCCategory } from './woocommerce'

export async function readBlobJson<T>(path: string, fallback: T): Promise<T> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return fallback
  try {
    const { blobs } = await list({ prefix: path, token })
    const match = blobs.find(b => b.pathname === path)
    if (!match) return fallback
    const res = await fetch(match.url, { cache: 'no-store' })
    if (!res.ok) return fallback
    return res.json() as Promise<T>
  } catch {
    return fallback
  }
}

export async function writeBlobJson(path: string, data: unknown): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not set')
  const blob = await put(path, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  })
  return blob.url
}

export async function readProducts(fallback: WCProduct[]): Promise<WCProduct[]> {
  return readBlobJson<WCProduct[]>('shop/products.json', fallback)
}

export async function readCategories(fallback: WCCategory[]): Promise<WCCategory[]> {
  return readBlobJson<WCCategory[]>('shop/categories.json', fallback)
}
