/**
 * Footer DiCe — fond sombre, marque + 2 colonnes de liens
 * (Navigation, Programmes), coordonnées et réseaux sociaux.
 */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6'

const EMAIL = 'thediamondcentre1@gmail.com'
const PHONE_DISPLAY = '688 826 759'
const PHONE_HREF = 'tel:+237688826759'

const SOCIALS = [
  { name: 'Facebook', icon: FaFacebook, url: 'https://www.facebook.com/share/19sTzF1cYi/' },
  { name: 'TikTok', icon: FaTiktok, url: 'http://tiktok.com/@dr.t.g.sonffo' },
  {
    name: 'Instagram',
    icon: FaInstagram,
    url: 'https://www.instagram.com/dr_t.g._sonffo?stkn=MW4waHN2dzRlbG5zbw==',
  },
  {
    name: 'YouTube',
    icon: FaYoutube,
    url: 'https://www.youtube.com/channel/UCH9RgzFwgxeu67pPbuWcZ7w',
  },
]

const COLUMNS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Événements', href: '/events' },
      { label: 'Formations', href: '/events?type=formation' },
      { label: 'À propos', href: '/about' },
    ],
  },
  {
    title: 'Programmes',
    links: [
      { label: 'Leadership', href: '/events' },
      { label: 'Management', href: '/events' },
      { label: 'Entrepreneuriat', href: '/events' },
      { label: 'Communication', href: '/events' },
      { label: 'Finance', href: '/events' },
    ],
  },
]

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[14px] text-white/40 transition-colors duration-200 hover:text-white"
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030816] font-outfit text-white">
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16">
          {/* Marque */}
          <div>
            <Link
              href="/"
              aria-label="DiCe — Diamond Centre"
              className="inline-flex h-11 w-[84px] items-center justify-center"
            >
              <Image
                src="/images/logo-dice.png"
                alt="DiCe Diamond Centre"
                width={220}
                height={101}
                className="h-11 w-[84px] object-contain"
              />
            </Link>

            <p className="mt-[34px] max-w-[270px] text-[14px] leading-6 text-[#6b7488]">
              Un écosystème d&apos;opportunités pour révéler votre plein potentiel. Formations,
              conférences et ateliers pour les leaders d&apos;Afrique et du monde.
            </p>

            <ul className="mt-6 max-w-[320px] space-y-3 text-[13px] leading-5 text-white/85">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-[3px] shrink-0 text-[14px] text-[#9aa4ba]" />
                <span>Yaoundé, Carrefour Emombo dernier étage immeuble Boulangerie Kelvis</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="mt-[3px] shrink-0 text-[14px] text-[#9aa4ba]" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="mt-[3px] shrink-0 text-[14px] text-[#9aa4ba]" />
                <a href={PHONE_HREF} className="transition-colors hover:text-white">
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ name, icon: Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[15px] text-[#8b93a5] transition-all duration-200 hover:border-[#2b6bff]/60 hover:bg-[#2b6bff]/10 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-barlow text-[13px] font-bold uppercase tracking-[0.2em] text-white">
                {col.title}
              </h4>
              <ul className="mt-[22px] space-y-[14px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bas de page */}
        <div className="mt-[62px] border-t border-white/[0.07] pb-12 pt-8">
          <p className="text-[12.5px] text-[#4c566c]">
            © {new Date().getFullYear()} Diamond Centre — DiCe. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
