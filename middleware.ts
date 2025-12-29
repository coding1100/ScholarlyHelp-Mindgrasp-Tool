import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for a tool page
  if (request.nextUrl.pathname.startsWith('/tools/')) {
    // Check for token in cookies (we'll set this after successful login)
    const token = request.cookies.get('access_token')?.value
    
    // If no token, redirect to sign-in
    if (!token) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/tools/:path*'
}