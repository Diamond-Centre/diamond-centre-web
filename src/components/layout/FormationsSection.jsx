/**
 * Section des formations - Design "Choose Your Perfect Studio"
 * Avec glassmorphisme tendant vers le bleu Diamond Centre
 * Badge style témoignages
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaUsers, FaMicrophone, FaHeadphones, FaClock, FaMapMarker } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

// Icônes par type de formation
const typeIcons = {
  'conférence': FaMicrophone,
  'séminaire': FaUsers,
  'formation': FaHeadphones,
  'atelier': FaUsers,
  'default': FaMicrophone
}

// Couleurs avec notre charte graphique
const typeColors = {
  'conférence': 'from-dice-blue to-blue-600',
  'séminaire': 'from-purple-500 to-purple-600',
  'formation': 'from-green-500 to-green-600',
  'atelier': 'from-orange-500 to-orange-600',
  'default': 'from-dice-blue to-blue-600'
}

export default function FormationsSection({ 
  formations,
  loading = false,
  title = 'Choisissez votre formation idéale',
  subtitle = 'Trouvez la formation qui correspond à vos objectifs et à votre style d\'apprentissage, conçue pour vous offrir la meilleure expérience et donner vie à votre projet professionnel.',
  badge = 'Nos formations',
  onVideoClick
}) {
  
  const getIcon = (type) => {
    return typeIcons[type] || typeIcons.default
  }

  const getColor = (type) => {
    return typeColors[type] || typeColors.default
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Données statiques pour simuler l'image si pas de formations
  const demoFormations = [
    {
      id: 'demo1',
      titre: 'Lounge Studio',
      description: 'Couch + 2 chairs, up to 4 people. Perfect for conversational and relaxed podcast formats.',
      type: 'conférence',
      prix: 50,
      date: new Date(),
      lieu: 'Abidjan, Plateau',
      formateur: { nom: 'Dr SONFFO' },
      nbPlaces: 20,
      nbInscrits: 5,
      statut: 'à venir'
    },
    {
      id: 'demo2',
      titre: 'Table Studio',
      description: 'Table setup, up to 4 people. Perfect for interviews and panel discussions.',
      type: 'séminaire',
      prix: 60,
      date: new Date(),
      lieu: 'Abidjan, Cocody',
      formateur: { nom: 'Dr SONFFO' },
      nbPlaces: 15,
      nbInscrits: 3,
      statut: 'à venir'
    },
    {
      id: 'demo3',
      titre: 'Solo Studio',
      description: 'Single-person recording setup. Great for voiceovers, solo podcasts, and audiobooks.',
      type: 'formation',
      prix: 45,
      date: new Date(),
      lieu: 'Abidjan, Marcory',
      formateur: { nom: 'Dr SONFFO' },
      nbPlaces: 10,
      nbInscrits: 2,
      statut: 'à venir'
    }
  ]

  const displayFormations = formations && formations.length > 0 ? formations : demoFormations

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5">
      <div className="container mx-auto px-4">
        
        {/* En-tête de section avec badge style témoignages */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge style témoignages - glassmorphisme */}
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-dice-blue/10 backdrop-blur-sm border border-white/30 text-dice-blue shadow-sm">
              {badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Grille des formations - 3 colonnes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            // État de chargement
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="glass-card-dice rounded-2xl p-6 md:p-8 animate-pulse">
                <div className="w-16 h-16 bg-dice-blue/10 rounded-2xl mb-4" />
                <div className="h-7 bg-dice-blue/10 rounded-lg mb-3 w-3/4" />
                <div className="h-4 bg-dice-blue/10 rounded-lg mb-2 w-full" />
                <div className="h-4 bg-dice-blue/10 rounded-lg mb-2 w-5/6" />
                <div className="h-4 bg-dice-blue/10 rounded-lg mb-6 w-4/6" />
                <div className="h-10 bg-dice-blue/10 rounded-full w-1/3" />
              </div>
            ))
          ) : (
            displayFormations.map((formation, index) => {
              const Icon = getIcon(formation.type)
              const color = getColor(formation.type)
              const isPast = new Date(formation.date) < new Date()
              const placesRestantes = formation.nbPlaces - formation.nbInscrits
              const isAvailable = !isPast && placesRestantes > 0

              return (
                <motion.div
                  key={formation.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  {/* Carte avec glassmorphisme bleu Diamond Centre */}
                  <div className="glass-card-dice rounded-2xl p-6 md:p-8 border border-dice-blue/20 shadow-xl backdrop-blur-md bg-dice-blue/10 hover:bg-dice-blue/15 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                    
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/20 via-transparent to-dice-blue/5 rounded-2xl" />
                    </div>

                    {/* Effet de reflet en haut */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-40">
                      <div className="absolute inset-0 bg-gradient-to-b from-dice-blue/10 to-transparent rounded-t-2xl" />
                    </div>

                    {/* Icône avec dégradé */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <Icon className="text-2xl text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent" />
                    </div>

                    {/* Titre */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 relative z-10">
                      {formation.titre}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow leading-relaxed relative z-10">
                      {formation.description}
                    </p>

                    {/* Détails */}
                    <div className="space-y-2 text-sm text-gray-500 mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-dice-blue text-xs" />
                        <span>{formatDate(formation.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarker className="text-dice-blue text-xs" />
                        <span>{formation.lieu}</span>
                      </div>
                    </div>

                    {/* Prix et CTA */}
                    <div className="mt-auto pt-4 border-t border-dice-blue/10 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-dice-blue">
                          {formation.prix}€
                        </span>
                        <Link href={`/events/${formation.id}`}>
                          <button 
                            className="group/btn text-dice-blue font-medium text-sm hover:text-dice-blue-dark transition-colors flex items-center gap-2"
                            disabled={!isAvailable}
                          >
                            {isPast ? 'Terminé' : placesRestantes <= 0 ? 'Complet' : 'Learn More'}
                            {isAvailable && (
                              <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform text-xs" />
                            )}
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Badge de statut - Style témoignages (glassmorphisme) */}
                    {formation.statut && (
                      <div className="absolute top-4 right-4 relative z-10">
                        {formation.statut === 'à venir' && isAvailable ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-700 shadow-sm">
                            Disponible
                          </span>
                        ) : formation.statut === 'terminé' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-600 shadow-sm">
                            Terminé
                          </span>
                        ) : placesRestantes <= 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-700 shadow-sm">
                            Complet
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-dice-blue/20 backdrop-blur-sm border border-dice-blue/30 text-dice-blue shadow-sm">
                            Bientôt
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Bouton "Voir toutes les formations" - Style glassmorphisme */}
        {displayFormations && displayFormations.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/events">
              <Button 
                variant="primary" 
                size="large"
                className="group shadow-lg hover:shadow-xl"
              >
                Voir toutes nos formations
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Styles globaux pour le glassmorphisme bleu Diamond Centre */}
      <style jsx global>{`
        .glass-card-dice {
          background: rgba(10, 137, 242, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(10, 137, 242, 0.15);
          box-shadow: 
            0 8px 32px rgba(10, 137, 242, 0.06),
            inset 0 1px 0 rgba(10, 137, 242, 0.1);
        }

        .glass-card-dice:hover {
          background: rgba(10, 137, 242, 0.12);
          box-shadow: 
            0 12px 48px rgba(10, 137, 242, 0.1),
            inset 0 1px 0 rgba(10, 137, 242, 0.15);
        }

        /* Reflet supérieur */
        .glass-card-dice::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            to bottom,
            rgba(10, 137, 242, 0.08),
            transparent
          );
          pointer-events: none;
          border-radius: 16px 16px 0 0;
          opacity: 0.5;
        }

        /* Badge style témoignages */
        .badge-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Badge vert pour Disponible */
        .badge-available {
          background: rgba(34, 197, 94, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #16a34a;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </section>
  )
}