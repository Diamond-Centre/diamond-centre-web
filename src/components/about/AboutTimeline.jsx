/**
 * Section Chronologie de l'histoire de Diamond Centre - Version premium et cinématique
 */
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaRocket, FaUsers, FaAward, FaGlobe } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'

const timelineEvents = [
  {
    year: '2015',
    title: 'Fondation',
    description: 'Création de Diamond Centre avec la vision audacieuse de libérer le potentiel d\'excellence des individus en Afrique.',
    icon: FaRocket,
    color: 'from-[#0a89f2] to-blue-600',
    iconColor: 'text-[#0a89f2]',
    bgGlow: 'rgba(10, 137, 242, 0.12)'
  },
  {
    year: '2017',
    title: 'Première Conférence',
    description: 'Organisation de notre premier grand rassemblement de motivation et leadership à Abidjan, marquant les esprits.',
    icon: FaUsers,
    color: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-400',
    bgGlow: 'rgba(168, 85, 247, 0.12)'
  },
  {
    year: '2019',
    title: 'Expansion des Services',
    description: 'Lancement d\'une suite complète de séminaires résidentiels et de formations certifiantes destinées aux cadres et dirigeants.',
    icon: FaGlobe,
    color: 'from-green-500 to-emerald-500',
    iconColor: 'text-emerald-400',
    bgGlow: 'rgba(16, 185, 129, 0.12)'
  },
  {
    year: '2021',
    title: 'Reconnaissance Institutionnelle',
    description: 'Diamond Centre s\'impose comme l\'acteur de référence incontournable en matière d\'accompagnement professionnel d\'excellence.',
    icon: FaAward,
    color: 'from-yellow-500 to-orange-500',
    iconColor: 'text-yellow-400',
    bgGlow: 'rgba(234, 179, 8, 0.12)'
  },
  {
    year: '2023',
    title: 'Innovation Digitale',
    description: 'Modernisation de l\'infrastructure, numérisation des parcours de formation et déploiement de programmes immersifs à impact panafricain.',
    icon: FaRocket,
    color: 'from-rose-500 to-pink-500',
    iconColor: 'text-rose-400',
    bgGlow: 'rgba(244, 63, 94, 0.12)'
  }
]

export default function AboutTimeline() {
  const containerRef = useRef(null)

  // Track scroll progress inside the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Animate the line drawing based on scroll
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 bg-[#f8fafc] overflow-hidden"
    >
      {/* Background Decoratives */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-dice-blue/5 rounded-full blur-[130px]" />
      </div>

      <Container className="relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-4">
            <Badge variant="default" className="px-4 py-1.5 rounded-full glass-dark text-[#0a89f2] border border-[#0a89f2]/10 text-xs font-semibold tracking-wider">
              Notre histoire
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Une Aventure <span className="font-light italic text-[#0a89f2]">Humaine</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Parcourez les étapes clés et les accomplissements marquants qui ont forgé la légende de Diamond Centre.
          </p>
        </motion.div>

        {/* Timeline Path container */}
        <div className="relative max-w-5xl mx-auto mt-20">

          {/* Static Background Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 pointer-events-none z-0" />

          {/* Animated Scrolling Progress Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-[#0a89f2] via-purple-500 to-pink-500 -translate-x-1/2 pointer-events-none z-10 origin-top shadow-[0_0_12px_rgba(10,137,242,0.5)]"
          />

          {/* Timeline Milestones list */}
          <div className="space-y-24 md:space-y-36">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-stretch ${isEven ? '' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline Center Bullet Pin */}
                  <div className="absolute left-4 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-lg transition-colors group-hover:border-[#0a89f2]"
                      whileInView={{
                        borderColor: ["#e5e7eb", "#0a89f2"],
                        scale: [1, 1.1, 1],
                        boxShadow: "0 0 15px rgba(10, 137, 242, 0.4)"
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <div className="w-3 h-3 rounded-full bg-[#0a89f2] animate-pulse" />
                    </motion.div>
                  </div>

                  {/* Card Content Column */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 lg:pr-24 text-left md:text-right' : 'md:pl-16 lg:pl-24 text-left'
                    }`}>

                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative p-6 sm:p-8 rounded-3xl about-glass-card hover-glow-border border border-gray-200/50 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                    >
                      {/* Giant background Year Text serving as backdrop art */}
                      <div className={`absolute -top-6 select-none pointer-events-none z-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 ${isEven ? 'left-4' : 'right-4'
                        }`}>
                        <span className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 tracking-tighter">
                          {event.year}
                        </span>
                      </div>

                      {/* Header details */}
                      <div className={`flex flex-col mb-4 ${isEven ? 'md:items-end' : 'md:items-start'
                        }`}>
                        <span className="text-base sm:text-lg font-bold text-[#0a89f2] mb-1 font-mono tracking-wider">
                          {event.year}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-snug">
                          {event.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light relative z-10">
                        {event.description}
                      </p>

                      {/* Accent color gradient strip */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${event.color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
                    </motion.div>
                  </div>

                  {/* Empty Side / Large Decorative Placeholder Column */}
                  <div className="hidden md:block w-1/2 pointer-events-none" />

                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}