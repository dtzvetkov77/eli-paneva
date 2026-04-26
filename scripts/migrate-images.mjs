#!/usr/bin/env node
/**
 * Migrate WP product images → Vercel Blob
 * 1. Reads src/data/shop/products.json
 * 2. Downloads each unique image from elipaneva.com/wp-content/...
 * 3. Uploads to Vercel Blob under product-images/
 * 4. Rewrites products.json with new Blob URLs
 *
 * Run: BLOB_READ_WRITE_TOKEN=... node scripts/migrate-images.mjs
 * Or:  node -r dotenv/config scripts/migrate-images.mjs  (if you have dotenv)
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { put } from '@vercel/blob'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRODUCTS_PATH = join(__dirname, '../src/data/shop/products.json')

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN
if (!TOKEN) {
  console.error('❌  BLOB_READ_WRITE_TOKEN not set')
  process.exit(1)
}

const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf8'))

// Collect unique src URLs
const allSrcs = [...new Set(products.flatMap(p => p.images.map(i => i.src)))]
console.log(`📦 ${products.length} products, ${allSrcs.length} unique images`)

// Map old URL → new Blob URL
const urlMap = new Map()

let done = 0
for (const src of allSrcs) {
  if (!src.includes('elipaneva.com/wp-content')) {
    // Already migrated or external — keep as-is
    urlMap.set(src, src)
    done++
    continue
  }

  try {
    // Derive a stable filename from the URL path
    const urlPath = new URL(src).pathname          // /wp-content/uploads/2026/02/foo.jpg
    const filename = urlPath.split('/').pop()       // foo.jpg
    const blobPath = `product-images/${filename}`

    // Download via curl (handles cookies, TLS, redirects better than fetch)
    let buffer
    try {
      const bytes = execSync(
        `curl -sL --max-time 30 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -e "https://elipaneva.com/" "${src}"`,
        { maxBuffer: 20 * 1024 * 1024 }
      )
      if (bytes.length < 100) throw new Error(`Too small (${bytes.length} bytes) — likely error page`)
      buffer = bytes
    } catch (e) {
      throw new Error(`curl failed: ${e.message}`)
    }

    // Derive content type from extension
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg'
    const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
      token: TOKEN,
    })

    urlMap.set(src, blob.url)
    done++
    process.stdout.write(`\r✅ ${done}/${allSrcs.length}  ${filename.slice(0, 40)}`)
  } catch (err) {
    console.error(`\n⚠️  Failed: ${src}\n   ${err.message}`)
    urlMap.set(src, src) // keep original on failure
  }
}

console.log('\n\n🔁 Rewriting products.json...')

const updated = products.map(p => ({
  ...p,
  images: p.images.map(img => ({
    ...img,
    src: urlMap.get(img.src) ?? img.src,
    // Strip srcset — those are WP-generated sizes, won't exist in Blob
    srcset: '',
  })),
}))

writeFileSync(PRODUCTS_PATH, JSON.stringify(updated, null, 2))
console.log('✅ products.json updated')
console.log('')
console.log('Next steps:')
console.log('  1. git add src/data/shop/products.json && git commit -m "migrate product images to Vercel Blob"')
console.log('  2. git push → Vercel auto-deploys')
console.log('  3. Add BLOB_STORE_URL env var in Vercel dashboard if not already set')
