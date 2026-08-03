/**
 * Layout legacy /dashboard — redirige tout le sous-arbre client vers /espace-client.
 */
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/auth'

const mapPath = (pathname) => {
  if (!pathname) return '/espace-client'
  if (pathname.startsWith('/dashboard/tickets')) return '/espace-client/tickets'
  if (pathname.startsWith('/dashboard/certificates')) return '/espace-client/certificats'
  if (pathname.startsWith('/dashboard/attestations')) return '/espace-client/certificats'
  if (pathname.startsWith('/dashboard/calendar') || pathname.startsWith('/dashboard/agenda')) {
    return '/espace-client/agenda'
  }
  if (pathname.startsWith('/dashboard/profile')) return '/espace-client/profil'
  // Ancien CRUD événements sous dashboard = réservé admin
  if (pathname.startsWith('/dashboard/events')) return '/admin/events'
  return '/espace-client'
}

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = auth.getToken()
    const user = auth.getUser()

    if (!token || !user) {
      router.replace('/auth/login')
      return
    }

    if (user.role === 'admin' || user.role === 'super_admin') {
      router.replace('/admin')
      return
    }

    router.replace(mapPath(pathname))
  }, [router, pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
      {/* children unused — always redirect */}
      <span className="sr-only">{children ? 'redirect' : ''}</span>
    </div>
  )
}
