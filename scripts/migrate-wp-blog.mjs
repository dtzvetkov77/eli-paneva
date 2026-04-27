import { put, list } from '@vercel/blob'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Parse .env.local manually
try {
  const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
} catch {}

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const WP_API = 'https://elipaneva.com/wp-json/wp/v2'

const BG = {
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
  try {
    const decoded = decodeURIComponent(raw)
    return decoded.split('').map(ch => BG[ch] ?? ch).join('').toLowerCase()
  } catch {
    return raw.toLowerCase()
  }
}

if (!TOKEN) {
  console.error('❌  BLOB_READ_WRITE_TOKEN not in .env.local')
  process.exit(1)
}

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '').trim()
}

async function fetchAllPosts() {
  const all = []
  let page = 1
  while (true) {
    console.log(`  Fetching page ${page}...`)
    const res = await fetch(`${WP_API}/posts?per_page=100&page=${page}&status=publish&_embed=1`)
    if (!res.ok) { console.error('WP API error:', res.status); break }
    const posts = await res.json()
    if (!posts.length) break
    all.push(...posts)
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1')
    console.log(`  Got ${posts.length} posts (page ${page}/${totalPages})`)
    if (page >= totalPages) break
    page++
  }
  return all
}

async function main() {
  console.log('Fetching posts from WordPress...')
  const wpPosts = await fetchAllPosts()
  console.log(`Total: ${wpPosts.length} posts\n`)

  if (!wpPosts.length) { console.error('No posts fetched'); process.exit(1) }

  // Get existing blobs to skip duplicates
  const { blobs } = await list({ prefix: 'blog/', token: TOKEN })
  const existing = new Set(blobs.map(b => b.pathname))
  console.log(`Existing in Blob: ${existing.size} files\n`)

  let migrated = 0, skipped = 0, failed = 0

  for (const wp of wpPosts) {
    const id = `wp-${wp.id}`
    const pathname = `blog/${id}.json`

    if (existing.has(pathname) && !process.argv.includes('--force')) {
      console.log(`  SKIP  ${wp.slug}`)
      skipped++
      continue
    }

    const coverImage = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''

    const post = {
      id,
      slug: translitSlug(wp.slug),
      title: stripHtml(wp.title?.rendered ?? ''),
      excerpt: wp.excerpt?.rendered ?? '',
      content: wp.content?.rendered ?? '',
      date: wp.date,
      coverImage,
      published: true,
    }

    try {
      await put(pathname, JSON.stringify(post), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
        token: TOKEN,
      })
      console.log(`  ✓     ${wp.slug}`)
      migrated++
    } catch (e) {
      console.error(`  ✗     ${wp.slug} — ${e.message}`)
      failed++
    }
  }

  console.log(`\nDone: ${migrated} migrated, ${skipped} skipped, ${failed} failed`)
}

main().catch(e => { console.error(e); process.exit(1) })
