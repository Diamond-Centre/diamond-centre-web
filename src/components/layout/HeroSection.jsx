/**
 * Section Hero avec glassmorphisme
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaPlay, FaChevronRight } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Container from '@/components/ui/Container'
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
    </section>
  )
}