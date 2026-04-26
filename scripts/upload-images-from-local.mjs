#!/usr/bin/env node
/**
 * Upload locally-downloaded WP images → Vercel Blob, then rewrite products.json.
 *
 * Steps:
 *   1. Via FTP download wp-content/uploads/ → scripts/wp-uploads/
 *   2. Run: BLOB_READ_WRITE_TOKEN=... node scripts/upload-images-from-local.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { put } from '@vercel/blob'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRODUCTS_PATH = join(__dirname, '../src/data/shop/products.json')
const LOCAL_UPLOADS = join(__dirname, 'wp-uploads')  // FTP download destination

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN
if (!TOKEN) { console.error('❌  BLOB_READ_WRITE_TOKEN not set'); process.exit(1) }
if (!existsSync(LOCAL_UPLOADS)) {
  console.error(`❌  ${LOCAL_UPLOADS} not found — download wp-content/uploads/ there first`)
  process.exit(1)
}

const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf8'))
const allSrcs = [...new Set(products.flatMap(p => p.images.map(i => i.src)))]
console.log(`📦 ${products.length} products, ${allSrcs.length} unique image URLs\n`)

const urlMap = new Map()
let ok = 0, skip = 0, fail = 0

for (const src of allSrcs) {
  // Extract the path after /wp-content/uploads/  e.g. 2026/02/foo.jpg
  const match = src.match(/\/wp-content\/uploads\/(.+)$/)
  if (!match) {
    urlMap.set(src, src)
    skip++
    continue
  }

  const relPath = match[1]                          // 2026/02/foo.jpg
  const localFile = join(LOCAL_UPLOADS, relPath)    // scripts/wp-uploads/2026/02/foo.jpg
  const filename = relPath.replace(/\//g, '-')      // 2026-02-foo.jpg  (flat name for Blob)
  const blobPath = `product-images/${filename}`

  if (!existsSync(localFile)) {
    console.warn(`⚠️  Not found locally: ${relPath}`)
    urlMap.set(src, src)
    fail++
    continue
  }

  try {
    const buffer = readFileSync(localFile)
    const ext = extname(filename).slice(1).toLowerCase()
    const contentType =
      ext === 'png'  ? 'image/png'  :
      ext === 'webp' ? 'image/webp' :
      ext === 'gif'  ? 'image/gif'  : 'image/jpeg'

    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
      token: TOKEN,
    })

    urlMap.set(src, blob.url)
    ok++
    process.stdout.write(`\r✅ ${ok} uploaded  ⚠️ ${fail} missing  ⏭  ${skip} skipped`)
  } catch (err) {
    console.error(`\n❌  Upload failed: ${relPath}\n   ${err.message}`)
    urlMap.set(src, src)
    fail++
  }
}

console.log(`\n\nDone: ${ok} uploaded, ${fail} missing, ${skip} skipped\n`)
console.log('🔁 Rewriting products.json...')

const updated = products.map(p => ({
  ...p,
  images: p.images.map(img => ({
    ...img,
    src: urlMap.get(img.src) ?? img.src,
    srcset: '',
  })),
}))

writeFileSync(PRODUCTS_PATH, JSON.stringify(updated, null, 2))
console.log('✅ products.json updated\n')
console.log('Next steps:')
console.log('  git add src/data/shop/products.json')
console.log('  git commit -m "fix: migrate product images to Vercel Blob"')
console.log('  git push')
