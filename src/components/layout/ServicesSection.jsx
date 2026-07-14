/**
 * Section des services avec grille
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

export default function ServicesSection({ 
  services, 
  title = 'Nos services',
  subtitle = 'Découvrez l\'ensemble de nos services conçus pour votre développement.',
  badge = 'Services'
}) {
  return (
    <Section 
      badge={badge}
      title={title}
      subtitle={subtitle}
      className="bg-white"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
          >
            <Card variant="hover" className="p-6 border border-gray-100">
              <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>
              <Link href={service.href || '/events'}>
                <motion.button 
                  className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm"
                  whileHover={{ x: 5 }}
                >
                  Voir les événements <FaArrowRight className="text-xs" />
                </motion.button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}