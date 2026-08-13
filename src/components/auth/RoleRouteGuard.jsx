'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

function isAdminRole(role) {
  return role === 'admin' || role === 'super_admin'
}

function isPublicOrClientSurface(pathname) {
  if (!pathname) return false
  if (pathname === '/') return true
  if (pathname.startsWith('/events')) return true
  if (pathname.startsWith('/about')) return true
  if (pathname.startsWith('/tickets')) return true
  if (pathname.startsWith('/profile')) return true
  if (pathname.startsWith('/espace-client')) return true
  if (pathname.startsWith('/dashboard')) return true
  return false
}

function adminTargetFor(pathname) {
  if (pathname?.startsWith('/tickets')) return '/admin/tickets'
  if (pathname?.startsWith('/events') || pathname?.startsWith('/dashboard/events')) {
    return '/admin/events'
  }
  if (pathname?.startsWith('/profile')) return '/admin/profile'
  return '/admin'
}

/**
 * Client-side backup for middleware: keep admins in /admin and
 * clients out of /admin even when the URL is edited by hand.
 */
export default function RoleRouteGuard() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = auth.getToken()
    const user = auth.getUser()
    if (!token || !user) return

    if (isAdminRole(user.role)) {
      if (pathname?.startsWith('/auth') || isPublicOrClientSurface(pathname)) {
        router.replace(adminTargetFor(pathname))
      }
      return
    }

    if (pathname?.startsWith('/admin')) {
      router.replace('/espace-client')
    }
  }, [pathname, router])

  return null
}
