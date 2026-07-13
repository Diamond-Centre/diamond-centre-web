/**
 * Section Mission et Vision - Version responsive
 */
'use client'

import { motion } from 'framer-motion'
import { FaBullseye, FaEye, FaHeart, FaRocket } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'

const missions = [
  {
    icon: FaBullseye,
    title: 'Notre Mission',
    description: 'Révéler le potentiel de chaque individu à travers des formations et accompagnements de qualité.',
    color: 'from-dice-blue to-blue-600'
  },
  {
    icon: FaEye,
    title: 'Notre Vision',
    description: 'Devenir le leader africain du développement personnel et professionnel.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: FaHeart,
    title: 'Nos Valeurs',
    description: 'Excellence, intégrité, passion et innovation au service de notre communauté.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: FaRocket,
    title: 'Notre Engagement',
    description: 'Offrir des expériences d\'apprentissage uniques et transformatrices.',
    color: 'from-green-500 to-emerald-500'
  }
]

export default function AboutMission() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-dice-blue font-semibold uppercase tracking-wider text-sm">
            Notre ADN
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            Mission, Vision & Valeurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 md:mt-4 text-sm md:text-base">
            Ce qui nous anime et nous guide au quotidien.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {missions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="hover" className="p-4 md:p-6 text-center h-full border border-gray-100">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                  <item.icon className="text-xl md:text-2xl text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}