/**
 * Section Quote de la page À propos - Version premium, minimaliste et cinématique
 */
'use client'

import { motion } from 'framer-motion'
import { FaQuoteRight } from 'react-icons/fa'
import Container from '@/components/ui/Container'

export default function AboutQuote() {
  return (
    <section className="relative py-32 md:py-48 bg-[#040d21] overflow-hidden text-white border-y border-white/5">
      {/* Background Layer with Primitives */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Crystal Grid */}
        <div className="about-crystal-grid opacity-30" />
        
        {/* Ambient Glowing Orbs */}
        <div className="about-glow-orb about-glow-orb-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] opacity-40" />
      </div>

      {/* Massive Background Quote Mark Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0 opacity-[0.02]">
        <FaQuoteRight className="text-[40vw] text-white" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Philosophie Glass Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-white border border-white/10 text-white/80 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-semibold tracking-widest uppercase">
              Notre Philosophie
            </div>
          </motion.div>

          {/* Large emotional Quote Text */}
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-normal sm:leading-relaxed md:leading-loose text-white mb-8"
          >
            " Nous ne formons pas seulement des <span className="gradient-text">professionnels</span>.<br className="hidden sm:inline" /> Nous révélons des <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#c084fc] font-light italic">leaders</span>. "
          </motion.blockquote>

          {/* Quote Author */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-8 h-px bg-white/20" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#0a89f2] uppercase">
              Diamond Centre
            </span>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
