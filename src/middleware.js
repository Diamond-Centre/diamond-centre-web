import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const userCookie = request.cookies.get('user')?.value
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware:', { pathname, token: !!token, userCookie: !!userCookie })

  // Si l'utilisateur est sur la page login et déjà connecté
  if (pathname === '/auth/login' && token && userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie))
      if (user.role === 'admin' || user.role === 'super_admin') {
        console.log('➡️ Redirection admin depuis login')
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // Ignorer
    }
  }

  // Si l'utilisateur essaie d'accéder à /admin sans être admin
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('❌ Pas de token, redirection vers login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        if (user.role !== 'admin' && user.role !== 'super_admin') {
          console.log('❌ Pas admin, redirection vers dashboard')
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        console.log('✅ Admin authentifié')
      } catch {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/dashboard/:path*']
}