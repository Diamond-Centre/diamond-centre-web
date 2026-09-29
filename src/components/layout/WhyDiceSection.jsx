/**
 * « Notre mission » — refonte DiCe
 * Animations : révélation de la photo par clip-path (arche → rectangle arrondi,
 * pilotée par le scroll), texte en fondu/montée, compteurs animés.
 *
 * Compteurs : recommencent à 0 à CHAQUE apparition de la section (que l'on
 * arrive en scrollant vers le bas, ou que l'on remonte puis redescende),
 * et non plus une seule fois (`once: true` supprimé).
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

const STATS = [
  { value: 10000, prefix: '+', suffix: '', label: 'personnes formées' },
  { value: 150, prefix: '', suffix: '+', label: 'événements organisés' },
  { value: 50, prefix: '', suffix: '+', label: 'experts internationaux' },
  { value: 8, prefix: '', suffix: ' ans', label: "d'impact en Afrique" },
]

const fmt = (n) => Math.round(n).toLocaleString('fr-FR')

export default function WhyDiceSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const counters = gsap.utils.toArray('[data-count]', section)

    if (reduce) {
      counters.forEach((el, i) => {
        const s = STATS[i]
        el.textContent = `${s.prefix}${fmt(s.value)}${s.suffix}`
      })
      return undefined
    }

    const ctx = gsap.context(() => {
      // Photo : arche -> rectangle arrondi, liée au scroll
      gsap.fromTo(
        '[data-photo]',
        { clipPath: 'inset(22% 18% 0% 18% round 220px 220px 16px 16px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 16px 16px 16px 16px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-photo]',
            start: 'top 96%',
            end: 'top 42%',
            scrub: true,
          },
        }
      )
      gsap.fromTo(
        '[data-photo-img]',
        { scale: 1.25 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-photo]',
            start: 'top 96%',
            end: 'top 30%',
            scrub: true,
          },
        }
      )

      // Repères en L
      gsap.fromTo(
        '[data-bracket]',
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-photo]', start: 'top 70%' },
        }
      )

      // Texte
      gsap.fromTo(
        '[data-reveal]',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-reveal]', start: 'top 80%' },
        }
      )

      // ------------------------------------------------------------------
      // Compteurs — relancés à ZÉRO à chaque entrée dans la section, dans
      // les deux sens de scroll (onEnter = on arrive en descendant,
      // onEnterBack = on revient en remontant puis redescend dessus).
      // ------------------------------------------------------------------
      counters.forEach((el, i) => {
        const s = STATS[i]
        const state = { v: 0 }
        let tween

        const restart = () => {
          tween?.kill()
          state.v = 0
          el.textContent = `${s.prefix}0${s.suffix}`
          tween = gsap.to(state, {
            v: s.value,
            duration: 2.4,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${s.prefix}${fmt(state.v)}${s.suffix}`
            },
          })
        }

        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          end: 'bottom top',
          onEnter: restart,
          onEnterBack: restart,
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="dice-light dice-light--alt relative overflow-hidden py-[120px] font-outfit"
    >
      <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-16 px-6 lg:grid-cols-[584px_1fr] lg:gap-x-16">
        {/* ------------------------------ Photo ------------------------------ */}
        <div className="relative lg:mt-[20px]">
          {/* Halo */}
          <div className="pointer-events-none absolute -inset-[70px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.65),transparent_68%)]" />

          {/* Repères en L */}
          <span
            data-bracket
            className="pointer-events-none absolute -left-4 -top-4 h-20 w-20 border-l border-t border-[#2d6bff]"
          />
          <span
            data-bracket
            className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 border-b border-r border-[#22d3ee]"
          />

          <div
            data-photo
            className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0a1e52,#1d4ed8)] shadow-[0_40px_70px_-30px_rgba(10,60,140,0.45)] sm:h-[520px]"
          >
            <div data-photo-img className="h-full w-full">
              <SafeImage
                src={HOME_IMAGES.mission.src}
                fallbackSrc={HOME_IMAGES.mission.fallback}
                alt="Un intervenant DiCe face à son public"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------ Texte ------------------------------ */}
        <div className="relative">
          <div data-reveal className="flex items-center gap-4">
            <span className="h-px w-8 bg-[#2f6dff]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f6dff]">
              Notre mission
            </span>
          </div>

          <h2
            data-reveal
            className="mt-[26px] font-barlow font-bold leading-[0.95] text-[#0a1330]"
            style={{ fontSize: 'var(--dice-h2-mission)' }}
          >
            L&apos;excellence au service
            <br />
            <span className="text-[#2979ff]">de vos ambitions.</span>
          </h2>

          <p data-reveal className="mt-6 max-w-[584px] text-[15.5px] leading-[26px] text-[#4a5a75]">
            Diamond Centre est un écosystème d&apos;apprentissage et de croissance professionnelle
            conçu pour les talents africains et les organisations qui souhaitent développer leur
            capital humain. À travers des formations certifiantes, des conférences internationales
            et des programmes de mentorat, nous accompagnons des milliers de professionnels vers
            l&apos;excellence.
          </p>

          <div data-reveal className="mt-10 grid grid-cols-2 gap-y-6">
            {STATS.map((s, i) => (
              <div key={s.label} className="border-l-2 border-[#2b6bff] pl-[18px]">
                <p
                  data-count
                  className="font-barlow text-[40px] font-bold leading-[1] text-[#2979ff]"
                >
                  {s.prefix}
                  {fmt(s.value)}
                  {s.suffix}
                </p>
                <p className="mt-2 text-[13px] text-[#5b6b85]">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            data-reveal
            href="/about"
            className="mt-[50px] inline-block border-b border-[#0a1330] pb-[2px] text-[12.5px] font-medium uppercase tracking-[0.06em] text-[#0a1330] transition-colors hover:border-[#0a5cff] hover:text-[#0a5cff]"
          >
            Notre histoire →
          </Link>
        </div>
      </div>
    </section>
  )
}