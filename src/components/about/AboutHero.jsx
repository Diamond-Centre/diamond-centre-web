/**
 * Section Hero de la page À propos - Concept 1 : Manifeste Typographique Éditorial
 */
'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaPlay, FaArrowDown } from 'react-icons/fa'
import gsap from 'gsap'
import Container from '@/components/ui/Container'

export default function AboutHero({ onVideoClick }) {
  const containerRef = useRef(null)

  // Animation des halos lumineux en arrière-plan
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.ambient-orb-1', {
        x: 'random(-40, 40)',
        y: 'random(-40, 40)',
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.ambient-orb-2', {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Parallaxe au scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const textParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const titleLine1 = "L'excellence ne s'invente pas."
  const titleLine2 = "Elle se bâtit."

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] md:min-h-screen bg-[#030816] text-white flex flex-col justify-between pt-36 pb-16 overflow-hidden"
    >
      {/* 1. Arrière-plan Éditorial & Halos Lumineux */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-20 h-full w-full" />

        <div className="ambient-orb-1 absolute top-1/4 left-1/2 -translate-x-1/2 w-[65vw] h-[40vw] max-w-[800px] bg-gradient-to-tr from-[#0a89f2]/15 to-purple-600/10 rounded-full blur-[140px]" />
        <div className="ambient-orb-2 absolute bottom-10 right-10 w-[40vw] h-[40vw] max-w-[500px] bg-[#0a89f2]/10 rounded-full blur-[120px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030816]/40 to-[#030816]" />
      </div>

      <Container className="relative z-10 my-auto">
        <motion.div style={{ y: textParallaxY, opacity: opacityFade }} className="max-w-6xl mx-auto">


          {/* Titre Typographique Massif */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-12">
            <span className="block text-white overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {titleLine1}
              </motion.span>
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#0a89f2] via-blue-300 to-indigo-400 overflow-hidden mt-1">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {titleLine2}
              </motion.span>
            </span>
          </h1>

          {/* Layout Asymétrique : Promesse + Texte Manifeste + Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-12 gap-8 items-start pt-10 border-t border-white/10"
          >
            {/* Colonne 1 : Posture */}
            <div className="md:col-span-4">
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                Notre Promesse Institutionnelle
              </p>
              <p className="text-lg sm:text-xl font-medium text-white/90 leading-snug">
                Façonner la nouvelle génération de leaders et d'entrepreneurs d'impact.
              </p>
            </div>

            {/* Colonne 2 : Texte Manifeste avec séparateur vertical */}
            <div className="md:col-span-5 md:border-l md:border-white/10 md:pl-8">
              <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
                Chez Diamond Centre, nous croyons que le potentiel humain est la ressource la plus précieuse d'un continent. Depuis une décennie, nous concevons des écosystèmes d'excellence pour transformer les compétences individuelles en valeur mesurable et durable.
              </p>
            </div>

            {/* Colonne 3 : Bouton Film Institutionnel Épuré */}
            <div className="md:col-span-3 flex md:justify-end items-center mt-4 md:mt-0">
              <button
                onClick={onVideoClick}
                className="group flex items-center justify-center w-full md:w-auto md:justify-start gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-medium text-sm transition-all duration-300 backdrop-blur-md"
              >
                <span className="w-10 h-10 rounded-full bg-[#0a89f2] flex flex-shrink-0 items-center justify-center text-white text-xs group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(10,137,242,0.4)]">
                  <FaPlay className="ml-0.5" />
                </span>
                <span className="text-left leading-tight">
                  Voir le film <br />
                  <span className="text-xs text-gray-400 font-normal">2 min 30 s</span>
                </span>
              </button>
            </div>

          </motion.div>

        </motion.div>
      </Container>

      {/* 2. Pied de Section & Indicateur de Navigation */}
      <Container className="relative z-10 mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-6"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <FaArrowDown className="animate-bounce text-[#0a89f2]" />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}