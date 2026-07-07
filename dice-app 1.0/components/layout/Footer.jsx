'use client'

import Link from 'next/link'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">🎯 Dice</h3>
            <p className="text-sm text-gray-400 mb-4">
              Formations professionnelles, séminaires, conférences et ateliers pour votre développement.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-white transition-colors">Formations</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Mon compte</Link></li>
              <li><Link href="/profile/tickets" className="hover:text-white transition-colors">Mes tickets</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <a href="mailto:contact@dice.com" className="hover:text-white transition-colors">
                  contact@dice.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-400" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">
              Recevez les dernières actualités sur nos formations.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} Dice. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}