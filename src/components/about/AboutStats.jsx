/**
 * Statistiques de Diamond Centre - Version responsive
 */
'use client'

import { motion } from 'framer-motion'
import { 
  FaUsers, 
  FaGraduationCap, 
  FaStar, 
  FaAward,
  FaCalendar,
  FaGlobe
} from 'react-icons/fa'
import Container from '@/components/ui/Container'

const stats = [
  { 
    icon: FaUsers, 
    value: '5 000+', 
    label: 'Participants formés',
    color: 'from-dice-blue to-blue-600'
  },
  { 
    icon: FaGraduationCap, 
    value: '50+', 
    label: 'Formations proposées',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    icon: FaStar, 
    value: '98%', 
    label: 'Taux de satisfaction',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    icon: FaAward, 
    value: '20+', 
    label: 'Experts partenaires',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    icon: FaCalendar, 
    value: '10+', 
    label: "Années d'expérience",
    color: 'from-red-500 to-pink-500'
  },
  { 
    icon: FaGlobe, 
    value: '5+', 
    label: 'Pays couverts',
    color: 'from-cyan-500 to-blue-500'
  }
]

export default function AboutStats() {
  return (
    <section className="py-12 md:py-16 bg-dice-blue">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                <stat.icon className="text-base md:text-xl" />
              </div>
              <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
              <div className="text-[10px] md:text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}