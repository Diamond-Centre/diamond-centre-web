import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const userCookie = request.cookies.get('user')?.value
  const { pathname } = request.nextUrl

  // Routes publiques
  const publicRoutes = ['/', '/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.some(route => pathname === route)
  
  // Route admin
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Route dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard')

  // Si connecté et sur /auth
  if (token && pathname.startsWith('/auth/')) {
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        if (user.role === 'admin' || user.role === 'super_admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch {
        // Ignorer
      }
    }
  }

  // Si non connecté et sur /admin
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Si non connecté et sur /dashboard
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Vérification admin
  if (isAdminRoute && token && userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie))
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*']
}