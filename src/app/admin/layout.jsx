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
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    const isAdmin =
      storedUser?.role === 'admin' || storedUser?.role === 'super_admin'

    if (!token || !storedUser) {
      router.replace('/auth/login')
      return
    }

    // Clients must never stay on /admin, even if middleware was bypassed
    if (!isAdmin) {
      router.replace('/espace-client')
      return
    }

    setUser(storedUser)
    setIsLoading(false)
  }, [router, pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
            <Image
              src="/images/logo-dice.png"
              alt="Logo Dice"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-gray-900">Administration</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:z-20`}
      >
        <div className="p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2 md:mb-6 mt-2 md:mt-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
              <Image
                src="/images/logo-dice.png"
                alt="Logo Dice"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Diamond Centre</p>
              <p className="text-[11px] text-gray-400">Administration</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5 mt-2">
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
                <item.icon className={`text-lg shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="shrink-0 p-4 border-t border-gray-200 space-y-2 bg-white">
          {user && (
            <Link
              href="/admin/profile"
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                pathname?.startsWith('/admin/profil')
                  ? 'bg-dice-blue/10 text-dice-blue'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-dice-blue/10 text-dice-blue text-xs font-bold flex items-center justify-center shrink-0">
                {(user.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium text-gray-800 truncate">{user.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user.role === 'super_admin' ? 'Super admin' : 'Admin'} · Profil
                </p>
              </div>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-6 pt-20 md:pt-6 md:ml-64 w-full max-w-full">
        {children}
      </main>
    </div>
  )
}
