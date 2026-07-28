/**
 * Section témoignages - Bleu Diamond Centre avec défilement infini horizontal
 * Pause au survol
 */
'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

// Emojis pour les avatars
const avatarEmojis = [
  '👩‍💼', // Femme entrepreneur
  '👨‍🎓', // Homme étudiant
  '👩‍💻', // Femme chef d'entreprise
  '👨‍🏫', // Homme professeur
  '👩‍🎨', // Femme artiste
  '👨‍💼', // Homme professionnel
  '👩‍🚀', // Femme aventurière
  '🧑‍💻', // Personne développeur
  '👩‍🔬', // Femme scientifique
  '🧑‍🏫', // Personne enseignant
  '👩‍⚕️', // Femme médecin
  '🧑‍💼', // Personne professionnelle
]

// Composant de défilement infini avec pause au survol
function InfiniteMarquee({ children, direction = 'left', speed = 45 }) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      {/* Effet de fondu sur les bords (fade edges) */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-dice-blue to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-dice-blue to-transparent" />
      
      {/* Conteneur du défilement */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-6 py-4"
          animate={{
            x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
          }}
          transition={{
            duration: speed,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          // Pause au survol
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
          // Alternative avec stop animation
          {...(isHovered && {
            animate: {
              x: ['0%', '-50%'],
            },
            transition: {
              duration: speed,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            },
          })}
        >
          {children}
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default function TestimonialsSection({ 
  testimonials,
  title = 'Ce que disent nos participants',
  badge = 'Témoignages',
  bgClass = 'bg-gradient-to-br from-dice-blue to-dice-blue-dark'
}) {
  // Dupliquer les témoignages pour l'effet infini
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <Section 
      badge={badge}
      title={title}
      className={bgClass}
    >
      {/* Version desktop avec marquee */}
      <div className="hidden md:block">
        <InfiniteMarquee direction="left" speed={45}>
          {duplicatedTestimonials.map((testimonial, index) => {
            let emoji = '👤'
            
            if (testimonial.role?.toLowerCase().includes('entrepreneur')) {
              emoji = '👩‍💼'
            } else if (testimonial.role?.toLowerCase().includes('étudiant')) {
              emoji = '👨‍🎓'
            } else if (testimonial.role?.toLowerCase().includes('chef')) {
              emoji = '👩‍💻'
            } else if (testimonial.role?.toLowerCase().includes('professeur') || testimonial.role?.toLowerCase().includes('enseignant')) {
              emoji = '👨‍🏫'
            } else if (testimonial.role?.toLowerCase().includes('artiste')) {
              emoji = '👩‍🎨'
            } else if (testimonial.role?.toLowerCase().includes('développeur')) {
              emoji = '🧑‍💻'
            } else if (testimonial.role?.toLowerCase().includes('scientifique')) {
              emoji = '👩‍🔬'
            } else if (testimonial.role?.toLowerCase().includes('médecin')) {
              emoji = '👩‍⚕️'
            } else {
              const emojiIndex = index % avatarEmojis.length
              emoji = avatarEmojis[emojiIndex]
            }

            return (
              <motion.div
                key={`${index}-${testimonial.name}`}
                className="min-w-[320px] max-w-[320px] flex-shrink-0"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="ghost" className="bg-white/10 backdrop-blur-sm p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-dice-blue to-dice-blue-dark flex items-center justify-center text-3xl text-white shadow-lg">
                      {emoji}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">"{testimonial.text}"</p>
                </Card>
              </motion.div>
            )
          })}
        </InfiniteMarquee>
      </div>

      {/* Version mobile avec grille classique */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => {
            let emoji = '👤'
            
            if (testimonial.role?.toLowerCase().includes('entrepreneur')) {
              emoji = '👩‍💼'
            } else if (testimonial.role?.toLowerCase().includes('étudiant')) {
              emoji = '👨‍🎓'
            } else if (testimonial.role?.toLowerCase().includes('chef')) {
              emoji = '👩‍💻'
            } else if (testimonial.role?.toLowerCase().includes('professeur') || testimonial.role?.toLowerCase().includes('enseignant')) {
              emoji = '👨‍🏫'
            } else if (testimonial.role?.toLowerCase().includes('artiste')) {
              emoji = '👩‍🎨'
            } else if (testimonial.role?.toLowerCase().includes('développeur')) {
              emoji = '🧑‍💻'
            } else if (testimonial.role?.toLowerCase().includes('scientifique')) {
              emoji = '👩‍🔬'
            } else if (testimonial.role?.toLowerCase().includes('médecin')) {
              emoji = '👩‍⚕️'
            } else {
              const emojiIndex = index % avatarEmojis.length
              emoji = avatarEmojis[emojiIndex]
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="ghost" className="bg-white/10 backdrop-blur-sm p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-dice-blue to-dice-blue-dark flex items-center justify-center text-3xl text-white shadow-lg">
                      {emoji}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">"{testimonial.text}"</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}