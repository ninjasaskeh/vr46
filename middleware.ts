import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const isPublicRoute = nextUrl.pathname === '/sign-in' || 
                       nextUrl.pathname.startsWith('/api/iot') ||
                       nextUrl.pathname === '/'

  // If not logged in and trying to access protected route
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl))
  }

  // If logged in and trying to access sign-in page
  if (isLoggedIn && nextUrl.pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Redirect root to dashboard if logged in
  if (isLoggedIn && nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}