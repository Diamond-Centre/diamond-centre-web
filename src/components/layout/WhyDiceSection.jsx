/**
 * Pourquoi DiCe — Refonte Bento Grid Light avec Animations Avancées GSAP & Lenis
 */
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { FaArrowRight, FaShieldAlt, FaUsers, FaChartLine } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  {
    num: '01',
    title: 'Excellence',
    text: 'Des programmes exigeants animés par des experts reconnus pour garantir un apprentissage de premier plan.',
    icon: FaShieldAlt,
    colSpan: 'md:col-span-1 lg:col-span-7',
  },
  {
    num: '02',
    title: 'Communauté',
    text: 'Un réseau puissant de professionnels et d’apprenants engagés pour grandir ensemble.',
    icon: FaUsers,
    colSpan: 'md:col-span-1 lg:col-span-5',
  },
  {
    num: '03',
    title: 'Accompagnement',
    text: 'Un suivi concret, personnalisé et orienté résultats pour propulser vos projets vers le sommet.',
    icon: FaChartLine,
    colSpan: 'md:col-span-2 lg:col-span-12',
  },
]

export default function WhyDiceSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current.children,
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

      gsap.fromTo(
        '.bento-card',
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#F4F7FB] py-24 md:py-32 text-[#0B1220]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#0A89F2]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">

        <div ref={headerRef} className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 border-l-2 border-[#0A89F2] pl-3 text-xs font-mono uppercase tracking-widest text-[#0A89F2]">
              Pourquoi DiCe
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#0B1220] sm:text-4xl md:text-5xl lg:leading-[1.1]">
              L’excellence au service <br />
              <span className="font-light italic text-[#0A89F2]">de vos ambitions</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-base leading-relaxed text-[#667085]">
              Depuis des années, Diamond Centre accompagne celles et ceux qui veulent grandir — avec des formats concrets, inspirants et accessibles.
            </p>
            <Link
              href="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0A89F2] transition-all hover:gap-3"
            >
              <span>Notre histoire</span>
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.num}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`bento-card group relative overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white p-8 md:p-10 shadow-sm transition-colors duration-500 hover:border-[#0A89F2]/40 hover:shadow-md ${item.colSpan}`}
              >
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#0A89F2]/5 blur-3xl transition-all duration-500 group-hover:bg-[#0A89F2]/15" />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono font-bold text-[#0A89F2] px-3 py-1 rounded-full bg-[#0A89F2]/10 border border-[#0A89F2]/20">
                      {item.num}
                    </span>
                    <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <Icon className="text-2xl text-[#667085]/60 transition-colors duration-300 group-hover:text-[#0A89F2]" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#0B1220] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-[#667085] font-normal">
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
