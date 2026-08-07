/**
 * Section Équipe de Diamond Centre - Portraits Premium & Interactivité Séquentielle
 */
'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import Container from '@/components/ui/Container'

const teamMembers = [
  {
    name: 'Grégoire Armand TATSI',
    role: 'Fondateur & Conférencier Principal',
    bio: 'Expert en développement personnel et leadership, conférencier international.',
    quote: 'Le leadership n\'est pas un titre ou une position, c\'est un impact de chaque instant.',
    image: '/images/team/dr-sonffo.png',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'mailto:contact@diamondcentre.ci'
    }
  },
  {
    name: 'Marie-Claire KOUASSI',
    role: 'Directrice des Formations',
    bio: 'Spécialiste en techniques de vente et négociation, formatrice certifiée.',
    quote: 'Transmettre le savoir n\'est rien sans la transmission de la confiance en soi.',
    image: '/images/team/marie-claire.png',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'mailto:formations@diamondcentre.ci'
    }
  },
  {
    name: 'Jean-Marc BAMBA',
    role: 'Coach en Entrepreneuriat',
    bio: 'Accompagnateur de jeunes entrepreneurs, expert en business plan.',
    quote: 'L\'audace d\'entreprendre doit s\'accompagner de la rigueur de la méthode.',
    image: '/images/team/jean-marc.png',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'mailto:coaching@diamondcentre.ci'
    }
  },
  {
    name: 'Sophie KOFFI',
    role: 'Oratrice Professionnelle',
    bio: 'Spécialiste en art oratoire et prise de parole en public.',
    quote: 'Votre parole est d\'or, apprenez à la polir comme le plus pur des diamants.',
    image: '/images/team/sophie-koffi.png',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'mailto:sophie.k@diamondcentre.ci'
    }
  }
]

export default function AboutTeam() {
  return (
    <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
      {/* Background Grid & Light Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="about-crystal-grid opacity-25" />
        <div className="absolute top-1/4 right-0 w-[30vw] h-[30vw] bg-dice-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 sm:mb-28 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a89f2]/5 border border-[#0a89f2]/10 text-dice-blue text-xs font-semibold tracking-widest uppercase mb-4">
            Notre expertise
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Des Experts <span className="font-light italic text-[#0a89f2]">Passionnés</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Une synergie d'experts internationaux unis pour propulser votre potentiel vers les sommets.
          </p>
        </motion.div>

        {/* Large Portraits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[3/4.2] rounded-[32px] overflow-hidden bg-slate-950 group shadow-2xl hover:shadow-[0_30px_60px_rgba(10,137,242,0.15)] transition-all duration-500"
            >
              {/* Outer border glow on card */}
              <div className="absolute inset-0 border border-black/10 rounded-[32px] z-20 pointer-events-none group-hover:border-[#0a89f2]/30 transition-colors duration-500" />

              {/* Portrait Image with B&W to Color Transition */}
              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[0.75] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-[0.9] select-none"
              />

              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020716] via-[#020716]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500 z-10 pointer-events-none" />

              {/* Sequential Details Overlay Container */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left z-20 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">

                {/* Name - Slides up and fades in */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-1 group-hover:text-white transition-colors duration-300">
                  {member.name}
                </h3>

                {/* Role - Slides up and fades in */}
                <p className="text-xs sm:text-sm font-semibold text-[#0a89f2] tracking-wider uppercase mb-4 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                  {member.role}
                </p>

                {/* Personal Quote - Reveals height & opacity on hover with delay */}
                <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[100px] group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1] delay-75 mb-6">
                  <p className="text-xs sm:text-sm text-white/70 font-light italic border-l-2 border-[#0a89f2] pl-3">
                    "{member.quote}"
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-4 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-100" />

                {/* Social Network Icons - Fade in with delay */}
                <div className="flex gap-4 items-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[0.16,1,0.3,1] delay-150">
                  <a
                    href={member.social.linkedin}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0a89f2] flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn Profile"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0a89f2] flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    aria-label="Twitter Profile"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={member.social.email}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0a89f2] flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    aria-label="Send Email"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}