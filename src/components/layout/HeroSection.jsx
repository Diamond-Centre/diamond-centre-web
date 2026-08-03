/**
 * Hero Accueil — full-bleed, brand en typographie (logo = navbar uniquement)
 */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&crop=center'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#050A12]">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Public lors d’une conférence Diamond Centre"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[#050A12]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-[#050A12]/50 to-[#050A12]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050A12]/80 via-[#050A12]/35 to-transparent" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-[50%] -translate-x-1/2 rounded-full bg-[#0A89F2]/20 blur-[80px]"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1]"
          >
            Conférences, séminaires et formations
            <span className="text-white/70"> pour révéler votre potentiel.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55 }}
            className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg"
          >
            L’excellence DiCe, au service de votre parcours personnel et
            professionnel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0A89F2] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(10,137,242,0.45)] transition hover:bg-[#0770cc]"
            >
              Voir les événements
              <FaArrowRight className="text-xs transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/35 hover:bg-white/10"
            >
              Qui sommes-nous
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom edge line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  )
}
