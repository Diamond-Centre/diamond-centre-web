/**
 * Espace client — chrome léger, les pages portent le contenu
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  FaHome,
  FaTicketAlt,
  FaCertificate,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

const tabs = [
  { href: '/espace-client', label: 'Vue d’ensemble', icon: FaHome, exact: true },
  { href: '/espace-client/tickets', label: 'Mes tickets', icon: FaTicketAlt },
  { href: '/espace-client/certificats', label: 'Certificats', icon: FaCertificate },
  { href: '/espace-client/agenda', label: 'Agenda', icon: FaCalendarAlt },
  { href: '/espace-client/profil', label: 'Mon profil', icon: FaUser },
]

export default function EspaceClientLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.replace('/auth/login')
      return
    }
    // Admins must never stay on /espace-client, even via URL
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.replace('/admin')
      return
    }
    setReady(true)
  }, [loading, isAuthenticated, user, router, pathname])

  if (loading || !ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-28">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0A89F2] border-t-transparent" />
      </div>
    )
  }

  const fullBleed =
    pathname === '/espace-client' ||
    pathname === '/espace-client/tickets' ||
    pathname?.startsWith('/espace-client/agenda')

  return (
    <div className="min-h-screen bg-[#F4F7FB] pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 mt-16 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-tight text-[#0B1220]">
              DiCe
            </span>
            <span className="text-sm text-[#98A2B3]">· Mon espace</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm text-[#667085] transition-colors hover:text-red-600"
          >
            <FaSignOutAlt className="text-xs" />
            Déconnexion
          </button>
        </div>

        <nav className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-1 border-b border-[#E8EEF5]">
            {tabs.map((tab) => {
              const active = tab.exact
                ? pathname === tab.href
                : pathname === tab.href || pathname?.startsWith(`${tab.href}/`)
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${active
                    ? 'text-[#0A89F2]'
                    : 'text-[#667085] hover:text-[#0B1220]'
                    }`}
                >
                  <Icon className="text-xs opacity-80" />
                  {tab.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#0A89F2]" />
                  ) : null}
                </Link>
              )
            })}
          </div>
        </nav>

        <div
          className={
            fullBleed
              ? ''
              : 'rounded-[24px] border border-[#E8EEF5] bg-white p-4 shadow-[0_8px_30px_rgba(11,18,32,0.04)] sm:p-6 md:p-8'
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}
