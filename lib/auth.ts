import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { dbConnect } from './db'
import { User } from '@/models/User'
import { ensureDefaultUser as seedDefaultUser } from './seed'

// Prefer environment-provided secret; fall back for dev only
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const COOKIE_NAME = 'auth'

export type JwtPayload = { uid: string }

export function signJwt(payload: JwtPayload, days = 7) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${days}d` })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export async function ensureDefaultUser() { await seedDefaultUser() }

export async function signIn(username: string, password: string) {
  await dbConnect()
  const user = await User.findOne({ username })
  if (!user) return null
  const ok = password === user.password
  if (!ok) return null
  const token = signJwt({ uid: user.id })
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return { id: user.id, username: user.username }
}

export async function getUserFromCookies(): Promise<JwtPayload | null> {
  const jar = await cookies()
  const c = jar.get(COOKIE_NAME)
  if (!c) return null
  return verifyJwt(c.value)
}

export async function signOut() {
  const jar = await cookies()
  jar.set(COOKIE_NAME, '', { httpOnly: true, maxAge: 0, path: '/' })
}
