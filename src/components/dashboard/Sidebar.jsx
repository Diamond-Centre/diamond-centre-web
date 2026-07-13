/**
 * Sidebar de navigation du dashboard - Version responsive
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { FaBars, FaTimes } from 'react-icons/fa'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '🏠' },
  { href: '/dashboard/tickets', label: 'Mes tickets', icon: '🎫' },
  { href: '/dashboard/certifications', label: 'Certifications', icon: '📜' },
  { href: '/dashboard/attestations', label: 'Attestations', icon: '🏆' },
  { href: '/dashboard/agenda', label: 'Agenda', icon: '📅' },
]

export default function Sidebar() {
  const [isClient, setIsClient] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Contenu du sidebar
  const SidebarContent = () => (
    <>
      {/* Profil */}
      <div className="text-center mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center text-2xl md:text-3xl text-white shadow-lg mb-3">
          {user?.prenom?.[0]}{user?.nom?.[0]}
        </div>
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{user?.prenom} {user?.nom}</h3>
        <p className="text-xs md:text-sm text-gray-500 truncate px-2">{user?.email}</p>
        <span className="inline-block mt-1 px-2 py-0.5 bg-dice-blue/10 text-dice-blue text-[10px] md:text-xs rounded-full">
          {user?.role === 'admin' ? 'Administrateur' : 'Membre'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-dice-blue to-dice-blue-dark text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-dice-blue/5 hover:text-dice-blue'
                }`}
              >
                <span className="text-base md:text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200/50 space-y-2">
        <Link href="/profile">
          <div className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-gray-500 hover:bg-dice-blue/5 hover:text-dice-blue transition-colors cursor-pointer">
            <span className="text-base md:text-lg">👤</span>
            <span className="text-sm font-medium">Profil</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-gray-500 hover:bg-dice-blue/5 hover:text-dice-blue transition-colors cursor-pointer">
            <span className="text-base md:text-lg">⚙️</span>
            <span className="text-sm font-medium">Paramètres</span>
          </div>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left"
        >
          <span className="text-base md:text-lg">🚪</span>
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>

      {/* Badge Diamond Centre */}
      <div className="mt-4 md:mt-6 p-2 md:p-3 bg-gradient-to-r from-dice-blue/10 to-purple-500/10 rounded-xl border border-dice-blue/10 text-center">
        <span className="text-xl md:text-2xl block mb-1">💎</span>
        <p className="text-[10px] md:text-xs text-gray-500">Diamond Centre</p>
        <p className="text-[8px] md:text-[10px] text-gray-400">v1.0.0</p>
      </div>
    </>
  )

  // Placeholder pour le chargement
  if (!isClient) {
    return (
      <aside className="glass-card-dice rounded-2xl p-4 md:p-6 w-full md:w-64 h-full sticky top-4 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gray-200 rounded-full animate-pulse mb-3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mx-auto" />
        </div>
        <div className="space-y-2">
          {navItems.map((item) => (
            <div key={item.href} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </aside>
    )
  }

  return (
    <>
      {/* Bouton toggle mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-dice-blue to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Overlay mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:block glass-card-dice rounded-2xl p-6 w-64 h-full sticky top-4 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 h-full w-72 glass-card-dice rounded-r-2xl border border-white/30 shadow-xl backdrop-blur-md bg-white/30 p-6 overflow-y-auto"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-full hover:bg-dice-blue/10 transition-colors"
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx>{`
        .glass-card-dice {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(10, 137, 242, 0.06);
        }
        @media (max-width: 1023px) {
          .glass-card-dice {
            background: rgba(255, 255, 255, 0.9);
          }
        }
      `}</style>
    </>
  )
}