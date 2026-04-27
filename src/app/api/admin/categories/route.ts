import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readCategories, writeCategory, createCategory, deleteCategory } from '@/lib/supabase-store'
import categoriesData from '@/data/shop/categories.json'
import type { WCCategory } from '@/lib/woocommerce'

const localCategories = categoriesData as WCCategory[]

// Rename/update category
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, name } = await req.json()
  if (!id || !name?.trim()) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const cats = await readCategories(localCategories)
  const cat = cats.find(c => c.id === id)
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    await writeCategory({ ...cat, name: name.trim() })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

// Create new category
export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  try {
    const newCat = await createCategory(name.trim())
    return NextResponse.json(newCat)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

// Delete category
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  try {
    await deleteCategory(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
