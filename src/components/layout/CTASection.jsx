/**
 * CTA Final Accueil — Refonte Haute-Performance GSAP ScrollTrigger & Micro-Interactions
 */
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { n: '01', label: 'Créez votre compte' },
  { n: '02', label: 'Choisissez un événement' },
  { n: '03', label: 'Réservez votre place' },
]

export default function CTASection() {
  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const stepsRef = useRef(null)
  const bgGlowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Apparition fluide de la colonne gauche (Textes & Boutons)
      gsap.fromTo(
        leftColRef.current ? leftColRef.current.children : [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      // 2. Cascade dynamique des étapes à droite
      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.children,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 80%',
            },
          }
        )
      }

      // 3. Respiration continue de l'arrière-plan lumineux (Ambient Glow)
      gsap.to(bgGlowRef.current, {
        scale: 1.25,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0A89F2] py-20 text-white md:py-28">
      {/* Halo d'ambiance avec animation de respiration continuous via GSAP */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.22),_transparent_60%)]" />
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#0057C2]/50 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-12 px-6 sm:px-8 md:flex-row md:items-end md:gap-16">

        {/* Colonne gauche — Contenu principal */}
        <div ref={leftColRef} className="max-w-xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-white/70" />
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.22em] text-white/90">
              Rejoignez DiCe
            </p>
          </div>

          <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl">
            Prêt à écrire <br />
            <span className="font-light italic text-white/85">la suite ?</span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 font-normal sm:text-lg">
            Créez votre compte et réservez votre prochaine formation ou conférence en quelques minutes.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#0A89F2] shadow-[0_14px_32px_rgba(11,18,32,0.18)] transition-all duration-300 hover:bg-white/95"
              >
                <span>Commencer</span>
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/20"
              >
                Voir le programme
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Colonne droite — Étapes interactives */}
        <ol
          ref={stepsRef}
          className="w-full max-w-xs space-y-0 border-l border-white/25 md:mb-2"
        >
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.2 }}
              className="group cursor-default flex items-start gap-4 py-5 pl-6 transition-colors duration-300 first:pt-0 last:pb-0"
            >
              <span className="pt-0.5 text-xs font-mono font-bold tabular-nums text-white/90 group-hover:text-white">
                {step.n}
              </span>
              <div>
                <p className="text-base font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
                  {step.label}
                </p>
                {i < steps.length - 1 ? (
                  <span className="mt-4 block h-px w-16 bg-white/20 transition-all duration-300 group-hover:w-24 group-hover:bg-white/40" />
                ) : null}
              </div>
            </motion.li>
          ))}
        </ol>

      </div>
    </section>
  )
}
