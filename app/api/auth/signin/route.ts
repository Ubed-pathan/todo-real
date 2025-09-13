import { NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as { username?: string; password?: string }
  const username = body.username || ''
  const password = body.password || ''
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }
  const user = await signIn(username, password)
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  return NextResponse.json({ user })
}
