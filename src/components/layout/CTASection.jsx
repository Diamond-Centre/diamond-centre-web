/**
<<<<<<< HEAD
 * Section CTA (Call To Action) avec effet glassmorphisme - Taille harmonisée
=======
 * Section CTA (Call To Action) avec effet glassmorphisme - Uniquement bleu Diamond Centre
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaGem, FaRocket } from 'react-icons/fa'
import Button from '@/components/ui/Button'

export default function CTASection({ 
  title,
  subtitle,
  primaryCta = { text: 'Commencer gratuitement', href: '/auth/register' },
  secondaryCta = { text: 'Explorer nos services', href: '/events' },
<<<<<<< HEAD
  bgClass = 'bg-gradient-to-r from-dice-blue to-purple-600'
}) {
  return (
    <section className="py-16 md:py-20 bg-white">
=======
  bgClass = 'bg-gradient-to-r from-dice-blue to-dice-blue-dark'
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
      <div className="container mx-auto px-4">
        <motion.div 
          className={`max-w-5xl mx-auto ${bgClass} rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white shadow-xl relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Effets de fond */}
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5" />
          <motion.div 
            className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
<<<<<<< HEAD
            className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl"
=======
            className="absolute -bottom-20 -left-20 w-48 h-48 bg-dice-blue/20 rounded-full blur-2xl"
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
          />

          {/* Contenu */}
          <div className="relative z-10">
            {/* Icône décorative */}
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/30 mb-4 md:mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaGem className="text-2xl md:text-3xl" />
            </motion.div>

            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {/* Bouton "Commencer gratuitement" avec hover amélioré */}
              <Link href={primaryCta.href}>
                <motion.button
                  className="group relative px-6 md:px-8 py-3 md:py-4 bg-white rounded-full font-semibold text-base md:text-lg shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
<<<<<<< HEAD
                  {/* Fond animé au survol */}
                  <span className="absolute inset-0 bg-gradient-to-r from-dice-blue to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
=======
                  {/* Fond animé au survol - Bleu Diamond Centre */}
                  <span className="absolute inset-0 bg-gradient-to-r from-dice-blue to-dice-blue-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                  
                  {/* Effet de brillance */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Effet d'onde au survol */}
<<<<<<< HEAD
                  <span className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full bg-white/10" />
=======
                  <span className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full bg-dice-blue/20" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                  
                  {/* Contenu du bouton */}
                  <span className="relative flex items-center gap-2 text-dice-blue group-hover:text-white transition-colors duration-300">
                    <FaRocket className="text-sm md:text-base group-hover:rotate-12 transition-transform duration-300" />
                    {primaryCta.text}
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-sm md:text-base" />
                  </span>
                  
                  {/* Points lumineux décoratifs */}
                  <span className="absolute -top-2 -right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-dice-blue rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
<<<<<<< HEAD
                  <span className="absolute -bottom-2 -left-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 delay-100" />
=======
                  <span className="absolute -bottom-2 -left-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-dice-blue-dark rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 delay-100" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                </motion.button>
              </Link>

              {/* Bouton "Explorer nos services" */}
              <Link href={secondaryCta.href}>
                <motion.button
                  className="group px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-base md:text-lg border border-white/30 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    {secondaryCta.text}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-sm md:text-base" />
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* Badge de confiance */}
            <motion.div 
              className="mt-6 md:mt-8 flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/70 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                +5000 participants
              </span>
              <span className="w-px h-3 md:h-4 bg-white/20 hidden sm:block" />
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Satisfaction 98%
              </span>
              <span className="w-px h-3 md:h-4 bg-white/20 hidden sm:block" />
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Garantie 100%
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}