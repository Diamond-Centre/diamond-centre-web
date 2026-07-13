/**
 * Section Hero de la page À propos - Version responsive sans icônes
 */
'use client'

import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function AboutHero({ onVideoClick }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 min-h-[80vh] md:min-h-[70vh] lg:min-h-[60vh] flex items-center">
      {/* Effets de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[500px] lg:w-[700px] xl:w-[900px] h-[200px] sm:h-[300px] md:h-[500px] lg:h-[700px] xl:h-[900px] bg-dice-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 md:bottom-0 md:right-0 w-[150px] sm:w-[200px] md:w-[300px] lg:w-[400px] h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 md:top-0 md:left-0 w-[150px] sm:w-[200px] md:w-[300px] lg:w-[400px] h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px] bg-blue-300/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Texte - Version mobile centrée, desktop alignée à gauche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Badge */}
            <div className="flex justify-center lg:justify-start">
              <Badge variant="default" className="mb-3 sm:mb-4 inline-block text-xs sm:text-sm">
                À propos
              </Badge>
            </div>

            {/* Titre - Tailles progressives */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 leading-tight">
              <span className="block">Diamond Centre</span>
              <span className="gradient-text block">L'excellence</span>
              <span className="text-gray-600 block text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-1">
                depuis 2015
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm xs:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Nous sommes une structure dédiée au développement personnel et professionnel, 
              offrant des formations, conférences et séminaires d'excellence.
            </p>

            {/* Bouton CTA */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <Button 
                variant="primary" 
                size="large" 
                onClick={onVideoClick}
                className="text-sm sm:text-base px-5 sm:px-6 md:px-8 py-3 sm:py-4"
              >
                <FaPlay className="mr-2 text-xs sm:text-sm" />
                Découvrir notre histoire
              </Button>
            </div>
          </motion.div>

          {/* Image/Illustration - Version sans icônes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2 mx-auto w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px]"
          >
            {/* Conteneur de l'image */}
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
              {/* Fond avec dégradé */}
              <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/20 via-dice-blue/10 to-purple-600/20" />
              
              {/* Éléments décoratifs - Sans icônes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {/* Grand texte Diamond Centre */}
                  <div className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-800/20 leading-tight">
                    DC
                  </div>
                  <div className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-500/30 mt-2 sm:mt-3">
                    Diamond Centre
                  </div>
                </div>
              </div>

              {/* Effet glassmorphisme */}
              <div className="absolute inset-0 glass-white rounded-2xl sm:rounded-3xl" />
              
              {/* Bordure */}
              <div className="absolute inset-0 border border-white/30 rounded-2xl sm:rounded-3xl" />
            </div>

            {/* Badge flottant - Sans icône */}
            <motion.div
              className="absolute -bottom-2 -right-2 xs:-bottom-3 xs:-right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 glass-dark rounded-xl sm:rounded-2xl p-2 xs:p-2.5 sm:p-3 md:p-4 border border-white/10 shadow-lg"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                {/* Texte du badge - Sans icône */}
                <div className="min-w-[60px] xs:min-w-[70px] sm:min-w-[80px] md:min-w-[100px]">
                  <div className="text-white font-bold text-xs xs:text-sm sm:text-base leading-tight">
                    Diamond Centre
                  </div>
                  <div className="text-white/60 text-[8px] xs:text-[10px] sm:text-xs">
                    Depuis 2015
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}