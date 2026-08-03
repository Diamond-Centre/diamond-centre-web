import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const userCookie = request.cookies.get('user')?.value
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isClientSpace = pathname.startsWith('/espace-client')

  // Connecté sur /auth → rediriger selon le rôle
  if (token && pathname.startsWith('/auth/')) {
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        if (user.role === 'admin' || user.role === 'super_admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/espace-client', request.url))
      } catch {
        // Ignorer
      }
    }
  }

  if (!token && (isAdminRoute || isDashboardRoute || isClientSpace)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAdminRoute && token && userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie))
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/espace-client', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Ancien /dashboard → espace client (conserve les sous-routes utiles)
  if (isDashboardRoute && token) {
    let target = '/espace-client'
    if (pathname.startsWith('/dashboard/tickets')) target = '/espace-client/tickets'
    else if (pathname.startsWith('/dashboard/certificates') || pathname.startsWith('/dashboard/attestations')) {
      target = '/espace-client/certificats'
    } else if (pathname.startsWith('/dashboard/calendar') || pathname.startsWith('/dashboard/agenda')) {
      target = '/espace-client/agenda'
    } else if (pathname.startsWith('/dashboard/profile')) target = '/espace-client/profil'
    else if (pathname.startsWith('/dashboard/events')) target = '/admin/events'
    return NextResponse.redirect(new URL(target, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/espace-client/:path*', '/auth/:path*'],
}
