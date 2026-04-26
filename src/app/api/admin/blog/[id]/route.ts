import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { put, del, list } from '@vercel/blob'
import type { BlogPost } from '../route'

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!TOKEN) return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set in environment' }, { status: 500 })
  try {
    const { id } = await params
    const body: BlogPost = await req.json()
    const post: BlogPost = { ...body, id }
    await put(`blog/${id}.json`, JSON.stringify(post), {
      access: 'public', contentType: 'application/json', addRandomSuffix: false, token: TOKEN,
    })
    return NextResponse.json(post)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { blobs } = await list({ prefix: `blog/${id}.json`, token: TOKEN })
  if (blobs[0]) await del(blobs[0].url, { token: TOKEN })
  return NextResponse.json({ ok: true })
}
