/**
 * Section témoignages
 */
'use client'

import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

export default function TestimonialsSection({ 
  testimonials,
  title = 'Ce que disent nos participants',
  badge = 'Témoignages',
  bgClass = 'bg-gradient-to-br from-blue-900 to-indigo-900 text-white'
}) {
  return (
    <Section 
      badge={badge}
      title={title}
      className={bgClass}
    >
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="ghost" className="bg-white/10 backdrop-blur-sm p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xl font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{testimonial.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}