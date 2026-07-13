/**
 * Section Équipe - Version responsive
 */
'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'

const teamMembers = [
  {
    name: 'Dr T. G. SONFFO',
    role: 'Fondateur & Conférencier Principal',
    bio: 'Expert en développement personnel et leadership, conférencier international.',
    image: '/images/team/dr-sonffo.jpg',
    social: {
      linkedin: '#',
      twitter: '#',
      email: '#'
    }
  },
  {
    name: 'Marie-Claire KOUASSI',
    role: 'Directrice des Formations',
    bio: 'Spécialiste en techniques de vente et négociation, formatrice certifiée.',
    image: '/images/team/marie-claire.jpg',
    social: {
      linkedin: '#',
      twitter: '#',
      email: '#'
    }
  },
  {
    name: 'Jean-Marc BAMBA',
    role: 'Coach en Entrepreneuriat',
    bio: 'Accompagnateur de jeunes entrepreneurs, expert en business plan.',
    image: '/images/team/jean-marc.jpg',
    social: {
      linkedin: '#',
      twitter: '#',
      email: '#'
    }
  },
  {
    name: 'Sophie KOFFI',
    role: 'Oratrice Professionnelle',
    bio: 'Spécialiste en art oratoire et prise de parole en public.',
    image: '/images/team/sophie-koffi.jpg',
    social: {
      linkedin: '#',
      twitter: '#',
      email: '#'
    }
  }
]

export default function AboutTeam() {
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
            Notre équipe
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            Des experts passionnés
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 md:mt-4 text-sm md:text-base">
            Une équipe de professionnels dédiés à votre développement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card variant="hover" className="overflow-hidden text-center">
                <div className="relative h-40 md:h-48 w-full bg-gradient-to-br from-dice-blue/10 to-purple-500/10 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-gray-300">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{member.name}</h3>
                  <p className="text-xs md:text-sm text-dice-blue font-medium">{member.role}</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-2">{member.bio}</p>
                  <div className="flex justify-center gap-3 mt-3 md:mt-4">
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-dice-blue transition-colors">
                      <FaLinkedin className="text-base md:text-lg" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-400 hover:text-dice-blue transition-colors">
                      <FaTwitter className="text-base md:text-lg" />
                    </a>
                    <a href={member.social.email} className="text-gray-400 hover:text-dice-blue transition-colors">
                      <FaEnvelope className="text-base md:text-lg" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}