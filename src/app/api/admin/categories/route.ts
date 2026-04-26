import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readCategories, writeBlobJson } from '@/lib/blob-store'
import categoriesData from '@/data/shop/categories.json'
import type { WCCategory } from '@/lib/woocommerce'

const localCategories = categoriesData as WCCategory[]

async function getAll(): Promise<Array<WCCategory & { count?: number }>> {
  return readCategories(localCategories as Array<WCCategory & { count?: number }>)
}

// Rename category
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, name } = await req.json()
  if (!id || !name?.trim()) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const cats = await getAll()
  const updated = cats.map(c => c.id === id ? { ...c, name: name.trim() } : c)
  await writeBlobJson('shop/categories.json', updated)
  return NextResponse.json({ ok: true })
}

// Create new category
export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const cats = await getAll()
  const slug = name.trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\wЀ-ӿ-]/g, '')
  const maxId = cats.reduce((m, c) => Math.max(m, c.id), 0)
  const newCat = { id: maxId + 1, name: name.trim(), slug, count: 0 }
  await writeBlobJson('shop/categories.json', [...cats, newCat])
  return NextResponse.json(newCat)
}

// Delete category
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const cats = await getAll()
  await writeBlobJson('shop/categories.json', cats.filter(c => c.id !== id))
  return NextResponse.json({ ok: true })
}
