/**
 * Section "Pourquoi Dice" avec glassmorphisme bleu Diamond Centre
 * et effet hover "carte projet" (fond plein + bouton flèche) au survol
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaArrowUp, FaUsers, FaVideo, FaHeadset } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Valeurs
const values = {
  excellence: {
    icon: GiDiamondRing,
    title: 'Excellence',
    description: 'Des formations de qualité dispensées par des experts reconnus',
    color: 'from-dice-blue to-blue-600'
  },
  communaute: {
    icon: FaUsers,
    title: 'Communauté',
    description: 'Rejoignez une communauté de professionnels passionnés',
    color: 'from-purple-500 to-pink-500'
  },
  flexibilite: {
    icon: FaVideo,
    title: 'Flexibilité',
    description: 'Formations en présentiel et à distance selon vos besoins',
    color: 'from-green-500 to-emerald-500'
  },
  accompagnement: {
    icon: FaHeadset,
    title: 'Accompagnement',
    description: 'Un suivi personnalisé tout au long de votre parcours',
    color: 'from-orange-500 to-red-500'
  }
}

// Sponsors officiels avec logos
const sponsors = [
  {
    name: 'Orange',
    logo: '/images/sponsors/orange-logo.png',
    color: '#FF7900',
    website: 'https://www.orange.com'
  },
  {
    name: 'MTN',
    logo: '/images/sponsors/mtn-logo.png',
    color: '#FFCD00',
    website: 'https://www.mtn.com'
  },
  {
    name: 'Ecobank',
    logo: '/images/sponsors/ecobank-logo.png',
    color: '#006633',
    website: 'https://www.ecobank.com'
  },
  {
    name: 'Afriland',
    logo: '/images/sponsors/afriland-logo.png',
    color: '#003399',
    website: 'https://www.afriland.com'
  }
]

// Statistiques
const stats = [
  { label: 'Participants', value: '5 000+' },
  { label: 'Formations', value: '50+' },
  { label: 'Satisfaction', value: '98%' },
  { label: 'Experts', value: '20+' }
]

// Petit composant réutilisable pour le bouton flèche qui apparaît au hover
function HoverArrowButton() {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out">
        <FaArrowUp className="rotate-45 text-[#0a89f2] text-base" />
      </div>
    </div>
  )
}

export default function WhyDiceSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche - Texte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-dice-blue font-semibold uppercase tracking-wider text-sm mb-4">
              Pourquoi Diamond Centre
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              L'excellence à <br />
              <span className="gradient-text">chaque étape</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Nous nous engageons à vous offrir une expérience d'apprentissage unique 
              et transformatrice.
            </p>
            
            <Link href="/about">
              <Button variant="outline" size="large">
                En savoir plus
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>

            {/* Sponsors officiels */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Nos sponsors officiels</p>
              <div className="flex flex-wrap gap-6 items-center">
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div className="w-20 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-dice-blue transition-all duration-300 group-hover:shadow-lg">
                      <span 
                        className="text-sm font-bold transition-colors duration-300 group-hover:text-dice-blue"
                        style={{ color: sponsor.color }}
                      >
                        {sponsor.name}
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                        {sponsor.name}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Colonne droite - Grille de valeurs avec glassmorphisme */}
          <div className="relative grid grid-cols-2 grid-rows-[auto_auto_auto] gap-4">

            {/* Communauté - haut gauche */}
            <motion.div
              className="col-start-1 row-start-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass-card-dice rounded-2xl p-6 shadow-xl h-full relative overflow-hidden group">
                <HoverArrowButton />

                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.communaute.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.communaute.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-white mb-2 transition-colors duration-300">
                    {values.communaute.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 text-sm transition-colors duration-300">
                    {values.communaute.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Excellence - colonne droite, pleine hauteur */}
            <motion.div
              className="col-start-2 row-start-1 row-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card-dice rounded-2xl p-6 shadow-xl h-full relative overflow-hidden group">
                <HoverArrowButton />

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.excellence.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.excellence.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-white mb-2 transition-colors duration-300">
                    {values.excellence.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 text-sm transition-colors duration-300">
                    {values.excellence.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Flexibilité - bas gauche */}
            <motion.div
              className="col-start-1 row-start-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card-dice rounded-2xl p-6 shadow-xl h-full relative overflow-hidden group">
                <HoverArrowButton />

                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.flexibilite.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.flexibilite.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-white mb-2 transition-colors duration-300">
                    {values.flexibilite.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 text-sm transition-colors duration-300">
                    {values.flexibilite.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Accompagnement - bande pleine largeur en bas */}
            <motion.div
              className="col-span-2 row-start-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="glass-card-dice rounded-2xl p-6 shadow-xl h-full relative overflow-hidden group">
                <HoverArrowButton />

                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.accompagnement.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.accompagnement.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-white mb-2 transition-colors duration-300">
                    {values.accompagnement.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 text-sm transition-colors duration-300">
                    {values.accompagnement.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Logo Diamond Centre */}
            <motion.div
              className="absolute left-[-30px] top-[30%] -translate-y-1/2 z-20"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-2xl flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-dice-blue to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <GiDiamondRing className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Statistiques avec animation */}
        <motion.div 
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center relative"
            >
              <div className="text-3xl md:text-4xl font-bold text-dice-blue">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-300" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Styles globaux : glassmorphisme + hover "carte projet" plein bleu #0a89f2 */}
      <style jsx global>{`
        .glass-card-dice {
          background: rgba(10, 137, 242, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(10, 137, 242, 0.15);
          box-shadow: 
            0 8px 32px rgba(10, 137, 242, 0.06),
            inset 0 1px 0 rgba(10, 137, 242, 0.1);
          transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Au survol : le fond devient un bleu plein #0a89f2, comme la carte de référence */
        .glass-card-dice:hover {
          background: #0a89f2;
          border-color: #0a89f2;
          box-shadow: 
            0 16px 40px rgba(10, 137, 242, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-6px);
        }
      `}</style>
    </section>
  )
}