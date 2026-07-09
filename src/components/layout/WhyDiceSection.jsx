/**
 * Section "Pourquoi Dice" avec sponsors officiels
 */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaArrowRight, FaUsers, FaVideo, FaHeadset } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Valeurs
const values = [
  {
    icon: GiDiamondRing,
    title: 'Excellence',
    description: 'Des formations de qualité dispensées par des experts reconnus',
    color: 'from-dice-blue to-blue-600'
  },
  {
    icon: FaUsers,
    title: 'Communauté',
    description: 'Rejoignez une communauté de professionnels passionnés',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: FaVideo,
    title: 'Flexibilité',
    description: 'Formations en présentiel et à distance selon vos besoins',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: FaHeadset,
    title: 'Accompagnement',
    description: 'Un suivi personnalisé tout au long de votre parcours',
    color: 'from-orange-500 to-red-500'
  }
]

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

export default function WhyDiceSection() {
  return (
    <section className="py-20 bg-white">
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

          {/* Colonne droite - Grille de valeurs */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${index === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <Card 
                  variant="hover" 
                  className={`h-full p-6 border border-gray-100 ${index === 0 ? 'bg-gradient-to-br from-dice-blue/5 to-purple-500/5' : ''}`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <value.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
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
    </section>
  )
}