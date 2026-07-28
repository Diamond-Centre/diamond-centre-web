/**
 * Layout Admin - Navigation simplifiée
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { 
  FaHome, FaCalendar, FaTicketAlt,
  FaSignOutAlt, FaGem
} from 'react-icons/fa'

const menuItems = [
  { href: '/admin', icon: FaHome, label: 'Dashboard' },
  { href: '/admin/events', icon: FaCalendar, label: 'Événements' },
  { href: '/admin/tickets', icon: FaTicketAlt, label: 'Tickets' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (!token || !storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    
    setUser(storedUser)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    auth.logout()
    window.location.href = '/auth/login'
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
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center">
              <FaGem className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold text-gray-800">DC Admin</span>
          </div>
          
          {/* Menu - Uniquement Dashboard, Événements, Tickets */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                               (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-dice-blue text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`text-lg ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Footer avec déconnexion */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="ml-64 flex-1 p-6">
        {children}
      </main>
    </div>
  )
}