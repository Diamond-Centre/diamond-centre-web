import { NextResponse } from 'next/server'

function isAdminRole(role) {
  return role === 'admin' || role === 'super_admin'
}

function readUser(request) {
  const raw = request.cookies.get('user')?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    try {
      // Some browsers already decode the cookie value
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return null
      return parsed
    } catch {
      return null
    }
  }
}

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const user = readUser(request)
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isClientSpace = pathname.startsWith('/espace-client')
  const isAuthRoute = pathname.startsWith('/auth/')
  const isProtected = isAdminRoute || isDashboardRoute || isClientSpace

  // Logged-in users on /auth → their own space
  if (token && isAuthRoute) {
    if (isAdminRole(user?.role)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (user) {
      return NextResponse.redirect(new URL('/espace-client', request.url))
    }
  }

  // Protected routes require a session
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Token without a readable user cookie → force re-login
  if (isProtected && token && !user) {
    const res = NextResponse.redirect(new URL('/auth/login', request.url))
    res.cookies.set('token', '', { path: '/', maxAge: 0 })
    res.cookies.set('user', '', { path: '/', maxAge: 0 })
    return res
  }

  // Clients cannot open /admin (including by URL)
  if (isAdminRoute && token && user && !isAdminRole(user.role)) {
    return NextResponse.redirect(new URL('/espace-client', request.url))
  }

  // Admins cannot open /espace-client (including by URL)
  if (isClientSpace && token && user && isAdminRole(user.role)) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Legacy /dashboard → role-aware redirects
  if (isDashboardRoute && token && user) {
    if (isAdminRole(user.role)) {
      let target = '/admin'
      if (pathname.startsWith('/dashboard/events')) target = '/admin/events'
      return NextResponse.redirect(new URL(target, request.url))
    }

    let target = '/espace-client'
    if (pathname.startsWith('/dashboard/tickets')) target = '/espace-client/tickets'
    else if (
      pathname.startsWith('/dashboard/certificates') ||
      pathname.startsWith('/dashboard/attestations')
    ) {
      target = '/espace-client/certificats'
    } else if (
      pathname.startsWith('/dashboard/calendar') ||
      pathname.startsWith('/dashboard/agenda')
    ) {
      target = '/espace-client/agenda'
    } else if (pathname.startsWith('/dashboard/profile')) {
      target = '/espace-client/profil'
    }
    return NextResponse.redirect(new URL(target, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/espace-client/:path*', '/auth/:path*'],
}
