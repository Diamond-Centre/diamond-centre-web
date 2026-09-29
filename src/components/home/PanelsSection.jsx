/**
 * Panneaux plein écran (Formations / Conférences / Ateliers / Réseautage)
 * Section épinglée : le scroll pilote la transition entre panneaux
 * (fond en fondu, titre qui glisse en Y, description, index 01→04, segments).
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SafeImage from '@/components/home/SafeImage'
import { HOME_IMAGES } from '@/lib/homeImages'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PANELS = [
  {
    n: '01',
    title: 'FORMATIONS',
    text: 'Des compétences concrètes, exigeantes et immédiatement applicables pour accélérer votre évolution.',
    image: HOME_IMAGES.panels.formations,
  },
  {
    n: '02',
    title: 'CONFÉRENCES',
    text: 'Des voix qui déplacent les lignes, des idées fortes et des échanges qui ouvrent de nouvelles perspectives.',
    image: HOME_IMAGES.panels.conferences,
  },
  {
    n: '03',
    title: 'ATELIERS',
    text: 'Des sessions pratiques et interactives pour transformer les idées en savoir-faire, ensemble.',
    image: HOME_IMAGES.panels.ateliers,
  },
  {
    n: '04',
    title: 'RÉSEAUTAGE',
    text: 'Des rencontres utiles, une communauté engagée et des connexions capables de faire naître les prochaines opportunités.',
    image: HOME_IMAGES.panels.reseautage,
  },
]

const COUNT = PANELS.length

export default function PanelsSection() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      const bgs = gsap.utils.toArray('[data-bg]')
      const imgs = gsap.utils.toArray('[data-bg-img]')
      const titles = gsap.utils.toArray('[data-title]')
      const descs = gsap.utils.toArray('[data-desc]')
      const labels = gsap.utils.toArray('[data-label]')

      // État initial : seul le panneau 1 est visible
      gsap.set(bgs.slice(1), { opacity: 0 })
      gsap.set(titles.slice(1), { opacity: 0, y: 110 })
      gsap.set(descs.slice(1), { opacity: 0, y: 30 })
      gsap.set(labels.slice(1), { opacity: 0, y: 20 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(COUNT - 1) * 100}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const t = self.animation ? self.animation.time() : 0
            const idx = Math.max(0, Math.min(COUNT - 1, Math.floor(t + 0.45)))
            setActive((prev) => (prev === idx ? prev : idx))
          },
        },
      })

      for (let i = 1; i < COUNT; i++) {
        const at = i - 0.75
        const d = 0.6

        // Fonds
        tl.to(bgs[i - 1], { opacity: 0, duration: d }, at)
        tl.to(bgs[i], { opacity: 1, duration: d }, at)
        if (imgs[i]) {
          tl.fromTo(imgs[i], { scale: 1.14 }, { scale: 1, duration: d + 0.4, ease: 'power2.out' }, at)
        }

        // Titres : sortant vers le haut, entrant depuis le bas (chevauchement)
        tl.to(titles[i - 1], { opacity: 0, y: -110, duration: d }, at)
        tl.to(titles[i], { opacity: 1, y: 0, duration: d }, at + 0.05)

        // Descriptions + étiquettes
        tl.to(descs[i - 1], { opacity: 0, y: -30, duration: d * 0.8 }, at)
        tl.to(descs[i], { opacity: 1, y: 0, duration: d * 0.8 }, at + 0.15)
        tl.to(labels[i - 1], { opacity: 0, y: -20, duration: d * 0.8 }, at)
        tl.to(labels[i], { opacity: 1, y: 0, duration: d * 0.8 }, at + 0.1)
      }

      // Fixe la durée totale à COUNT - 1 (les derniers 0.15 servent de « pause »)
      tl.set({}, {}, COUNT - 1)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="programme"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#020817] font-outfit text-white"
    >
      {/* ------------------------------ Fonds ------------------------------ */}
      {PANELS.map((p, i) => (
        <div key={p.title} data-bg className="absolute inset-0">
          {p.image ? (
            <>
              <div className="absolute inset-0 bg-[#0a1a3a]" />
              <div data-bg-img className="absolute inset-0 will-change-transform">
                <SafeImage
                  src={p.image}
                  alt=""
                  eager={i === 0}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.62)_0%,rgba(2,8,23,0.5)_45%,rgba(2,8,23,0.82)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.55)_0%,transparent_60%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b2557_0%,#08194a_55%,#050e2a_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_72%_30%,rgba(37,99,235,0.35),transparent_65%)]" />
              <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
            </>
          )}
        </div>
      ))}

      {/* ------------------------------ Contenus ------------------------------ */}
      <div className="absolute inset-0 mx-auto w-full max-w-[1280px] px-6">
        {PANELS.map((p) => (
          <div key={p.n}>
            <div
              data-label
              className="absolute left-[30px] top-[15vh] flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.3em]"
            >
              <span className="text-[#2b6bff]">{p.n}</span>
              <span className="h-px w-11 bg-[#2b6bff]/70" />
              <span className="text-white/70">Diamond Centre</span>
            </div>

            <h2
              data-title
              className="absolute left-[19px] top-[calc(15vh+20px)] whitespace-nowrap font-anton uppercase leading-[0.88] tracking-[-0.03em] text-white"
              style={{ fontSize: 'var(--dice-panel-title)' }}
            >
              {p.title}
            </h2>

            <p
              data-desc
              className="absolute bottom-[26px] left-[30px] max-w-[440px] text-[clamp(1rem,1.2vw,1.4rem)] font-light leading-[1.6] text-white/90"
            >
              {p.text}
            </p>
          </div>
        ))}

        {/* Index vertical 01 / 04 */}
        <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-white/90 md:flex">
          <span>{String(active + 1).padStart(2, '0')}</span>
          <span className="relative block h-[60px] w-px bg-white/25">
            <span
              className="absolute left-0 top-0 w-px bg-white transition-all duration-500"
              style={{ height: `${((active + 1) / COUNT) * 100}%` }}
            />
          </span>
          <span className="text-white/60">{String(COUNT).padStart(2, '0')}</span>
        </div>

        {/* Segments de progression */}
        <div className="absolute bottom-[36px] right-[36px] flex items-center gap-2">
          {PANELS.map((p, i) => (
            <span
              key={p.n}
              className={`h-[2px] transition-all duration-500 ${
                i === active ? 'w-[58px] bg-[#2b6bff]' : 'w-[26px] bg-white/35'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}