/**
 * Section Valeurs détaillées de Diamond Centre - Bento Grid Asymétrique & Tilt 3D
 */
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  FaCrown,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaRocket,
  FaAward
} from 'react-icons/fa'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'

const values = [
  {
    icon: FaCrown,
    title: 'Excellence',
    description: 'Nous visons le plus haut niveau de qualité et d\'exigence dans toutes nos formations et accompagnements pour garantir des résultats hors du commun.',
    color: 'from-[#0a89f2] to-purple-600',
    gridClass: 'md:col-span-2 lg:col-span-8',
    isLarge: true,
    bgGlow: 'rgba(10, 137, 242, 0.08)'
  },
  {
    icon: FaUsers,
    title: 'Communauté',
    description: 'La synergie du collectif et le partage d\'expériences sont nos plus grands accélérateurs de croissance humaine et professionnelle.',
    color: 'from-blue-500 to-cyan-500',
    gridClass: 'lg:col-span-4',
    isLarge: false,
    bgGlow: 'rgba(59, 130, 246, 0.08)'
  },
  {
    icon: FaLightbulb,
    title: 'Innovation',
    description: 'Nous concevons des méthodes de formation novatrices adaptées aux réalités et enjeux du futur du travail.',
    color: 'from-yellow-500 to-orange-500',
    gridClass: 'lg:col-span-4',
    isLarge: false,
    bgGlow: 'rgba(234, 179, 8, 0.08)'
  },
  {
    icon: FaHandshake,
    title: 'Intégrité',
    description: 'La confiance repose sur l\'honnêteté et la transparence totale. Nous incarnons ces principes fondamentaux auprès de nos membres.',
    color: 'from-green-500 to-emerald-500',
    gridClass: 'lg:col-span-4',
    isLarge: false,
    bgGlow: 'rgba(16, 185, 129, 0.08)'
  },
  {
    icon: FaRocket,
    title: 'Impact',
    description: 'Chaque programme est mesuré à l\'impact réel, mesurable et durable qu\'il produit sur le parcours de vie de nos participants.',
    color: 'from-red-500 to-pink-500',
    gridClass: 'lg:col-span-4',
    isLarge: false,
    bgGlow: 'rgba(239, 68, 68, 0.08)'
  },
  {
    icon: FaAward,
    title: 'Reconnaissance',
    description: 'Nous célébrons la singularité, valorisons le talent individuel et créons les conditions optimales pour révéler le leader endormi en chacun de vous.',
    color: 'from-purple-500 to-indigo-500',
    gridClass: 'md:col-span-2 lg:col-span-12',
    isLarge: true,
    isHorizontal: true,
    bgGlow: 'rgba(139, 92, 246, 0.08)'
  }
]

function TiltCard({ children, className, bgGlow, ...props }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left // Mouse position X relative to card
    const y = e.clientY - box.top  // Mouse position Y relative to card

    // Calculate rotation angle (max 6 degrees)
    const rx = -((y - box.height / 2) / (box.height / 2)) * 6
    const ry = ((x - box.width / 2) / (box.width / 2)) * 6

    setRotateX(rx)
    setRotateY(ry)

    // Calculate shine position
    const shineX = (x / box.width) * 100
    const shineY = (y / box.height) * 100
    setShineStyle({
      opacity: 1,
      x: shineX,
      y: shineY
    })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setShineStyle({ opacity: 0, x: 0, y: 0 })
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* 3D Glass Layer Card */}
      <div className="relative w-full h-full about-glass-card hover-glow-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden group/card border border-gray-200/50">

        {/* Dynamic Inner Glow backdrop */}
        <div
          className="absolute -inset-10 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, ${bgGlow || 'rgba(10,137,242,0.05)'} 0%, transparent 70%)`
          }}
        />

        {/* Dynamic Light reflection overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: shineStyle.opacity,
            background: `radial-gradient(circle 200px at ${shineStyle.x}% ${shineStyle.y}%, rgba(255,255,255,0.4) 0%, transparent 80%)`
          }}
        />

        {/* Content wrapper with preserve-3d for depth */}
        <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default function AboutValues() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#f8fafc] overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-20" />
        <div className="absolute top-1/2 left-1/4 w-[35vw] h-[35vw] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">

        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-4">
            <Badge variant="default" className="px-4 py-1.5 rounded-full glass-dark text-[#0a89f2] border border-[#0a89f2]/10 text-xs font-semibold tracking-wider">
              Nos valeurs
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Ce qui nous <span className="font-light italic text-[#0a89f2]">guide</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Des valeurs fondamentales ancrées dans notre identité pour propulser l'excellence collective.
          </p>
        </motion.div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <TiltCard
                key={index}
                bgGlow={value.bgGlow}
                className={`flex flex-col h-full group ${value.gridClass}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {value.isHorizontal ? (
                  /* Horizontal Wide Banner Style (Card 6) */
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg text-white group-hover/card:scale-110 transition-transform duration-500`}>
                        <Icon className="text-2xl sm:text-3xl" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover/card:text-[#0a89f2] transition-colors mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 font-light leading-relaxed max-w-3xl text-sm sm:text-base">
                          {value.description}
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:block w-24 h-24 text-gray-300/10 pointer-events-none flex-shrink-0 select-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-current stroke-[0.5] fill-none">
                        <polygon points="50,15 90,40 90,60 50,90 10,60 10,40" />
                        <line x1="50" y1="15" x2="50" y2="90" />
                      </svg>
                    </div>
                  </div>
                ) : value.isLarge ? (
                  /* Large Bento Card Style (Card 1) */
                  <div className="flex flex-col h-full justify-between gap-8 text-left">
                    <div>
                      <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white group-hover/card:scale-110 transition-transform duration-500`}>
                        <Icon className="text-2xl" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover/card:text-[#0a89f2] transition-colors mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 font-light text-base sm:text-lg leading-relaxed max-w-xl">
                        {value.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#0a89f2] uppercase select-none group-hover/card:translate-x-2 transition-transform duration-300">
                      Pilier Fondateur
                    </div>
                  </div>
                ) : (
                  /* Standard Card Style (Cards 2, 3, 4, 5) */
                  <div className="flex flex-col h-full justify-between gap-6 text-left">
                    <div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-5 shadow-md text-white group-hover/card:scale-110 transition-transform duration-500`}>
                        <Icon className="text-xl" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover/card:text-[#0a89f2] transition-colors mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                )}
              </TiltCard>
            )
          })}
        </div>
      </Container>
    </section>
  )
}