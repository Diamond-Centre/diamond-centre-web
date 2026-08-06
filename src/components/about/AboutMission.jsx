/**
 * Section Mission et Vision de Diamond Centre - Version storytelling cinématique
 */
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaBullseye, FaEye, FaHeart, FaRocket } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Container from '@/components/ui/Container'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
}

const missionData = [
  {
    key: 'mission',
    icon: FaBullseye,
    title: 'Notre Mission',
    description: 'Révéler le potentiel de chaque individu et transformer les ambitions en réussites concrètes à travers des formations d\'excellence.',
    bgText: 'MISSION',
    colorClass: 'from-[#0a89f2] to-blue-600',
    iconColor: 'text-[#0a89f2]',
    glowColor: 'rgba(10, 137, 242, 0.15)',
  },
  {
    key: 'vision',
    icon: FaEye,
    title: 'Notre Vision',
    description: 'Devenir le leader africain de la formation professionnelle et du développement personnel, en façonnant l\'avenir du leadership du continent.',
    bgText: 'VISION',
    colorClass: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
  {
    key: 'valeurs',
    icon: FaHeart,
    title: 'Nos Valeurs',
    description: 'L\'excellence, l\'intégrité, l\'impact social et l\'innovation constante guident chacune de nos actions et relations au quotidien.',
    bgText: 'VALEURS',
    colorClass: 'from-orange-500 to-red-500',
    iconColor: 'text-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.15)',
  },
  {
    key: 'engagement',
    icon: FaRocket,
    title: 'Notre Engagement',
    description: 'Proposer des parcours d\'apprentissage uniques, transformateurs et mesurables qui libèrent l\'excellence professionnelle.',
    bgText: 'IMPACT',
    colorClass: 'from-green-500 to-emerald-500',
    iconColor: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  }
]

export default function AboutMission() {
  const scrollContainerRef = useRef(null)
  const pathRef = useRef(null)
  const arrowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current
      const arrow = arrowRef.current

      if (!path || !arrow) return

      const pathLength = path.getTotalLength()

      // Initialisation du tracé masque
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      })

      // Placement initial de la flèche au début du tracé
      gsap.set(arrow, {
        transformOrigin: 'center center',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: 'top 50%',
          end: 'bottom 85%',
          scrub: 1.2,
        },
      })

      // Animation synchrone de la ligne et de la flèche
      tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0)

      tl.to(
        arrow,
        {
          motionPath: {
            path: path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: 'none',
        },
        0
      )
    }, scrollContainerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative bg-[#edf2fc] overflow-hidden py-24 sm:py-32 md:py-40">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-30" />
      </div>

      <Container className="relative z-10">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 md:mb-32 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a89f2]/5 border border-[#0a89f2]/10 text-[#0a89f2] text-xs font-semibold tracking-widest uppercase mb-4">
            Notre ADN
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Les Piliers de <span className="text-[#0a89f2]">Notre Histoire</span>
          </h2>
          <div className="w-12 h-1 bg-[#0a89f2] mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Section Interactive */}
        <div ref={scrollContainerRef} className="relative">

          {/* Ligne et flèche en arrière-plan */}
          <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
            <svg
              viewBox="0 0 1000 2000"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Path contrôlé pour éviter la colonne droite */}
              <path
                d="M 500,0 C 500,150 520,250 520,400 C 520,600 200,700 200,950 C 200,1200 520,1300 520,1500 C 520,1700 200,1750 200,1900"
                stroke="#E8EEF5"
                strokeWidth="4"
                fill="none"
                strokeDasharray="12 12"
              />

              {/* Tracé actif */}
              <path
                ref={pathRef}
                d="M 500,0 C 500,150 520,250 520,400 C 520,600 200,700 200,950 C 200,1200 520,1300 520,1500 C 520,1700 200,1750 200,1900"
                stroke="#0a89f2"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              {/* Tête de Flèche - Centrée en (0,0) pour suivre parfaitement le tracé */}
              <g ref={arrowRef}>
                {/* Halo autour de la flèche */}
                <circle cx="0" cy="0" r="14" fill="#0a89f2" opacity="0.2" />
                {/* Triangle orienté vers la droite (direction 0° par défaut pour MotionPath) */}
                <polygon points="12,0 -10,-8 -5,0 -10,8" fill="#0a89f2" />
              </g>

              {/* Point d'Arrivée (X:200, Y:1900) */}
              <g transform="translate(200, 1900)">
                <circle cx="0" cy="0" r="28" fill="#10B981" opacity="0.15" />

                <circle cx="0" cy="0" r="10" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="8; 45" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6; 0" dur="2.5s" repeatCount="indefinite" />
                </circle>

                <circle cx="0" cy="0" r="10" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.4">
                  <animate attributeName="r" values="8; 65" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4; 0" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
                </circle>

                <circle cx="0" cy="0" r="6" fill="#10B981" />
                <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Cartes de contenu */}
          <div className="space-y-32 sm:space-y-40 md:space-y-56 relative z-10">
            {missionData.map((item, index) => {
              const Icon = item.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={item.key}
                  className="relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                >
                  <div
                    className={`absolute -top-16 md:-top-24 select-none pointer-events-none z-0 hidden md:block ${isEven ? 'left-0' : 'right-0 text-right'
                      }`}
                  >
                    <span className="text-[100px] lg:text-[140px] font-black leading-none opacity-[0.03]">
                      {item.bgText}
                    </span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:col-span-6 relative z-10 ${isEven ? 'lg:col-start-1' : 'lg:col-start-7'
                      }`}
                  >
                    <div className="relative mb-6">
                      <div
                        className="absolute -inset-4 rounded-full blur-md opacity-50"
                        style={{ backgroundColor: item.glowColor }}
                      />
                      <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                        <Icon className={`text-2xl ${item.iconColor}`} />
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </motion.div>

                </div>
              )
            })}
          </div>

        </div>
      </Container>
    </section>
  )
}