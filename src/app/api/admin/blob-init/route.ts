import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { writeBlobJson } from '@/lib/blob-store'
import productsData from '@/data/shop/products.json'
import categoriesData from '@/data/shop/categories.json'

// One-time endpoint: uploads local JSON to Vercel Blob.
// Call once after setting BLOB_READ_WRITE_TOKEN in Vercel env.
// Returns BLOB_STORE_URL — add it to Vercel env vars.
export async function POST() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set in env' }, { status: 500 })
  }

  try {
    const [productsUrl, categoriesUrl] = await Promise.all([
      writeBlobJson('shop/products.json', productsData),
      writeBlobJson('shop/categories.json', categoriesData),
    ])

    const storeUrl = productsUrl.replace('/shop/products.json', '')

    return NextResponse.json({
      ok: true,
      productsUrl,
      categoriesUrl,
      storeUrl,
      instructions: `Add this to Vercel env vars: BLOB_STORE_URL=${storeUrl}`,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
