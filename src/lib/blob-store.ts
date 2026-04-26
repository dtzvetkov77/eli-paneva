import { put } from '@vercel/blob'
import type { WCProduct, WCCategory } from './woocommerce'

const BLOB_STORE_URL = process.env.BLOB_STORE_URL?.replace(/\/$/, '')

export async function readBlobJson<T>(path: string, fallback: T): Promise<T> {
  if (!BLOB_STORE_URL) return fallback
  try {
    const res = await fetch(`${BLOB_STORE_URL}/${path}`, {
      next: { revalidate: 60 },
    })
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
