/**
 * Section des sponsors avec logos officiels et effet glassmorphisme
 */
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Container from '@/components/ui/Container'

// Liste des sponsors avec leurs logos officiels
const sponsors = [
  {
    id: 1,
    name: 'Orange',
    logo: '/images/sponsors/orange-logo.svg',
    color: '#FF7900',
    website: 'https://www.orange.com',
    description: 'Leader des télécommunications en Afrique'
  },
  {
    id: 2,
    name: 'MTN',
    logo: '/images/sponsors/mtn-logo.svg',
    color: '#FFCD00',
    website: 'https://www.mtn.com',
    description: 'Opérateur de télécommunications mobile'
  },
  {
    id: 3,
    name: 'Ecobank',
    logo: '/images/sponsors/ecobank-logo.svg',
    color: '#006633',
    website: 'https://www.ecobank.com',
    description: 'Banque panafricaine de référence'
  },
  {
    id: 4,
    name: 'Afriland',
    logo: '/images/sponsors/afriland-logo.svg',
    color: '#003399',
    website: 'https://www.afriland.com',
    description: 'Groupe bancaire camerounais'
  },
  {
    id: 5,
    name: 'SABC',
    logo: '/images/sponsors/sabc-logo.svg',
    color: '#E30613',
    website: 'https://www.sabc.co.za',
    description: 'Diffuseur public sud-africain'
  },
  {
    id: 6,
    name: 'Tigo',
    logo: '/images/sponsors/tigo-logo.svg',
    color: '#E20074',
    website: 'https://www.tigo.com',
    description: 'Opérateur de télécommunications mobile'
  },
  {
    id: 7,
    name: 'Africell',
    logo: '/images/sponsors/africell-logo.svg',
    color: '#00A651',
    website: 'https://www.africell.com',
    description: 'Opérateur de télécommunications panafricain'
  },
  {
    id: 8,
    name: 'BGFI',
    logo: '/images/sponsors/bgfi-logo.svg',
    color: '#ED1C24',
    website: 'https://www.bgfibank.com',
    description: 'Groupe bancaire et financier'
  }
]

export default function SponsorsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-dice-blue font-semibold uppercase tracking-wider text-sm">
            Nos partenaires
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Ils nous font confiance
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-2">
            Des partenaires de confiance qui accompagnent Diamond Centre dans sa mission
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              {/* Carte glassmorphisme */}
              <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/70 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[140px]">
                {/* Effet de couleur au survol */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: sponsor.color }}
                />
                
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {/* Logo officiel */}
                <div className="relative w-20 h-20 mb-3 transition-all duration-300 group-hover:scale-110">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>

                {/* Nom du sponsor */}
                <span className="text-sm font-semibold text-gray-700 group-hover:text-dice-blue transition-colors duration-300">
                  {sponsor.name}
                </span>

                {/* Description (visible au survol) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                    {sponsor.description}
                  </div>
                </div>

                {/* Icône externe */}
                <FaExternalLinkAlt className="absolute top-3 right-3 text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Texte de bas */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          Et de nombreux autres partenaires qui contribuent à notre succès
        </motion.p>
      </Container>
    </section>
  )
}