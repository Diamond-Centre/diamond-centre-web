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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — flex column so footer never covers menu links */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 flex flex-col z-20">
        <div className="p-4 shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
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
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
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

      <main className="ml-64 flex-1 p-6 min-w-0">
        {children}
      </main>
    </div>
  )
}
