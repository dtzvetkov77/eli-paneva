#!/usr/bin/env node
/**
 * Sync products and categories from WooCommerce → local JSON files.
 * Run: node scripts/sync-products.mjs
 * Requires: WOOCOMMERCE_KEY, WOOCOMMERCE_SECRET, WC_API_URL in .env.local
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const BG_MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
  'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
  'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ж':'Zh','З':'Z',
  'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P',
  'Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch',
  'Ш':'Sh','Щ':'Sht','Ъ':'A','Ь':'','Ю':'Yu','Я':'Ya',
}

function translitSlug(raw) {
  const decoded = decodeURIComponent(raw)
  return decoded.split('').map(ch => BG_MAP[ch] ?? ch).join('').toLowerCase()
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Load .env.local
try {
  const env = readFileSync(join(root, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  }
} catch {
  console.error('Could not load .env.local')
}

const KEY = process.env.WOOCOMMERCE_KEY
const SECRET = process.env.WOOCOMMERCE_SECRET
const BASE = process.env.WC_API_URL

if (!KEY || !SECRET || !BASE) {
  console.error('Missing WOOCOMMERCE_KEY / WOOCOMMERCE_SECRET / WC_API_URL')
  process.exit(1)
}

const auth = 'Basic ' + Buffer.from(`${KEY}:${SECRET}`).toString('base64')

async function wcFetch(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { headers: { Authorization: auth } })
  if (!res.ok) throw new Error(`WC error ${res.status}: ${endpoint}`)
  return res.json()
}

async function fetchAllProducts() {
  let page = 1
  let all = []
  while (true) {
    const batch = await wcFetch('products', {
      per_page: '100',
      status: 'publish',
      page: String(page),
    })
    if (!batch.length) break
    all = all.concat(batch)
    if (batch.length < 100) break
    page++
  }
  return all
}

async function main() {
  console.log('Fetching categories...')
  const categories = await wcFetch('products/categories', { per_page: '100', hide_empty: 'false' })
  console.log(`  → ${categories.length} categories`)

  console.log('Fetching products...')
  const products = await fetchAllProducts()
  console.log(`  → ${products.length} products`)

  // Keep only needed fields to reduce file size
  const slimProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: translitSlug(p.slug),
    permalink: p.permalink,
    description: p.description,
    short_description: p.short_description,
    price: p.price,
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    categories: p.categories.map(c => ({ ...c, slug: translitSlug(c.slug) })),
    images: p.images,
    status: p.status,
    featured: p.featured,
    stock_status: p.stock_status,
  }))

  writeFileSync(
    join(root, 'src/data/shop/products.json'),
    JSON.stringify(slimProducts, null, 2)
  )
  const slimCategories = categories.map(c => ({
    ...c,
    slug: translitSlug(c.slug),
  }))

  writeFileSync(
    join(root, 'src/data/shop/categories.json'),
    JSON.stringify(slimCategories, null, 2)
  )

  console.log('\n✓ Saved locally:')
  console.log('  src/data/shop/products.json')
  console.log('  src/data/shop/categories.json')

  // Push to Vercel Blob if token is available
  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
  if (BLOB_TOKEN) {
    console.log('\nUploading to Vercel Blob...')
    try {
      const { put } = await import('@vercel/blob')
      const [pr, cr] = await Promise.all([
        put('shop/products.json', JSON.stringify(slimProducts, null, 2), {
          access: 'public', contentType: 'application/json',
          addRandomSuffix: false, token: BLOB_TOKEN,
        }),
        put('shop/categories.json', JSON.stringify(slimCategories, null, 2), {
          access: 'public', contentType: 'application/json',
          addRandomSuffix: false, token: BLOB_TOKEN,
        }),
      ])
      const storeUrl = pr.url.replace('/shop/products.json', '')
      console.log(`  ✓ Products  → ${pr.url}`)
      console.log(`  ✓ Categories→ ${cr.url}`)
      console.log(`\nBLOB_STORE_URL=${storeUrl}`)
    } catch (e) {
      console.error('  Blob upload failed:', e.message)
    }
  } else {
    console.log('\nTip: Set BLOB_READ_WRITE_TOKEN in .env.local to also push to Vercel Blob.')
  }

  console.log('\nRun "git add src/data/shop && git commit" to commit the catalog.')
}

main().catch(err => { console.error(err); process.exit(1) })
