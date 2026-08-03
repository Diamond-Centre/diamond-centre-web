/**
 * Pied de page DiCe
 */
'use client'

import Link from 'next/link'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

const socialLinks = [
  { name: 'Facebook', icon: FaFacebook, url: 'https://facebook.com', color: '#1877F2' },
  { name: 'Twitter', icon: FaTwitter, url: 'https://x.com', color: '#000000' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com', color: '#E4405F' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com', color: '#0A66C2' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com', color: '#FF0000' },
  { name: 'TikTok', icon: FaTiktok, url: 'https://tiktok.com', color: '#000000' },
]

const quickLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/events', label: 'Événements' },
  { href: '/about', label: 'À propos' },
]

const serviceLinks = [
  { href: '/events', label: 'Conférences' },
  { href: '/events', label: 'Séminaires' },
  { href: '/events', label: 'Formations' },
  { href: '/events', label: 'Ateliers' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#E8EEF5] bg-[#0B1220] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center">
                <span className="absolute inset-0 rotate-45 rounded-[10px] bg-gradient-to-br from-[#0A89F2] to-[#0057C2]" />
                <span className="relative text-[11px] font-black text-white">
                  DC
                </span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-base font-extrabold tracking-tight">
                  DiCe
                </span>
                <span className="text-[10px] font-medium tracking-[0.14em] text-white/50">
                  DIAMOND CENTRE
                </span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              L’excellence au service de votre développement personnel et
              professionnel.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Liens rapides
            </h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#0A89F2]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Nos services
            </h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#0A89F2]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Suivez-nous</h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
                  >
                    <Icon className="text-lg" style={{ color: social.color }} />
                  </a>
                )
              })}
            </div>
            <p className="mt-5 text-sm text-white/40">
              © {currentYear} Diamond Centre. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
