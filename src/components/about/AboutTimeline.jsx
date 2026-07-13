/**
 * Chronologie de l'histoire de Diamond Centre - Version responsive
 */
'use client'

import { motion } from 'framer-motion'
import { FaRocket, FaUsers, FaAward, FaGlobe } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'

const timelineEvents = [
  {
    year: '2015',
    title: 'Fondation',
    description: 'Création de Diamond Centre avec une vision de développement personnel.',
    icon: FaRocket,
    color: 'from-dice-blue to-blue-600'
  },
  {
    year: '2017',
    title: 'Première Conférence',
    description: 'Organisation de la première conférence de motivation à Abidjan.',
    icon: FaUsers,
    color: 'from-purple-500 to-pink-500'
  },
  {
    year: '2019',
    title: 'Expansion',
    description: 'Lancement de nouveaux services : séminaires et formations.',
    icon: FaGlobe,
    color: 'from-green-500 to-emerald-500'
  },
  {
    year: '2021',
    title: 'Reconnaissance',
    description: 'Diamond Centre devient une référence en développement personnel.',
    icon: FaAward,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    year: '2023',
    title: 'Innovation',
    description: 'Digitalisation des formations et lancement de nouveaux programmes.',
    icon: FaRocket,
    color: 'from-red-500 to-pink-500'
  }
]

export default function AboutTimeline() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <Badge variant="default" className="mb-4 inline-block">
            Notre histoire
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            Une aventure humaine
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 md:mt-4 text-sm md:text-base">
            Les étapes clés qui ont façonné Diamond Centre.
          </p>
        </motion.div>

        <div className="relative">
          {/* Ligne de temps - Version responsive */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-dice-blue via-purple-500 to-transparent" />

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start md:items-center mb-8 md:mb-12 last:mb-0 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row md:flex-row-reverse'
              }`}
            >
              {/* Point sur la ligne */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-dice-blue rounded-full border-2 md:border-4 border-white shadow-lg z-10 top-1" />

              {/* Carte */}
              <div className={`ml-10 md:ml-0 w-[calc(100%-50px)] md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${event.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <event.icon className="text-white text-sm md:text-base" />
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-bold text-dice-blue">{event.year}</span>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base">{event.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{event.description}</p>
                </div>
              </div>

              {/* Espace vide */}
              <div className="hidden md:block w-5/12" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}