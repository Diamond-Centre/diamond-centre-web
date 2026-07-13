/**
 * Section Valeurs détaillées - Version responsive
 */
'use client'

import { motion } from 'framer-motion'
import { 
  FaGem, 
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
    icon: FaGem,
    title: 'Excellence',
    description: 'Nous visons l\'excellence dans tout ce que nous entreprenons, avec des formations de qualité.',
    color: 'from-dice-blue to-purple-600'
  },
  {
    icon: FaUsers,
    title: 'Communauté',
    description: 'Nous croyons en la force de la communauté et du partage d\'expériences.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: FaLightbulb,
    title: 'Innovation',
    description: 'Nous innovons constamment pour offrir des formations adaptées aux besoins actuels.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: FaHandshake,
    title: 'Intégrité',
    description: 'Nous agissons avec transparence et intégrité dans toutes nos relations.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: FaRocket,
    title: 'Impact',
    description: 'Nous mesurons notre succès à l\'impact positif que nous créons.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: FaAward,
    title: 'Reconnaissance',
    description: 'Nous valorisons et reconnaissons le talent et le potentiel de chacun.',
    color: 'from-purple-500 to-indigo-500'
  }
]

export default function AboutValues() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <Badge variant="default" className="mb-4 inline-block">
            Nos valeurs
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            Ce qui nous guide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 md:mt-4 text-sm md:text-base">
            Des valeurs fondamentales qui animent notre équipe au quotidien.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 hover:border-dice-blue/30 transition-all duration-300 h-full">
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="text-xl md:text-2xl text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}