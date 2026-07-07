'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Button from '../ui/Button'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/events', label: 'Formations' },
    { href: '/about', label: 'À propos' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            🎯 <span className="hidden sm:inline">Dice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <FaUser className="mr-2" />
                    {user?.prenom || 'Profil'}
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/dashboard">
                    <Button variant="secondary" size="sm">Dashboard</Button>
                  </Link>
                )}
                <Button variant="danger" size="sm" onClick={logout}>
                  <FaSignOutAlt />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Connexion</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">Inscription</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" fullWidth>Profil</Button>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="secondary" fullWidth>Dashboard</Button>
                      </Link>
                    )}
                    <Button variant="danger" fullWidth onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}>
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" fullWidth>Connexion</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" fullWidth>Inscription</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}