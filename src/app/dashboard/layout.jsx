'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  FaChartBar, FaCalendar, FaUsers, FaPlus, 
  FaSignOutAlt, FaHome, FaTicketAlt
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: FaChartBar },
  { href: '/dashboard/events', label: 'Événements', icon: FaCalendar },
  { href: '/dashboard/events/new', label: 'Nouvel événement', icon: FaPlus },
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

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 overflow-y-auto">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-dice-blue">Diamond Centre</span>
          </Link>
          <p className="text-sm text-gray-500 mt-1">Administration</p>
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-dice-blue/10 flex items-center justify-center">
              <span className="text-dice-blue font-bold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@diamondcentre.com'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}