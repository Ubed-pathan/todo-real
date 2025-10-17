import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/signin',
  '/_next',
  '/favicon.ico',
  '/icon.svg',
  '/manifest.webmanifest',
  '/api/auth/signin',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Bypass auth for public assets and routes
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }
  const token = req.cookies.get('auth')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
