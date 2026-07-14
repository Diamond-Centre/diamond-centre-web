/**
<<<<<<< HEAD
 * Composant carousel réutilisable avec style glassmorphisme
=======
 * Composant carousel - Version très grande
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
 */
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaChevronLeft, 
  FaChevronRight,
  FaCircle,
  FaRegCircle,
  FaPlay
} from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function Carousel({ 
  items,
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  showIndicators = true,
  onVideoClick,
  className,
  ...props 
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  // Auto-slide
  useEffect(() => {
    let timeout
    if (isAutoPlaying) {
      timeout = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % items.length)
      }, interval)
    }
    return () => clearTimeout(timeout)
  }, [isAutoPlaying, currentSlide, items.length, interval])

  // Navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Pause sur hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <div 
<<<<<<< HEAD
      className={cn('relative rounded-2xl overflow-hidden', className)}
=======
      className={cn('relative w-full h-full overflow-hidden', className)}
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
<<<<<<< HEAD
      <div className="relative aspect-video bg-gradient-to-br from-dice-blue/20 to-purple-500/20">
=======
      <div className="relative w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
<<<<<<< HEAD
            className="relative w-full h-full"
=======
            className="absolute inset-0 w-full h-full"
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
          >
            <Image
              src={items[currentSlide].src}
              alt={items[currentSlide].alt}
<<<<<<< HEAD
              width={600}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
            
            {/* Overlay glassmorphisme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Texte superposé avec glass */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-dark rounded-xl p-4 inline-block">
                <motion.h3 
                  className="text-white text-xl font-bold mb-1"
=======
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay gradiant léger */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Texte superposé avec glass - Agrandi */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="glass-dark rounded-xl p-6 inline-block border border-white/10">
                <motion.h3 
                  className="text-white text-2xl md:text-3xl font-bold mb-2"
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {items[currentSlide].title}
                </motion.h3>
                <motion.p 
<<<<<<< HEAD
                  className="text-white/80 text-sm"
=======
                  className="text-white/80 text-base md:text-lg"
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {items[currentSlide].description}
                </motion.p>
              </div>
            </div>

<<<<<<< HEAD
            {/* Bouton vidéo glassmorphisme */}
            {items[currentSlide].videoUrl && onVideoClick && (
              <motion.button
                onClick={() => onVideoClick(items[currentSlide].videoUrl)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 glass-dark rounded-full flex items-center justify-center border-2 border-white/30 hover:border-white/50 transition-all group"
=======
            {/* Bouton vidéo - Plus grand */}
            {items[currentSlide].videoUrl && onVideoClick && (
              <motion.button
                onClick={() => onVideoClick(items[currentSlide].videoUrl)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 glass-dark rounded-full flex items-center justify-center border-2 border-white/30 hover:border-white/50 transition-all group"
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
<<<<<<< HEAD
                <FaPlay className="text-white text-2xl ml-1 group-hover:scale-110 transition-transform" />
=======
                <FaPlay className="text-white text-4xl ml-1 group-hover:scale-110 transition-transform" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Badges glassmorphisme */}
<<<<<<< HEAD
        <div className="absolute top-4 left-4 glass-dark rounded-xl p-2 border border-white/10">
          <div className="flex items-center gap-2 text-white text-xs">
=======
        <div className="absolute top-6 left-6 glass-dark rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-white text-sm">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
            <span>⭐ 4.9/5</span>
          </div>
        </div>

<<<<<<< HEAD
        <div className="absolute bottom-4 right-4 glass-dark rounded-xl p-2 border border-white/10">
          <div className="flex items-center gap-2 text-white text-xs">
=======
        <div className="absolute bottom-6 right-6 glass-dark rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-white text-sm">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
            <span>🏆 20+ Experts</span>
          </div>
        </div>

        {/* Indicateurs glassmorphisme */}
        {showIndicators && (
<<<<<<< HEAD
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 glass-dark rounded-full px-3 py-1.5 border border-white/10">
=======
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 glass-dark rounded-full px-4 py-2 border border-white/10">
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="focus:outline-none transition-all"
              >
                {index === currentSlide ? (
                  <FaCircle className="text-white text-xs" />
                ) : (
                  <FaRegCircle className="text-white/50 text-xs hover:text-white/80 transition-colors" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Flèches glassmorphisme */}
=======
      {/* Flèches glassmorphisme - Plus grandes */}
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
      {showArrows && (
        <>
          <button
            onClick={prevSlide}
<<<<<<< HEAD
            className="absolute left-4 top-1/2 -translate-y-1/2 glass-dark p-3 rounded-full hover:glass-hover transition-all border border-white/10"
          >
            <FaChevronLeft className="text-white text-lg" />
=======
            className="absolute left-6 top-1/2 -translate-y-1/2 glass-dark p-4 rounded-full hover:glass-hover transition-all border border-white/10 z-10"
          >
            <FaChevronLeft className="text-white text-2xl" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
          </button>

          <button
            onClick={nextSlide}
<<<<<<< HEAD
            className="absolute right-4 top-1/2 -translate-y-1/2 glass-dark p-3 rounded-full hover:glass-hover transition-all border border-white/10"
          >
            <FaChevronRight className="text-white text-lg" />
=======
            className="absolute right-6 top-1/2 -translate-y-1/2 glass-dark p-4 rounded-full hover:glass-hover transition-all border border-white/10 z-10"
          >
            <FaChevronRight className="text-white text-2xl" />
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
          </button>
        </>
      )}
    </div>
  )
}