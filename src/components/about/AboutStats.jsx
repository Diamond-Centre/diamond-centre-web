/**
 * Section Statistiques de Diamond Centre - Version premium, immersive et cinématique
 */
'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import {
  FaUsers,
  FaGraduationCap,
  FaStar,
  FaAward,
  FaCalendar,
  FaGlobe
} from 'react-icons/fa'
import Container from '@/components/ui/Container'

const statsData = [
  {
    icon: FaUsers,
    value: '5000+',
    label: 'Participants formés',
    color: 'text-[#0a89f2]',
    bgGlow: 'rgba(10, 137, 242, 0.15)'
  },
  {
    icon: FaGraduationCap,
    value: '50+',
    label: 'Formations proposées',
    color: 'text-purple-400',
    bgGlow: 'rgba(168, 85, 247, 0.15)'
  },
  {
    icon: FaStar,
    value: '98%',
    label: 'Taux de satisfaction',
    color: 'text-yellow-400',
    bgGlow: 'rgba(234, 179, 8, 0.15)'
  },
  {
    icon: FaAward,
    value: '20+',
    label: 'Experts partenaires',
    color: 'text-emerald-400',
    bgGlow: 'rgba(16, 185, 129, 0.15)'
  },
  {
    icon: FaCalendar,
    value: '10+',
    label: "Années d'expérience",
    color: 'text-rose-400',
    bgGlow: 'rgba(244, 63, 94, 0.15)'
  },
  {
    icon: FaGlobe,
    value: '5+',
    label: 'Pays couverts',
    color: 'text-cyan-400',
    bgGlow: 'rgba(34, 211, 238, 0.15)'
  }
]

function Counter({ value, duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  // Extract number and suffix
  const numOnly = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const suffix = value.replace(/[0-9]/g, '') // e.g., '+', '%'

  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => {
    const val = Math.round(latest)
    if (val >= 1000) {
      // format as 5 000
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
    return val.toString()
  })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numOnly, {
        duration: duration,
        ease: [0.16, 1, 0.3, 1]
      })
      return controls.stop
    }
  }, [isInView, numOnly, count, duration])

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  )
}

export default function AboutStats() {
  const sectionRef = useRef(null)
  const lineInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#040d21] overflow-hidden border-y border-white/5"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vh] bg-dice-blue/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <Container className="relative z-10">
        <div className="relative">
          {/* Animated Connecting SVG Line - Desktop */}
          <div className="hidden lg:block absolute top-8 left-0 w-full h-1 pointer-events-none z-0">
            <svg className="w-full h-4 overflow-visible" fill="none">
              {/* Static background path */}
              <line
                x1="8%"
                y1="8"
                x2="92%"
                y2="8"
                className="stroke-white/10 stroke-[2]"
              />
              {/* Animated overlay path */}
              <motion.line
                x1="8%"
                y1="8"
                x2="92%"
                y2="8"
                className="stroke-gradient stroke-[2]"
                stroke="url(#statsLineGradient)"
                initial={{ pathLength: 0 }}
                animate={lineInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="statsLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0a89f2" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Animated Connecting SVG Line - Mobile & Tablet */}
          <div className="lg:hidden absolute top-0 left-6 sm:left-8 w-0.5 h-full pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" fill="none">
              <line
                x1="2"
                y1="4%"
                x2="2"
                y2="96%"
                className="stroke-white/10 stroke-[2]"
              />
              <motion.line
                x1="2"
                y1="4%"
                x2="2"
                y2="96%"
                className="stroke-[2]"
                stroke="url(#statsLineGradientMobile)"
                initial={{ pathLength: 0 }}
                animate={lineInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="statsLineGradientMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a89f2" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stats Nodes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10 pl-12 lg:pl-0">
            {statsData.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex lg:flex-col items-center lg:items-center text-left lg:text-center relative group"
                >
                  {/* Node Circle with Icon */}
                  <div className="relative mb-0 lg:mb-6 mr-6 lg:mr-0">
                    {/* Ring highlight effect */}
                    <div
                      className="absolute -inset-2 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ backgroundColor: stat.bgGlow }}
                    />

                    {/* Glowing outer circle */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:border-white/30 group-hover:scale-110 shadow-2xl">
                      <Icon className={`text-base sm:text-xl ${stat.color} transition-transform duration-300 group-hover:scale-125`} />
                    </div>

                    {/* Small pulse indicator */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/20 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0a89f2]"></span>
                    </span>
                  </div>

                  {/* Stat Description */}
                  <div className="flex-grow lg:flex-grow-0">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none tracking-tight mb-2 sm:mb-3">
                      <Counter value={stat.value} />
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white/50 tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}