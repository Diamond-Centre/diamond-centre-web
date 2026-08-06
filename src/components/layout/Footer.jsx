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
          // Mouvement réduit pour ne pas faire sortir le texte de l'écran
          { x: -20, opacity: 0.02 },
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

        <div ref={contentRef} className="grid grid-cols-1 gap-10 pb-16 border-b border-white/10 sm:grid-cols-2 lg:grid-cols-12">

          {/* 1. Colonne Marque & Description (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <Link href="/" className="group inline-block">
                <Image
                  src="/images/logo-dice.png"
                  alt="DiCe - Diamond Centre"
                  width={160}
                  height={50}
                  className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60 font-normal">
                Propulser les talents et les organisations vers leur plus haut niveau d’excellence grâce à des programmes d'apprentissage immersifs.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-mono font-semibold uppercase tracking-widest text-white/40">
                Suivez l'aventure
              </p>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 backdrop-blur-md transition-colors duration-300 hover:border-white/30 hover:text-white"
                    >
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                        style={{ backgroundColor: social.color }}
                      />
                      <Icon className="relative z-10 text-base transition-transform duration-300 group-hover:scale-110" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 2. Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0A89F2]">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/70 transition-colors duration-300 hover:text-white"
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

          {/* 3. Programmes (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0A89F2]">
              Nos Programmes
            </h4>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/70 transition-colors duration-300 hover:text-white"
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

          {/* 4. Contact & Localisation (3 cols - Équilibre le coin droit) */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0A89F2]">
              Localisation
            </h4>
            <div className="space-y-3 text-sm text-white/70 font-normal">
              <p className="text-white font-medium">Diamond Centre</p>
              <p>Yaoundé, Cameroun</p>
              <p className="pt-2 text-xs text-white/40">
                Carrefour Emmombo 2ème, dernier étage au dessus de la boulangerie Kelvis.
              </p>
            </div>
          </div>

        </div>

        {/* Pied de page Bottom Bar */}
        <div className="pt-8 flex flex-col items-center justify-between gap-6 text-xs font-medium text-white/40 md:flex-row">

          <p className="flex items-center gap-1">
            <span className="text-2xl font-bold leading-none inline-block translate-y-[2px] text-white/80">©</span> {currentYear} Diamond Centre. Tous droits réservés.
          </p>

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
        className="pointer-events-none absolute -bottom-4 w-full text-center select-none whitespace-nowrap text-[10vw] font-black leading-none tracking-tighter text-white opacity-5"
      >
        DIAMOND CENTRE
      </div>
    </footer>
  )
}