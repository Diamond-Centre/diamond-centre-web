/**
 * Barre de navigation principale avec glassmorphisme
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-dark rounded-2xl px-4 md:px-6 py-3 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          {/* Logo avec icône Diamond */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GiDiamondRing className="text-white text-xl" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              Diamond Centre
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-dice-blue ${
                  pathname === link.href ? 'text-dice-blue' : 'text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="glass" size="small">
                    <FaUser className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="glass" size="small">
                  <FaUser className="mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menu mobile déroulant glassmorphisme */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-dice-blue ${
                    pathname === link.href ? 'text-dice-blue' : 'text-white/80'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="glass" fullWidth>
                        Dashboard
                      </Button>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="text-red-400 text-sm font-medium text-center"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="glass" fullWidth>
                      Connexion
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}