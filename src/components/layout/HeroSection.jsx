'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { FaArrowRight } from 'react-icons/fa'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&crop=center'

export default function HeroSection() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        imageRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8 }
      )
        .fromTo(
          '.reveal-text',
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1, stagger: 0.12 },
          '-=1.2'
        )
        .fromTo(
          '.fade-in-up',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
          '-=0.6'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e) => {
    if (!imageRef.current) return
    const { clientX, clientY } = window.innerWidth ? e : { clientX: 0, clientY: 0 }
    const xPos = (clientX / window.innerWidth - 0.5) * 20
    const yPos = (clientY / window.innerHeight - 0.5) * 20

    gsap.to(imageRef.current, {
      x: xPos,
      y: yPos,
      duration: 1,
      ease: 'power2.out',
    })
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#03070C]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imageRef} className="absolute -inset-10 h-[120%] w-[120%]">
          <Image
            src={HERO_IMAGE}
            alt="Public lors d’une conférence Diamond Centre"
            fill
            priority
            className="object-cover object-center grayscale-[20%] contrast-[110%]"
            sizes="110vw"
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-[#03070C]/35" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-8 md:pb-28">
        <div className="max-w-4xl">

          <div className="overflow-hidden mb-6">
            <div className="reveal-text inline-flex items-center gap-3 border-l-2 border-white/60 pl-3 text-xs font-mono uppercase tracking-widest text-white/70">
              Diamond Centre — Édition 2026
            </div>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl lg:leading-[1.05]">
            <div className="overflow-hidden py-1">
              <span className="reveal-text block">Conférences, séminaires</span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="reveal-text block font-light italic text-[#0A89F2]">
                et formations <span className="not-italic text-white font-black">pour révéler</span>
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="reveal-text block">votre potentiel.</span>
            </div>
          </h1>

          <p className="fade-in-up mt-6 max-w-xl text-lg leading-relaxed text-white/60 font-normal sm:text-xl opacity-0">
            L’excellence DiCe, au service de votre parcours personnel et professionnel.
          </p>

          {/* Boutons d'action */}
          <div className="fade-in-up mt-10 flex flex-wrap items-center gap-4 opacity-0">
            <Link
              href="/events"
              className="group relative inline-flex items-center gap-3 bg-[#0A89F2] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0770cc] hover:px-9"
            >
              <span>Voir les événements</span>
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/5"
            >
              Qui sommes-nous
            </Link>
          </div>

        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  )
}