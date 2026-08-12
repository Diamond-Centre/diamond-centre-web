/**
 * Layout Admin - Navigation simplifiée
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import {
  FaHome, FaCalendar, FaTicketAlt, FaUsers, FaCertificate, FaCalendarAlt,
  FaSignOutAlt,
} from 'react-icons/fa'

const menuItems = [
  { href: '/admin', icon: FaHome, label: 'Dashboard' },
  { href: '/admin/agenda', icon: FaCalendarAlt, label: 'Agenda' },
  { href: '/admin/events', icon: FaCalendar, label: 'Événements' },
  { href: '/admin/tickets', icon: FaTicketAlt, label: 'Tickets' },
  { href: '/admin/users', icon: FaUsers, label: 'Utilisateurs' },
  { href: '/admin/certificates', icon: FaCertificate, label: 'Certificats' },
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
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Sidebar fixée avec z-40 pour rester au-dessus du contenu */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between">
        <div className="p-4 overflow-y-auto flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-30 h-30 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <Image
                src="/images/logo-dice.png"
                alt="Logo Dice"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
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
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal avec min-w-0 pour contenir le défilement horizontal */}
      <main className="ml-64 flex-1 p-6 min-w-0">
        {children}
      </main>
    </div>
  )
}