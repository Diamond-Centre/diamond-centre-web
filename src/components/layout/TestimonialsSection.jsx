/**
<<<<<<< HEAD
 * Section témoignages
=======
 * Section témoignages - Bleu Diamond Centre avec emojis
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
 */
'use client'

import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

<<<<<<< HEAD
=======
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

>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
export default function TestimonialsSection({ 
  testimonials,
  title = 'Ce que disent nos participants',
  badge = 'Témoignages',
<<<<<<< HEAD
  bgClass = 'bg-gradient-to-br from-blue-900 to-indigo-900 text-white'
=======
  bgClass = 'bg-gradient-to-br from-dice-blue to-dice-blue-dark'
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
}) {
  return (
    <Section 
      badge={badge}
      title={title}
      className={bgClass}
    >
      <div className="grid md:grid-cols-3 gap-8">
<<<<<<< HEAD
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
=======
        {testimonials.map((testimonial, index) => {
          // Sélectionner un emoji basé sur l'index ou le rôle
          let emoji = '👤' // Emoji par défaut
          
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
            // Alterner les emojis si aucun rôle ne correspond
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
                  {/* Avatar avec emoji */}
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
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
      </div>
    </Section>
  )
}