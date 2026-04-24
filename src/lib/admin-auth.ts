import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

function makeToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'changeme'
  return createHmac('sha256', 'eli-admin-v1').update(password).digest('hex')
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get('eli_admin_token')?.value
  return token === makeToken()
}

export function getToken(): string {
  return makeToken()
}
