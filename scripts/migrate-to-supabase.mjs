import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envFile = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#') && l.trim())
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const products = JSON.parse(readFileSync(join(__dirname, '../src/data/shop/products.json'), 'utf8'))
const rawCats = JSON.parse(readFileSync(join(__dirname, '../src/data/shop/categories.json'), 'utf8'))

const categories = rawCats.map(c => ({
  id: c.id, name: c.name, slug: c.slug, parent: c.parent ?? 0, count: c.count ?? 0,
}))

console.log(`Migrating ${products.length} products + ${categories.length} categories...\n`)

let ok = 0, fail = 0

for (const product of products) {
  const { error } = await sb.from('products').upsert({ id: product.id, data: product }, { onConflict: 'id' })
  if (error) { console.error(`x Product ${product.id}: ${error.message}`); fail++ }
  else { console.log(`ok Product ${product.id}: ${product.name}`); ok++ }
}

for (const cat of categories) {
  const { error } = await sb.from('categories').upsert({ id: cat.id, data: cat }, { onConflict: 'id' })
  if (error) { console.error(`x Category ${cat.id}: ${error.message}`); fail++ }
  else { console.log(`ok Category ${cat.id}: ${cat.name}`); ok++ }
}

console.log(`\nDone: ${ok} OK, ${fail} failed`)
