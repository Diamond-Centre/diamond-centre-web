/**
 * Composant carousel réutilisable avec style glassmorphisme
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
      className={cn('relative rounded-2xl overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="relative aspect-video bg-gradient-to-br from-dice-blue/20 to-purple-500/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={items[currentSlide].src}
              alt={items[currentSlide].alt}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {items[currentSlide].title}
                </motion.h3>
                <motion.p 
                  className="text-white/80 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {items[currentSlide].description}
                </motion.p>
              </div>
            </div>

            {/* Bouton vidéo glassmorphisme */}
            {items[currentSlide].videoUrl && onVideoClick && (
              <motion.button
                onClick={() => onVideoClick(items[currentSlide].videoUrl)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 glass-dark rounded-full flex items-center justify-center border-2 border-white/30 hover:border-white/50 transition-all group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <FaPlay className="text-white text-2xl ml-1 group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Badges glassmorphisme */}
        <div className="absolute top-4 left-4 glass-dark rounded-xl p-2 border border-white/10">
          <div className="flex items-center gap-2 text-white text-xs">
            <span>⭐ 4.9/5</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 glass-dark rounded-xl p-2 border border-white/10">
          <div className="flex items-center gap-2 text-white text-xs">
            <span>🏆 20+ Experts</span>
          </div>
        </div>

        {/* Indicateurs glassmorphisme */}
        {showIndicators && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 glass-dark rounded-full px-3 py-1.5 border border-white/10">
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

      {/* Flèches glassmorphisme */}
      {showArrows && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 glass-dark p-3 rounded-full hover:glass-hover transition-all border border-white/10"
          >
            <FaChevronLeft className="text-white text-lg" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 glass-dark p-3 rounded-full hover:glass-hover transition-all border border-white/10"
          >
            <FaChevronRight className="text-white text-lg" />
          </button>
        </>
      )}
    </div>
  )
}