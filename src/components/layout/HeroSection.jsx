/**
<<<<<<< HEAD
 * Section Hero avec glassmorphisme
=======
 * Section Hero - Informations textuelles descendues en bas
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
<<<<<<< HEAD
import { FaArrowRight, FaPlay, FaChevronRight } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Container from '@/components/ui/Container'
=======
import { FaArrowRight, FaPlay } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
import Button from '@/components/ui/Button'
import Stats from '@/components/ui/Stats'
import Carousel from '@/components/ui/Carousel'

export default function HeroSection({ 
  title,
  subtitle,
  badge,
  stats,
  carouselImages,
  onVideoClick,
  primaryCta = { text: 'Explorer les formations', href: '/events' },
}) {
  return (
<<<<<<< HEAD
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
      {/* Background décoratif */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dice-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch min-h-[80vh]">
          {/* Bloc gauche - Glassmorphisme */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-white rounded-3xl p-8 md:p-12 flex flex-col justify-center border border-white/30 shadow-xl"
          >
            {/* Badge */}
            {badge && (
              <motion.div 
                className="inline-flex items-center gap-2 bg-dice-blue/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 w-fit border border-dice-blue/20"
                whileHover={{ scale: 1.02 }}
              >
                <GiDiamondRing className="text-dice-blue text-sm" />
                <span className="text-sm font-medium text-dice-blue">{badge}</span>
              </motion.div>
            )}

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {subtitle && (
              <motion.p 
                className="text-lg text-gray-600 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* CTA */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href={primaryCta.href}>
                <Button 
                  variant="primary" 
                  size="large"
                  className="group"
                >
                  {primaryCta.text}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            {stats && <Stats stats={stats} className="mt-8 pt-8 border-t border-gray-200" variant="dark" />}
          </motion.div>

          {/* Bloc droite - Carousel avec glassmorphisme */}
          <motion.div 
            className="relative h-full min-h-[400px] lg:min-h-[500px]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-dark rounded-3xl overflow-hidden h-full border border-white/10 shadow-xl">
              <Carousel 
                items={carouselImages}
                onVideoClick={onVideoClick}
                className="h-full"
              />
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FaChevronRight className="rotate-90 text-2xl" />
      </motion.div>
=======
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-gradient-to-br from-dice-blue/10 via-white to-purple-500/10">
      {/* Background décoratif */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-dice-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/5 rounded-full blur-3xl" />
      </div>

      {/* Conteneur principal */}
      <div className="relative z-10 w-full h-full px-0.5 sm:px-1 md:px-1.5 lg:px-2">
        <div className="w-full h-full flex items-center">
          {/* Grille responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[0.5px] w-full min-h-[90vh] lg:min-h-[85vh]">
            
            {/* Bloc gauche - Contenu poussé vers le bas avec justify-end */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-white rounded-2xl sm:rounded-3xl py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-end border border-white/30 shadow-xl bg-white/70 backdrop-blur-sm mx-0.5 sm:mx-1 my-0.5 sm:my-1"
            >
              {/* Contenu textuel poussé vers le bas */}
              <div className="flex flex-col w-full">
                {/* Badge */}
                {badge && (
                  <motion.div 
                    className="inline-flex items-center gap-2 bg-dice-blue/10 backdrop-blur-sm px-4 sm:px-5 py-2 rounded-full mb-4 sm:mb-6 w-fit border border-dice-blue/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <GiDiamondRing className="text-dice-blue text-sm sm:text-base" />
                    <span className="text-sm sm:text-base font-medium text-dice-blue">{badge}</span>
                  </motion.div>
                )}

                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  dangerouslySetInnerHTML={{ __html: title }}
                />

                {subtitle && (
                  <motion.p 
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {subtitle}
                  </motion.p>
                )}

                {/* CTA */}
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-3 md:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href={primaryCta.href}>
                    <Button 
                      variant="primary" 
                      size="large"
                      className="group text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5"
                    >
                      {primaryCta.text}
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Stats */}
                {stats && (
                  <div className="mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 md:pt-10 border-t border-gray-200">
                    <Stats stats={stats} variant="dark" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Bloc droite - Carousel pleine hauteur */}
            <motion.div 
              className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] mx-0.5 sm:mx-1 my-0.5 sm:my-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-dark rounded-2xl sm:rounded-3xl overflow-hidden h-full border border-white/10 shadow-xl bg-black/20 backdrop-blur-sm">
                <Carousel 
                  items={carouselImages}
                  onVideoClick={onVideoClick}
                  className="h-full rounded-2xl sm:rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
    </section>
  )
}