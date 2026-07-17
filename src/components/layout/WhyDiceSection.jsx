/**
<<<<<<< HEAD
<<<<<<< HEAD
 * Section "Pourquoi Dice" avec sponsors officiels
=======
 * Section "Pourquoi Dice" avec glassmorphisme bleu Diamond Centre
 * et effet aquarium au survol
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
 * Section "Pourquoi Dice" avec glassmorphisme bleu Diamond Centre
 * et effet aquarium au survol
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
 */
'use client'

import Link from 'next/link'
<<<<<<< HEAD
<<<<<<< HEAD
import Image from 'next/image'
=======
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
import { motion } from 'framer-motion'
import { FaArrowRight, FaUsers, FaVideo, FaHeadset } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Valeurs
<<<<<<< HEAD
<<<<<<< HEAD
const values = [
  {
=======
const values = {
  excellence: {
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
const values = {
  excellence: {
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    icon: GiDiamondRing,
    title: 'Excellence',
    description: 'Des formations de qualité dispensées par des experts reconnus',
    color: 'from-dice-blue to-blue-600'
  },
<<<<<<< HEAD
<<<<<<< HEAD
  {
=======
  communaute: {
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
  communaute: {
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    icon: FaUsers,
    title: 'Communauté',
    description: 'Rejoignez une communauté de professionnels passionnés',
    color: 'from-purple-500 to-pink-500'
  },
<<<<<<< HEAD
<<<<<<< HEAD
  {
=======
  flexibilite: {
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
  flexibilite: {
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    icon: FaVideo,
    title: 'Flexibilité',
    description: 'Formations en présentiel et à distance selon vos besoins',
    color: 'from-green-500 to-emerald-500'
  },
<<<<<<< HEAD
<<<<<<< HEAD
  {
=======
  accompagnement: {
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
  accompagnement: {
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    icon: FaHeadset,
    title: 'Accompagnement',
    description: 'Un suivi personnalisé tout au long de votre parcours',
    color: 'from-orange-500 to-red-500'
  }
<<<<<<< HEAD
<<<<<<< HEAD
]
=======
}
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
}
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)

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
<<<<<<< HEAD
<<<<<<< HEAD
    <section className="py-20 bg-white">
=======
    <section className="py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
    <section className="py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
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

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
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
              <div className="glass-card-dice rounded-2xl p-6 border border-dice-blue/20 shadow-xl backdrop-blur-md bg-dice-blue/10 hover:bg-dice-blue/15 transition-all duration-300 h-full relative overflow-hidden group">
                {/* Effet aquarium au survol */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/30 via-transparent to-cyan-400/20 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl animate-pulse" />
                </div>
                
                {/* Reflet lumineux */}
                <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-40">
                  <div className="absolute inset-0 bg-gradient-to-b from-dice-blue/10 to-transparent rounded-t-2xl" />
                </div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.communaute.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.communaute.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {values.communaute.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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
              <div className="glass-card-dice rounded-2xl p-6 border border-dice-blue/20 shadow-xl backdrop-blur-md bg-dice-blue/10 hover:bg-dice-blue/15 transition-all duration-300 h-full relative overflow-hidden group">
                {/* Effet aquarium au survol */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/30 via-transparent to-cyan-400/20 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl animate-pulse" />
                </div>
                
                {/* Reflet lumineux */}
                <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-40">
                  <div className="absolute inset-0 bg-gradient-to-b from-dice-blue/10 to-transparent rounded-t-2xl" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.excellence.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.excellence.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {values.excellence.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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
              <div className="glass-card-dice rounded-2xl p-6 border border-dice-blue/20 shadow-xl backdrop-blur-md bg-dice-blue/10 hover:bg-dice-blue/15 transition-all duration-300 h-full relative overflow-hidden group">
                {/* Effet aquarium au survol */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/30 via-transparent to-cyan-400/20 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl animate-pulse" />
                </div>
                
                {/* Reflet lumineux */}
                <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-40">
                  <div className="absolute inset-0 bg-gradient-to-b from-dice-blue/10 to-transparent rounded-t-2xl" />
                </div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.flexibilite.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.flexibilite.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {values.flexibilite.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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
              <div className="glass-card-dice rounded-2xl p-6 border border-dice-blue/20 shadow-xl backdrop-blur-md bg-dice-blue/10 hover:bg-dice-blue/15 transition-all duration-300 h-full relative overflow-hidden group">
                {/* Effet aquarium au survol */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/30 via-transparent to-cyan-400/20 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl animate-pulse" />
                </div>
                
                {/* Reflet lumineux */}
                <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-40">
                  <div className="absolute inset-0 bg-gradient-to-b from-dice-blue/10 to-transparent rounded-t-2xl" />
                </div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${values.accompagnement.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <values.accompagnement.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {values.accompagnement.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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
<<<<<<< HEAD
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)

      {/* Styles globaux pour le glassmorphisme bleu Diamond Centre et effet aquarium */}
      <style jsx global>{`
        .glass-card-dice {
          background: rgba(10, 137, 242, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(10, 137, 242, 0.15);
          box-shadow: 
            0 8px 32px rgba(10, 137, 242, 0.06),
            inset 0 1px 0 rgba(10, 137, 242, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card-dice:hover {
          background: rgba(10, 137, 242, 0.15);
          box-shadow: 
            0 12px 48px rgba(10, 137, 242, 0.15),
            inset 0 1px 0 rgba(10, 137, 242, 0.2),
            0 0 60px rgba(10, 137, 242, 0.05);
          transform: translateY(-4px);
        }

        /* Reflet supérieur */
        .glass-card-dice::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            to bottom,
            rgba(10, 137, 242, 0.08),
            transparent
          );
          pointer-events: none;
          border-radius: 16px 16px 0 0;
          opacity: 0.5;
          transition: opacity 0.4s ease;
        }

        .glass-card-dice:hover::before {
          opacity: 0.8;
        }

        /* Effet aquarium - vagues lumineuses */
        .glass-card-dice .aquarium-effect {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.7s ease;
          background: 
            radial-gradient(circle at 20% 30%, rgba(10, 137, 242, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
          animation: aquariumPulse 4s ease-in-out infinite;
        }

        .glass-card-dice:hover .aquarium-effect {
          opacity: 1;
        }

        /* Animation aquarium */
        @keyframes aquariumPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        /* Effet de brillance mobile */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(25deg);
          }
          100% {
            transform: translateX(200%) rotate(25deg);
          }
        }

        .glass-card-dice::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            transparent 40%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 60%
          );
          transform: rotate(25deg) translateX(-100%);
          transition: transform 0.8s ease;
          pointer-events: none;
        }

        .glass-card-dice:hover::after {
          transform: rotate(25deg) translateX(100%);
        }
      `}</style>
<<<<<<< HEAD
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
=======
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    </section>
  )
}