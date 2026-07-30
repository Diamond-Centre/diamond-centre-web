/**
 * Barre de navigation principale - Version simplifiée avec auth
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaUser, FaCog } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import { useAuth } from '@/hooks/useAuth'  // Vérifier l'import
import Button from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()  // S'assurer que useAuth est bien défini
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleDashboardClick = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  return (
    <nav className="fixed top-[28px] left-24 right-24 z-50">
      <div className="glass-dark rounded-3xl px-3 md:px-4 py-2 border border-white/10 shadow-xl w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GiDiamondRing className="text-white text-lg" />
            </div>
            <span className="text-base font-bold text-white hidden sm:block">
              Diamond Centre
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-dice-blue ${
                  pathname === link.href ? 'text-dice-blue' : 'text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleDashboardClick}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-dice-blue text-white hover:bg-dice-blue-dark transition-colors text-sm font-medium"
              >
                <FaCog className="text-xs" />
                {isAdmin ? 'Dashboard Admin' : 'Dashboard'}
              </button>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="primary"
                  size="small"
                  className="bg-dice-blue hover:bg-dice-blue-dark text-white px-3.5 py-1.5 rounded-full text-xs"
                >
                  <FaUser className="mr-1 text-xs" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 pt-2 border-t border-white/10"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-dice-blue ${
                      pathname === link.href ? 'text-dice-blue' : 'text-black'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleDashboardClick()
                      }}
                      className="w-full px-4 py-2 bg-dice-blue text-white rounded-lg text-sm font-medium hover:bg-dice-blue-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCog className="text-xs" />
                      {isAdmin ? 'Dashboard Admin' : 'Dashboard'}
                    </button>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" fullWidth>
                        Connexion
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}