import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'
import { NextRequest } from 'next/server'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

export async function GET() {
  try {
    const files = await readdir(UPLOADS_DIR)
    const images = await Promise.all(
      files
        .filter(f => IMAGE_EXTS.has('.' + f.split('.').pop()!.toLowerCase()))
        .map(async name => {
          const s = await stat(join(UPLOADS_DIR, name))
          return { name, url: `/uploads/${name}`, size: s.size, mtime: s.mtimeMs }
        })
    )
    images.sort((a, b) => b.mtime - a.mtime)
    return NextResponse.json(images)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { name } = await req.json()
  // Prevent path traversal
  if (!name || name.includes('/') || name.includes('..')) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
  await unlink(join(UPLOADS_DIR, name))
  return NextResponse.json({ ok: true })
}
