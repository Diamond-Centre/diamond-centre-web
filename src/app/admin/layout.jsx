/**
 * Layout Admin - Protection des routes admin
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import Link from 'next/link'
import { 
  FaSignOutAlt, FaDiamond, FaChartLine, FaCalendar, 
  FaTicketAlt, FaUsers, FaPlus, FaHome
} from 'react-icons/fa'

const menuItems = [
  { href: '/admin', icon: FaChartLine, label: 'Dashboard' },
  { href: '/admin/events', icon: FaCalendar, label: 'Événements' },
  { href: '/admin/events/create', icon: FaPlus, label: 'Créer un événement' },
  { href: '/admin/tickets', icon: FaTicketAlt, label: 'Tickets' },
  { href: '/admin/users', icon: FaUsers, label: 'Utilisateurs' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const token = auth.getToken()
      const currentUser = auth.getUser()
      
      if (!token || !currentUser) {
        router.push('/auth/login')
        return
      }

      // Vérifier si l'utilisateur est admin
      if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
        toast.error('Accès non autorisé')
        router.push('/dashboard')
        return
      }

      // Vérifier la validité du token
      try {
        const isValid = await api.verifyToken(token)
        if (!isValid) {
          auth.logout()
          router.push('/auth/login')
          return
        }
      } catch (error) {
        auth.logout()
        router.push('/auth/login')
        return
      }

      setUser(currentUser)
      setIsLoading(false)
    }

    checkAdmin()
  }, [router])

  const handleLogout = () => {
    auth.logout()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center">
              <FaDiamond className="text-white text-xl" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800">Admin</span>
              <p className="text-xs text-gray-500">{user?.name || 'Admin'}</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-dice-blue/10 text-dice-blue'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`text-lg ${isActive ? 'text-dice-blue' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <Link href="/">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaHome className="text-lg text-gray-400" />
                <span className="font-medium text-sm">Voir le site</span>
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-500">Admin</span>
              <div className="w-8 h-8 bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}