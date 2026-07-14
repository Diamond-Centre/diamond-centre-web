/**
<<<<<<< HEAD
 * Barre de navigation principale avec glassmorphisme
=======
 * Barre de navigation principale - Avec affichage du nom utilisateur
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
<<<<<<< HEAD
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
=======
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
<<<<<<< HEAD
=======
  const [isProfileOpen, setIsProfileOpen] = useState(false)
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  return (
<<<<<<< HEAD
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-dark rounded-2xl px-4 md:px-6 py-3 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          {/* Logo avec icône Diamond */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GiDiamondRing className="text-white text-xl" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
=======
    <nav className="fixed top-[28px] left-24 right-24 z-50">
      <div className="glass-dark rounded-3xl px-3 md:px-4 py-2 border border-white/10 shadow-xl w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GiDiamondRing className="text-white text-lg" />
            </div>
            <span className="text-base font-bold text-white hidden sm:block">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
              Diamond Centre
            </span>
          </Link>

          {/* Navigation desktop */}
<<<<<<< HEAD
          <div className="hidden md:flex items-center gap-8">
=======
          <div className="hidden md:flex items-center gap-6">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-dice-blue ${
<<<<<<< HEAD
                  pathname === link.href ? 'text-dice-blue' : 'text-white/80'
=======
                  pathname === link.href ? 'text-dice-blue' : 'text-black'
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

<<<<<<< HEAD
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
=======
          {/* Actions - Bouton Connexion ou Profil utilisateur */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dice-blue/10 hover:bg-dice-blue/20 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.prenom} {user?.nom}
                  </span>
                  <FaChevronDown className={`text-xs text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown profil */}
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Tableau de bord
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Mon profil
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button 
                  variant="primary" 
                  size="small"
                  className="bg-dice-blue hover:bg-dice-blue-dark text-white px-3.5 py-1.5 rounded-full text-xs"
                >
                  <FaUser className="mr-1 text-xs" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
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
<<<<<<< HEAD
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menu mobile déroulant glassmorphisme */}
=======
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
<<<<<<< HEAD
            className="md:hidden mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-3">
=======
            className="md:hidden mt-2 pt-2 border-t border-white/10"
          >
            <div className="flex flex-col gap-2">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-dice-blue ${
<<<<<<< HEAD
                    pathname === link.href ? 'text-dice-blue' : 'text-white/80'
=======
                    pathname === link.href ? 'text-dice-blue' : 'text-black'
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
<<<<<<< HEAD
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="glass" fullWidth>
                        Dashboard
=======
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 bg-dice-blue/5 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {user?.prenom?.[0]}{user?.nom?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="glass" fullWidth>
                        Tableau de bord
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
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
<<<<<<< HEAD
                    <Button variant="glass" fullWidth>
=======
                    <Button variant="primary" fullWidth>
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
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