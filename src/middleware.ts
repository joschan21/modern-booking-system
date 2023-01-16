// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { verifyAuth } from './lib/auth'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('user-token')?.value

  // validate the user is authenticated
  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.error(err.message)
    }))

  if (req.nextUrl.pathname.startsWith('/login') && !verifiedToken) {
    return
  }

  const url = req.url

  if (url.includes('/login') && verifiedToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*', '/login'],
}
