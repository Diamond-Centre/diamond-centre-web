/**
 * Section des formations - Carrousel 3D avec boucle infinie
 */
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaMicrophone,
  FaHeadphones,
  FaVideo,
  FaMusic,
  FaClock,
  FaMapMarker,
} from 'react-icons/fa'

// Icônes par type de studio
const typeIcons = {
  'conférence': FaMicrophone,
  'séminaire': FaUsers,
  'formation': FaHeadphones,
  'atelier': FaUsers,
  'vidéo': FaVideo,
  'musique': FaMusic,
  'default': FaMicrophone,
}

export default function FormationsSection({
  formations,
  loading = false,
  title = 'Choisissez votre studio idéal',
  subtitle = 'Trouvez le studio qui correspond à vos objectifs et à votre style d\'enregistrement, conçu pour vous offrir la meilleure expérience et donner vie à votre projet.',
  badge = 'Nos studios',
}) {
  // 6 cartes : les 3 existantes + 3 nouvelles
  const demoFormations = [
    {
      id: 'demo1',
      titre: 'Lounge Studio',
      description: 'Canapé + 2 fauteuils, jusqu\'à 4 personnes. Idéal pour un format conversationnel et détendu.',
      type: 'conférence',
      prix: 50,
      lieu: 'Abidjan, Plateau',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=1200&fit=crop',
    },
    {
      id: 'demo2',
      titre: 'Table Studio',
      description: 'Configuration table, jusqu\'à 4 personnes. Parfait pour interviews et tables rondes.',
      type: 'séminaire',
      prix: 60,
      lieu: 'Abidjan, Cocody',
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&h=1200&fit=crop',
    },
    {
      id: 'demo3',
      titre: 'Solo Studio',
      description: 'Cabine d\'enregistrement individuelle. Parfait pour voix off, podcasts solo et audiobooks.',
      type: 'formation',
      prix: 45,
      lieu: 'Abidjan, Marcory',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&h=1200&fit=crop',
    },
    {
      id: 'demo4',
      titre: 'Video Studio',
      description: 'Plateau multi-caméras avec fond neutre. Pensé pour le podcast filmé et les tournages de contenu.',
      type: 'vidéo',
      prix: 80,
      lieu: 'Abidjan, Plateau',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&h=1200&fit=crop',
    },
    {
      id: 'demo5',
      titre: 'Music Studio',
      description: 'Cabine acoustique traitée avec matériel professionnel. Idéal pour l\'enregistrement musical et le mix.',
      type: 'musique',
      prix: 70,
      lieu: 'Abidjan, Cocody',
      image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=900&h=1200&fit=crop',
    },
    {
      id: 'demo6',
      titre: 'Panel Studio',
      description: 'Grand espace jusqu\'à 8 personnes. Parfait pour tables rondes, débats et émissions à plusieurs voix.',
      type: 'atelier',
      prix: 95,
      lieu: 'Abidjan, Riviera',
      image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=900&h=1200&fit=crop',
    },
  ]

  const displayFormations = formations && formations.length > 0 ? formations : demoFormations

  const [active, setActive] = useState(0)
  const total = displayFormations.length
  const touchStartX = useRef(null)
  const autoPlayInterval = useRef(null)

  // Boucle infinie sans pause - changement toutes les 3 secondes
  useEffect(() => {
    if (loading || total === 0) return

    // Démarrer l'auto-play
    autoPlayInterval.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total)
    }, 3000)

    // Nettoyer l'intervalle au démontage
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current)
      }
    }
  }, [loading, total])

  // Réinitialiser l'auto-play quand l'utilisateur interagit
  const resetAutoPlay = useCallback(() => {
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current)
      autoPlayInterval.current = setInterval(() => {
        setActive((prev) => (prev + 1) % total)
      }, 3000)
    }
  }, [total])

  const goTo = useCallback(
    (index) => {
      const newIndex = ((index % total) + total) % total
      setActive(newIndex)
      resetAutoPlay()
    },
    [total, resetAutoPlay]
  )

  const next = useCallback(() => {
    goTo(active + 1)
  }, [active, goTo])

  const prev = useCallback(() => {
    goTo(active - 1)
  }, [active, goTo])

  // Distance circulaire la plus courte entre une carte et la carte active
  const getOffset = (index) => {
    let diff = index - active
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return diff
  }

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 50) prev()
    else if (delta < -50) next()
    touchStartX.current = null
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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

        {/* Carrousel 3D */}
        {loading ? (
          <div className="h-[420px] md:h-[480px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-dice-blue/20 border-t-dice-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Scène 3D */}
            <div
              className="relative h-[420px] md:h-[480px] flex items-center justify-center"
              style={{ perspective: '1600px' }}
            >
              {displayFormations.map((formation, index) => {
                const offset = getOffset(index)
                const isActive = offset === 0
                const absOffset = Math.abs(offset)

                // Cartes trop éloignées : masquées
                if (absOffset > 2) return null

                const Icon = typeIcons[formation.type] || typeIcons.default

                const translateX = offset * 62 // en %
                const scale = isActive ? 1 : absOffset === 1 ? 0.78 : 0.6
                const rotateY = isActive ? 0 : offset < 0 ? 38 : -38
                const zIndex = 10 - absOffset
                const opacity = isActive ? 1 : absOffset === 1 ? 0.85 : 0.45
                const blur = isActive ? 0 : absOffset === 1 ? 0.5 : 1.5

                return (
                  <motion.div
                    key={formation.id}
                    className="absolute w-[240px] md:w-[300px] h-[380px] md:h-[440px] cursor-pointer select-none"
                    style={{ zIndex }}
                    animate={{
                      x: `${translateX}%`,
                      scale,
                      rotateY,
                      opacity,
                    }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    onClick={() => !isActive && goTo(index)}
                  >
                    <div
                      className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                      style={{
                        filter: `blur(${blur}px)`,
                        boxShadow: isActive
                          ? '0 25px 60px rgba(10, 137, 242, 0.35)'
                          : '0 15px 30px rgba(0,0,0,0.25)',
                      }}
                    >
                      {/* Image de fond */}
                      <img
                        src={formation.image}
                        alt={formation.titre}
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                      />

                      {/* Dégradé sombre pour lisibilité */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

                      {/* Reflet bleu Diamond Centre */}
                      <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/25 via-transparent to-transparent mix-blend-overlay" />

                      {/* Icône type - haut gauche */}
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
                        <Icon className="text-white text-sm" />
                      </div>

                      {/* Prix - haut droit */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25">
                        <span className="text-white text-sm font-bold">{formation.prix}€</span>
                      </div>

                      {/* Contenu bas */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        <AnimatePresence mode="wait">
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.3, delay: 0.15 }}
                            >
                              <p className="text-white/70 text-xs mb-2 flex items-center gap-1.5">
                                <FaMapMarker className="text-[10px]" />
                                {formation.lieu}
                              </p>
                              <p className="text-white/85 text-sm leading-snug line-clamp-2 mb-3">
                                {formation.description}
                              </p>
                              <Link href={`/events/${formation.id}`}>
                                <button className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-dice-blue/80 hover:bg-dice-blue backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
                                  En savoir plus
                                  <FaArrowRight className="text-xs" />
                                </button>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <h3
                          className={`font-bold text-white drop-shadow-lg ${
                            isActive ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
                          } ${isActive ? 'mb-0' : ''}`}
                        >
                          {formation.titre}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Flèche précédente - Bleu Diamond Centre */}
            <button
              onClick={prev}
              aria-label="Studio précédent"
              className="absolute left-1 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-dice-blue to-dice-blue-dark text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              <FaChevronLeft />
            </button>

            {/* Flèche suivante - Bleu Diamond Centre */}
            <button
              onClick={next}
              aria-label="Studio suivant"
              className="absolute right-1 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-dice-blue to-dice-blue-dark text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Indicateurs / dots */}
        {!loading && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {displayFormations.map((formation, index) => (
              <button
                key={formation.id}
                onClick={() => goTo(index)}
                aria-label={`Aller au studio ${formation.titre}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === active ? 'w-8 bg-dice-blue' : 'w-2 bg-dice-blue/25 hover:bg-dice-blue/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bouton "Voir toutes les formations" */}
        {displayFormations && displayFormations.length > 0 && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/events">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-dice-blue shadow-lg hover:shadow-xl hover:bg-dice-blue-dark transition-all">
                Voir toutes nos formations
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}