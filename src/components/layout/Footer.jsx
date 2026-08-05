/**
 * Pied de page DiCe — Intégration Logo Officiel & Design Éditorial
 */
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaArrowUp,
  FaArrowRight,
} from 'react-icons/fa6'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const socialLinks = [
  { name: 'Facebook', icon: FaFacebookF, url: 'https://facebook.com', color: '#1877F2' },
  { name: 'X / Twitter', icon: FaXTwitter, url: 'https://x.com', color: '#FFFFFF' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com', color: '#E4405F' },
  { name: 'LinkedIn', icon: FaLinkedinIn, url: 'https://linkedin.com', color: '#0A66C2' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com', color: '#FF0000' },
  { name: 'TikTok', icon: FaTiktok, url: 'https://tiktok.com', color: '#00F2FE' },
]

const quickLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

const serviceLinks = [
  { href: '/events?type=conference', label: 'Conférences' },
  { href: '/events?type=seminar', label: 'Séminaires' },
  { href: '/events?type=formation', label: 'Formations' },
  { href: '/events?type=workshop', label: 'Ateliers' },
]

export default function Footer() {
  const footerRef = useRef(null)
  const watermarkRef = useRef(null)
  const contentRef = useRef(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const ctx = gsap.context(() => {

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
            },
          }
        )
      }


      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { x: -60, opacity: 0.02 },
          {
            x: 20,
            opacity: 0.06,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        )
      }
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#03070C] pt-24 pb-12 text-white border-t border-white/10"
    >
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#0A89F2]/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#0057C2]/15 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mb-20 grid grid-cols-1 gap-8 items-center border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
              Restez informé
            </span>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ne manquez aucun événement DiCe
            </h3>
            <p className="mt-3 text-base text-white/60 max-w-md">
              Inscrivez-vous pour recevoir les prochaines dates de formations, séminaires et masterclasses.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input
                type="email"
                placeholder="Votre adresse email..."
                className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-5 text-sm text-white placeholder-white/40 backdrop-blur-xl transition-all duration-300 focus:border-[#0A89F2] focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#0A89F2]"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="absolute right-2 top-2 bottom-2 inline-flex items-center gap-2 rounded-xl bg-[#0A89F2] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0877d4]"
              >
                <span>S'inscrire</span>
                <FaArrowRight className="text-xs" />
              </motion.button>
            </form>
          </div>
        </div>

        <div ref={contentRef} className="grid grid-cols-1 gap-12 pb-16 border-b border-white/10 md:grid-cols-2 lg:grid-cols-12">

          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="group inline-block">
                <Image
                  src="/images/logo-dice.png"
                  alt="DiCe - Diamond Centre"
                  width={160}
                  height={50}
                  className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                />
              </Link>

              <p className="mt-6 max-w-sm text-base leading-relaxed text-white/60 font-normal">
                Propulser les talents et les organisations vers leur plus haut niveau d’excellence grâce à des programmes d'apprentissage immersifs et inspirants.
              </p>
            </div>
            <div className="mt-8">
              <p className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-white/40">
                Suivez l'aventure
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      whileHover={{ y: -4, scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 backdrop-blur-md transition-colors duration-300 hover:border-white/30 hover:text-white"
                    >
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                        style={{ backgroundColor: social.color }}
                      />
                      <Icon className="relative z-10 text-lg transition-transform duration-300 group-hover:scale-110" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Navigation Liens Rapides */}
          <div className="lg:col-span-3">
            <h4 className="mb-6 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0A89F2]">
              Navigation
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-base font-medium text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0A89F2] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Programmes */}
          <div className="lg:col-span-4">
            <h4 className="mb-6 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0A89F2]">
              Nos Programmes
            </h4>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-base font-medium text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0A89F2] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Pied de page Bottom Bar */}
        <div className="pt-8 flex flex-col items-center justify-between gap-6 text-xs font-medium text-white/40 md:flex-row">

          <div className="flex items-center gap-3">
            <span className="text-white/60">Yaoundé, Cameroun</span>
          </div>

          <p>© {currentYear} Diamond Centre (DiCe). Tous droits réservés.</p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-white/80 transition-colors duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <span>Retour en haut</span>
            <FaArrowUp className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>

        </div>

      </div>

      <div
        ref={watermarkRef}
        className="pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap text-[13vw] font-black leading-none tracking-tighter text-white opacity-5"
      >
        DIAMOND CENTRE
      </div>
    </footer>
  )
}