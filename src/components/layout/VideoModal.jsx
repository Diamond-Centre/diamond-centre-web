/**
 * Modal vidéo réutilisable
 */
'use client'

import { AnimatePresence, motion } from 'framer-motion'

export default function VideoModal({ 
  isOpen, 
  onClose, 
  videoUrl,
  title = 'Vidéo'
}) {
  if (!isOpen || !videoUrl) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 rounded-full p-2 transition-all"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}