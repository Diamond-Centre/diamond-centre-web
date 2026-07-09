/**
 * Pied de page avec réseaux sociaux aux couleurs officielles
 */
'use client'

import Link from 'next/link'
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaTiktok
} from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'

// Couleurs officielles des réseaux sociaux
const socialColors = {
  facebook: '#1877F2',
  twitter: '#000000',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000'
}

const socialLinks = [
  { 
    name: 'Facebook', 
    icon: FaFacebook, 
    url: '#', 
    color: socialColors.facebook,
    bgHover: 'hover:bg-[#1877F2]'
  },
  { 
    name: 'Twitter', 
    icon: FaTwitter, 
    url: '#', 
    color: socialColors.twitter,
    bgHover: 'hover:bg-[#000000]'
  },
  { 
    name: 'Instagram', 
    icon: FaInstagram, 
    url: '#', 
    color: socialColors.instagram,
    bgHover: 'hover:bg-[#E4405F]'
  },
  { 
    name: 'LinkedIn', 
    icon: FaLinkedin, 
    url: '#', 
    color: socialColors.linkedin,
    bgHover: 'hover:bg-[#0A66C2]'
  },
  { 
    name: 'YouTube', 
    icon: FaYoutube, 
    url: '#', 
    color: socialColors.youtube,
    bgHover: 'hover:bg-[#FF0000]'
  },
  { 
    name: 'TikTok', 
    icon: FaTiktok, 
    url: '#', 
    color: socialColors.tiktok,
    bgHover: 'hover:bg-[#000000]'
  }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 - Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center">
                <GiDiamondRing className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold">Diamond Centre</span>
            </div>
            <p className="text-gray-400 text-sm">
              L'excellence au service de votre développement personnel et professionnel.
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-dice-blue transition-colors">Accueil</Link></li>
              <li><Link href="/events" className="hover:text-dice-blue transition-colors">Événements</Link></li>
              <li><Link href="/about" className="hover:text-dice-blue transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-dice-blue transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h4 className="font-semibold mb-4">Nos services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/events?service=Conférence%20de%20Motivation" className="hover:text-dice-blue transition-colors">Conférences</Link></li>
              <li><Link href="/events?service=Séminaire%20ÉTUPRENEUR" className="hover:text-dice-blue transition-colors">Séminaires</Link></li>
              <li><Link href="/events?service=Programme%20TRANSFORM-ACTION" className="hover:text-dice-blue transition-colors">Formations</Link></li>
              <li><Link href="/events?service=Le%20Jeune%20Orateur" className="hover:text-dice-blue transition-colors">Ateliers</Link></li>
            </ul>
          </div>

          {/* Colonne 4 - Réseaux sociaux avec couleurs officielles */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    aria-label={social.name}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white/10 hover:shadow-lg ${social.bgHover}`}
                    >
                      <Icon 
                        className="text-lg transition-all duration-300 group-hover:text-white group-hover:scale-110"
                        style={{ color: social.color }}
                      />
                    </div>
                    {/* Tooltip au survol */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {social.name}
                    </span>
                  </a>
                )
              })}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              © {currentYear} Diamond Centre. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}