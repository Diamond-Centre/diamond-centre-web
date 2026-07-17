/**
 * Barre de navigation principale - Avec affichage du nom utilisateur
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const profileRef = useRef(null)

  // Fermer le menu profil au changement de page
  useEffect(() => {
    setIsProfileOpen(false)
    setIsOpen(false)
  }, [pathname])

  // Fermer au clic extérieur ou touche Escape
  useEffect(() => {
    if (!isProfileOpen) return

    const handlePointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen])

  const closeProfileMenu = () => setIsProfileOpen(false)

  const toggleProfileMenu = (event) => {
    event.stopPropagation()
    setIsProfileOpen((open) => !open)
  }

  const displayName = [user?.prenom, user?.nom].filter(Boolean).join(' ') || user?.name || 'Utilisateur'
  const initials =
    `${user?.prenom?.[0] || user?.name?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase() || 'U'

  return (
    <nav className="fixed top-[28px] left-24 right-24 z-50">
      <div className="glass-dark rounded-3xl px-3 md:px-4 py-2 border border-white/10 shadow-xl w-full">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GiDiamondRing className="text-white text-lg" />
            </div>
            <span className="text-base font-bold text-white hidden sm:block">
              Diamond Centre
            </span>
          </Link>

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

          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dice-blue/10 hover:bg-dice-blue/20 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[140px] truncate">
                    {displayName}
                  </span>
                  <FaChevronDown
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[60]"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        onClick={closeProfileMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Tableau de bord
                      </Link>
                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={closeProfileMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Mon profil
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          closeProfileMenu()
                          logout()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

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
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 bg-dice-blue/5 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="glass" fullWidth>
                          Tableau de bord
                        </Button>
                      </Link>
                      <button
                        type="button"
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
