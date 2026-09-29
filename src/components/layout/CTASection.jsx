/**
 * CTA « Rejoignez la communauté » — refonte DiCe
 * Mêmes destinations que l'ancienne version : inscription + programmes.
 */
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowRight } from 'react-icons/fi'
import SafeImage from '@/components/home/SafeImage'
import { HOME_IMAGES } from '@/lib/homeImages'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const AVATARS = [
  { src: HOME_IMAGES.speakers.kofi, bg: 'from-[#5a3a2a] to-[#1a1a1a]' },
  { src: HOME_IMAGES.speakers.ngozi, bg: 'from-[#c2722a] to-[#3a2a1a]' },
  { src: HOME_IMAGES.speakers.amina, bg: 'from-[#8a2a3a] to-[#2a0a14]' },
  { src: HOME_IMAGES.speakers.jeanBaptiste, bg: 'from-[#8a8f99] to-[#2a3040]' },
]

export default function CTASection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        scrollTrigger: { trigger: section, start: 'top 62%' },
      })

      tl.fromTo('[data-cta-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0 }, 0)
        .fromTo('[data-cta-label]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .fromTo(
          '[data-cta-line]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.13 },
          0.2
        )
        .fromTo(
          '[data-cta-fade]',
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
          0.85
        )
        .fromTo(
          '[data-cta-avatar]',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'back.out(2)' },
          1.3
        )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="communaute"
      ref={sectionRef}
      className="dice-dark-grid relative overflow-hidden bg-[#04091e] py-[130px] font-outfit text-white"
    >
      {/* Halo central */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2">
        <div className="dice-glow-breathe h-full w-full rounded-full bg-[radial-gradient(ellipse,rgba(29,78,216,0.28),transparent_68%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 text-center">
        <div className="flex items-center gap-4">
          <span data-cta-rule className="h-px w-8 origin-right bg-[#2f6dff]" />
          <span
            data-cta-label
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f6dff]"
          >
            Communauté
          </span>
          <span data-cta-rule className="h-px w-8 origin-left bg-[#2f6dff]" />
        </div>

        <h2
          className="mt-[34px] font-barlow font-extrabold uppercase leading-[0.88] tracking-[0.005em]"
          style={{ fontSize: 'var(--dice-cta-title)' }}
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-cta-line className="dice-title-white block">
              Rejoignez
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-cta-line className="dice-title-blue block">
              La communauté
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-cta-line className="dice-title-white block">
              Diamond Centre
            </span>
          </span>
        </h2>

        <p
          data-cta-fade
          className="mt-[38px] max-w-[500px] text-[16px] leading-[27px] text-[#7d88a3]"
        >
          Plus de 10 000 professionnels africains ont déjà rejoint un écosystème d&apos;opportunités,
          de mentorat et d&apos;excellence. Le prochain, c&apos;est vous.
        </p>

        <div data-cta-fade className="mt-[52px] flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group inline-flex h-[49px] items-center gap-3 rounded-[3px] bg-gradient-to-r from-[#0a5cff] to-[#2a7bff] px-8 text-[13px] font-semibold uppercase tracking-[0.04em] text-white shadow-[0_12px_32px_-10px_rgba(10,92,255,0.8)] transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(10,92,255,1)]"
          >
            S&apos;inscrire gratuitement
            <FiArrowRight className="text-[15px] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/events"
            className="inline-flex h-[50px] items-center rounded-[3px] border border-white/15 px-8 text-[13px] font-medium uppercase tracking-[0.04em] text-[#c7d0e6] transition-all duration-300 hover:border-white/45 hover:bg-white/[0.04] hover:text-white"
          >
            Explorer les programmes
          </Link>
        </div>

        <div data-cta-fade className="mt-[58px] flex items-center gap-4">
          <div className="flex -space-x-2">
            {AVATARS.map((a, i) => (
              <span
                key={i}
                data-cta-avatar
                className={`relative block h-7 w-7 overflow-hidden rounded-full border-2 border-[#04091e] bg-gradient-to-br ${a.bg}`}
              >
                <SafeImage
                  src={a.src}
                  alt=""
                  className="h-full w-full object-cover object-top"
                />
              </span>
            ))}
          </div>
          <span className="text-[13px] text-[#5b6785]">
            +10 000 professionnels nous ont déjà rejoints
          </span>
        </div>
      </div>
    </section>
  )
}