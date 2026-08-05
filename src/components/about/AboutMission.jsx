/**
 * Section Mission et Vision de Diamond Centre - Version storytelling cinématique
 */
'use client'

import { motion } from 'framer-motion'
import { FaBullseye, FaEye, FaHeart, FaRocket } from 'react-icons/fa'
import Container from '@/components/ui/Container'

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
    svgLines: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-[#0a89f2]/20 stroke-current stroke-[0.75] fill-none">
        <polygon points="50,15 85,50 50,85 15,50" />
        <polygon points="50,25 75,50 50,75 25,50" />
        <line x1="50" y1="15" x2="50" y2="85" />
        <line x1="15" y1="50" x2="85" y2="50" />
      </svg>
    )
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
    svgLines: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400/20 stroke-current stroke-[0.75] fill-none">
        <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" />
        <circle cx="50" cy="50" r="25" />
        <line x1="5" y1="30" x2="95" y2="70" />
        <line x1="5" y1="70" x2="95" y2="30" />
      </svg>
    )
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
    svgLines: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400/20 stroke-current stroke-[0.75] fill-none">
        <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="30" x2="90" y2="30" />
        <line x1="10" y1="70" x2="90" y2="70" />
        <polygon points="50,30 70,50 50,70 30,50" />
      </svg>
    )
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
    svgLines: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400/20 stroke-current stroke-[0.75] fill-none">
        <path d="M50 10 L80 40 L50 70 L20 40 Z" />
        <path d="M50 30 L65 45 L50 60 L35 45 Z" />
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="20" y1="40" x2="80" y2="40" />
        <circle cx="50" cy="80" r="6" />
      </svg>
    )
  }
]

export default function AboutMission() {
  return (
    <section className="relative bg-white overflow-hidden py-24 sm:py-32 md:py-40">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-30" />
      </div>

      <Container className="relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 md:mb-32 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a89f2]/5 border border-[#0a89f2]/10 text-dice-blue text-xs font-semibold tracking-widest uppercase mb-4">
            Notre ADN
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Les Piliers de <span className="gradient-text">Notre Histoire</span>
          </h2>
          <div className="w-12 h-1 bg-[#0a89f2] mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Storytelling List */}
        <div className="space-y-32 sm:space-y-40 md:space-y-56">
          {missionData.map((item, index) => {
            const Icon = item.icon
            const isEven = index % 2 === 0

            return (
              <div 
                key={item.key}
                className="relative grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Outlined Background Typography Backdrop */}
                <div 
                  className={`absolute -top-16 md:-top-24 select-none pointer-events-none z-0 hidden md:block ${
                    isEven ? 'left-0' : 'right-0 text-right'
                  }`}
                >
                  <span className="about-bg-text leading-none opacity-40">
                    {item.bgText}
                  </span>
                </div>

                {/* Left/Right Text Column */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-6 relative z-10 ${
                    isEven ? 'order-2 lg:order-1' : 'order-2'
                  }`}
                >
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div 
                      className="absolute -inset-4 rounded-full blur-md opacity-50"
                      style={{ backgroundColor: item.glowColor }}
                    />
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-lg">
                      <Icon className={`text-2xl ${item.iconColor}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </motion.div>

                {/* Left/Right Graphic Column */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-6 relative z-10 flex justify-center ${
                    isEven ? 'order-1 lg:order-2' : 'order-1'
                  }`}
                >
                  {/* Subtle Background Glow */}
                  <div 
                    className="absolute inset-0 rounded-[40px] blur-3xl opacity-20"
                    style={{ backgroundColor: item.glowColor }}
                  />

                  {/* Vector Crystal Box */}
                  <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square rounded-[32px] bg-gradient-to-br from-slate-50 to-slate-100/50 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex items-center justify-center p-8 group hover:scale-[1.03] transition-transform duration-500">
                    
                    {/* Floating SVG lines inside */}
                    <div className="w-full h-full relative select-none animate-float group-hover:scale-105 transition-transform duration-700">
                      {item.svgLines}
                    </div>

                    {/* Small glass corner badge */}
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full glass-white border border-gray-200/50 text-[10px] uppercase font-mono tracking-widest text-gray-500 shadow-sm">
                      {`0${index + 1}`}
                    </div>
                  </div>
                </motion.div>

              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}