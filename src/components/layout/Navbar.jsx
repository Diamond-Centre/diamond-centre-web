/**
 * Navbar DiCe — refonte (barre pleine largeur, verre sombre, 80 px)
 * Logique d'authentification inchangée (Connexion / S'inscrire / Mon espace / Admin).
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight, FiMenu, FiSearch, FiX } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const goSpace = () => {
    router.push(isAdmin ? '/admin' : '/espace-client')
  }

  const spaceLabel = isAdmin ? 'Admin' : 'Mon espace'
  const firstName =
    user?.prenom ||
    (user?.name ? String(user.name).split(' ')[0] : null) ||
    'Compte'

  const isActive = (href) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-white/[0.05] bg-[#030816]/80 font-outfit backdrop-blur-xl">
        <nav className="mx-auto flex h-full w-full max-w-[1280px] items-center px-6">
          {/* Logo (fond blanc conservé comme sur la maquette) */}
          <Link
            href="/"
            className="flex h-10 w-[77px] shrink-0 items-center justify-center"
            aria-label="DiCe — Diamond Centre"
          >
            <Image
              src="/images/logo-dice.png"
              alt="DiCe Diamond Centre — Fulfil your dreams"
              width={220}
              height={101}
              priority
              className="h-10 w-[77px] object-contain"
            />
          </Link>

          {/* Liens centraux */}
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-[34px] md:flex md:pr-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex h-10 items-center rounded-full px-[14px] text-[13px] font-medium uppercase tracking-[0.08em] transition-all duration-300 ${isActive(link.href)
                    ? 'bg-[#054fde] text-white shadow-[0_0_26px_rgba(5,79,222,0.55)]'
                    : 'text-[#b6bfd1] hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="ml-auto hidden shrink-0 items-center gap-5 md:ml-0 md:flex">
            <Link
              href="/events"
              aria-label="Rechercher un événement"
              className="text-[16px] text-[#9aa4ba] transition-colors hover:text-white"
            >
              <FiSearch />
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={goSpace}
                className="group inline-flex h-[37px] items-center gap-2 rounded-[4px] bg-[#095eff] pl-1.5 pr-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2a76ff]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-white/20 text-[11px] font-bold">
                  {String(firstName).charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[7rem] truncate">{spaceLabel}</span>
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-[13px] font-medium text-white/90 transition-colors hover:text-white"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-[37px] items-center rounded-[4px] bg-[#095eff] px-5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#2a76ff] hover:shadow-[0_8px_22px_-8px_rgba(9,94,255,0.9)]"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Bouton mobile */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 text-[18px] text-white transition hover:border-white/30 md:hidden"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-40 font-outfit md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[#020817]/70 backdrop-blur-sm"
              aria-label="Fermer"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-[5.25rem] max-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#050d24] shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col p-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] transition ${isActive(link.href)
                          ? 'bg-white/[0.06] text-white'
                          : 'text-[#b6bfd1] hover:bg-white/[0.04] hover:text-white'
                        }`}
                    >
                      {link.label}
                      {isActive(link.href) ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2b6bff]" />
                      ) : (
                        <FiArrowRight className="text-[12px] text-white/25" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/10 p-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      goSpace()
                    }}
                    className="flex h-11 w-full items-center justify-center rounded-md bg-[#095eff] text-[13px] font-semibold text-white"
                  >
                    {spaceLabel}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="flex h-11 items-center justify-center rounded-md border border-white/15 text-[13px] font-medium text-white"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="flex h-11 items-center justify-center rounded-md bg-[#095eff] text-[13px] font-semibold text-white"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}