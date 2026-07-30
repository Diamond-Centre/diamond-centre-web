/**
 * Dashboard Layout - Avec onglet Agenda
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  FaChartBar, FaTicketAlt, FaCertificate, FaUser,
  FaSignOutAlt, FaCalendarAlt
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: FaChartBar },
  { href: '/dashboard/tickets', label: 'Mes tickets', icon: FaTicketAlt },
  { href: '/dashboard/certificates', label: 'Certificats', icon: FaCertificate },
  { href: '/dashboard/calendar', label: 'Agenda', icon: FaCalendarAlt },
  { href: '/dashboard/profile', label: 'Mon profil', icon: FaUser },
]

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated && isMounted) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router, isMounted])

  // Cacher la navbar et le footer globaux
  useEffect(() => {
    const hideGlobalElements = () => {
      const navbar = document.querySelector('nav.fixed')
      const footer = document.querySelector('footer')
      if (navbar) navbar.style.display = 'none'
      if (footer) footer.style.display = 'none'
    }

    const restoreGlobalElements = () => {
      const navbar = document.querySelector('nav.fixed')
      const footer = document.querySelector('footer')
      if (navbar) navbar.style.display = ''
      if (footer) footer.style.display = ''
    }

    hideGlobalElements()
    return restoreGlobalElements
  }, [])

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const displayName = user?.name || 'Utilisateur'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 overflow-y-auto">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              DC
            </div>
            <span className="text-xl font-bold text-gray-800">Diamond Centre</span>
          </Link>
          <p className="text-sm text-gray-500 mt-1">Espace client</p>
        </div>

        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-dice-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Déconnexion"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen p-6">
        {children}
      </main>
    </div>
  )
}