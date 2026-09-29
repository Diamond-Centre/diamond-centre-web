/**
 * « Intervenants » — refonte DiCe
 * Cartes portrait avec survol : la carte se soulève et grossit légèrement,
 * halo bleu, le nom remonte et la ligne de bas de carte s'étire.
 */
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SafeImage from '@/components/home/SafeImage'
import { HOME_IMAGES } from '@/lib/homeImages'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SPEAKERS = [
  {
    tag: 'LEADERSHIP',
    name: 'Dr. Kofi Mensah',
    role: 'Directeur Exécutif, Leadership Institute Africa',
    image: HOME_IMAGES.speakers.kofi,
    tint: 'from-[#0a3a5c] to-[#0a1330]',
  },
  {
    tag: 'STRATÉGIE',
    name: 'Amina Diallo',
    role: 'Experte en Transformation Organisationnelle',
    image: HOME_IMAGES.speakers.amina,
    tint: 'from-[#7a1f3d] to-[#1a0a20]',
  },
  {
    tag: 'MANAGEMENT',
    name: 'Jean-Baptiste Ouédraogo',
    role: 'Professeur en Management, HEC Paris',
    image: HOME_IMAGES.speakers.jeanBaptiste,
    tint: 'from-[#3b4350] to-[#0a1020]',
  },
  {
    tag: 'INNOVATION',
    name: 'Ngozi Adeyemi',
    role: 'CEO & Fondatrice, AfricaTech Ventures',
    image: HOME_IMAGES.speakers.ngozi,
    tint: 'from-[#b45a12] to-[#1a1020]',
  },
]

export default function SpeakersSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-head]',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 72%' },
        }
      )
      gsap.fromTo(
        '[data-speaker]',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.14,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-speakers-grid]', start: 'top 85%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="intervenants"
      ref={sectionRef}
      className="dice-light relative overflow-hidden py-[120px] font-outfit"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div data-head className="flex items-center gap-4">
              <span className="h-px w-8 bg-[#2f6dff]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f6dff]">
                Intervenants
              </span>
            </div>
            <h2
              data-head
              className="mt-[26px] font-barlow font-bold leading-[0.95] text-[#0a1330]"
              style={{ fontSize: 'var(--dice-h2-speakers)' }}
            >
              Des talents qui
              <br />
              <span className="text-[#2979ff]">façonnent demain.</span>
            </h2>
          </div>

          <Link
            data-head
            href="/about"
            className="mb-3 text-[13px] text-[#3b4a66] transition-colors hover:text-[#0a5cff]"
          >
            Voir tous les intervenants →
          </Link>
        </div>

        <div
          data-speakers-grid
          className="mt-[58px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SPEAKERS.map((s) => (
            <div key={s.name} data-speaker>
              <article className="group relative h-[410px] cursor-pointer overflow-hidden rounded-[26px] border-[1.5px] border-[#1d5dff] bg-[#050b24] shadow-[0_24px_50px_-30px_rgba(20,60,160,0.45)] transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.025] hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_36px_80px_-24px_rgba(37,99,235,0.7)]">
                {/* Dégradé de repli (visible si la photo est indisponible) */}
                <div className={`absolute inset-0 bg-gradient-to-b ${s.tint}`} />
                <SafeImage
                  src={s.image}
                  alt={s.name}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,22,0)_45%,rgba(3,8,22,0.78)_72%,rgba(3,8,22,0.96)_100%)]" />

                <span className="absolute left-4 top-4 rounded-[8px] border border-[#4f7bff]/70 bg-[#142a6b]/60 px-3 py-[6px] text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#cfe0ff] backdrop-blur-sm">
                  {s.tag}
                </span>

                <div className="absolute inset-x-0 bottom-0 px-[21px] pb-[22px]">
                  <div className="transition-transform duration-500 ease-out group-hover:-translate-y-[14px]">
                    <h3 className="font-barlow text-[24px] font-bold leading-[1.1] text-white">
                      {s.name}
                    </h3>
                    <p className="mt-[6px] text-[12px] leading-[17px] text-[#9aa7c2] transition-colors duration-500 group-hover:text-white">
                      {s.role}
                    </p>
                  </div>
                  <span className="mt-[14px] block h-[2px] w-20 bg-gradient-to-r from-[#2b6bff] to-transparent transition-all duration-700 ease-out group-hover:w-full" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}