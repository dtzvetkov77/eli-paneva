import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.ADMIN_PASSWORD ?? 'changeme'

  if (password !== correct) {
    return NextResponse.json({ error: 'Грешна парола' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('eli_admin_token', getToken(), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('eli_admin_token', '', { maxAge: 0, path: '/' })
  return res
}
