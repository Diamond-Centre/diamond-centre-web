/**
 * Navbar DiCe — barre flottante distinctive
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowRight,
  FaBars,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.nav
          initial={false}
          animate={{
            y: 0,
            boxShadow: scrolled
              ? '0 18px 40px rgba(11,18,32,0.12)'
              : '0 10px 30px rgba(11,18,32,0.06)',
          }}
          className={`pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 rounded-[22px] border px-3 py-2 transition-[background,border-color] duration-300 sm:gap-4 sm:px-4 ${
            scrolled
              ? 'border-[#E8EEF5]/90 bg-white/95 backdrop-blur-xl'
              : 'border-white/70 bg-white/90 backdrop-blur-md'
          }`}
        >
          {/* Brand — logo officiel DiCe (fond transparent) */}
          <Link
            href="/"
            className="group flex shrink-0 items-center py-0.5"
            aria-label="DiCe — Diamond Centre"
          >
            <Image
              src="/images/logo-dice.png"
              alt="DiCe Diamond Centre — Fulfil your dreams"
              width={220}
              height={101}
              priority
              className="h-10 w-auto object-contain object-left sm:h-11 md:h-12"
            />
          </Link>

          {/* Center links */}
          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <div className="flex items-center gap-0.5 rounded-full border border-[#E8EEF5] bg-[#F4F7FB]/90 p-1">
              {navLinks.map((link) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href ||
                      pathname?.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors lg:px-4 ${
                      active
                        ? 'text-white'
                        : 'text-[#667085] hover:text-[#0B1220]'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-[#0A89F2] shadow-[0_6px_16px_rgba(10,137,242,0.35)]"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={goSpace}
                className="group inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-[#0B1220] transition hover:border-[#0A89F2]/35 hover:bg-[#E8F3FE]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A89F2] text-[11px] font-bold text-white">
                  {String(firstName).charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[7rem] truncate">{spaceLabel}</span>
                <FaArrowRight className="text-[10px] text-[#0A89F2] opacity-0 transition group-hover:opacity-100" />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#0A89F2] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(10,137,242,0.3)] transition hover:bg-[#0770cc]"
              >
                Connexion
                <FaArrowRight className="text-[10px]" />
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8EEF5] bg-white text-[#0B1220] transition hover:border-[#0A89F2]/40 hover:text-[#0A89F2] md:hidden"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </motion.nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[#0B1220]/45 backdrop-blur-sm"
              aria-label="Fermer"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-[4.75rem] overflow-hidden rounded-[24px] border border-[#E8EEF5] bg-white shadow-[0_24px_60px_rgba(11,18,32,0.18)]"
            >
              <div className="border-b border-[#F0F2F5] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A89F2]">
                  Navigation
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Explorez Diamond Centre
                </p>
              </div>

              <div className="flex flex-col p-2">
                {navLinks.map((link, i) => {
                  const active =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname === link.href ||
                        pathname?.startsWith(`${link.href}/`)
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                          active
                            ? 'bg-[#E8F3FE] text-[#0A89F2]'
                            : 'text-[#0B1220] hover:bg-[#F4F7FB]'
                        }`}
                      >
                        {link.label}
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0A89F2]" />
                        ) : (
                          <FaArrowRight className="text-[10px] text-[#CBD5E1]" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="border-t border-[#F0F2F5] p-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      goSpace()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A89F2] px-4 py-3.5 text-sm font-semibold text-white"
                  >
                    <FaUserCircle />
                    {spaceLabel}
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A89F2] px-4 py-3.5 text-sm font-semibold text-white"
                  >
                    Connexion
                    <FaArrowRight className="text-xs" />
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
