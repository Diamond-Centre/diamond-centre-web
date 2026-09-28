/**
 * Hero DiCe — refonte
 *
 * Animations :
 * - révélation des lignes du titre
 * - arc SVG qui se dessine
 * - petit trait lumineux qui circule en boucle sur l'arc
 * - circulation inversée
 * - fondu doux aux extrémités de la boucle
 * - nœuds + libellés synchronisés
 * - diamant 3D flottant
 * - écriture « machine à écrire »
 * - indicateur de scroll animé
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import Diamond3D from '@/components/home/Diamond3D'

const SIGNATURE = 'Fulfil Your dreams…'

// Coordonnées dans le repère de la boîte visuelle (610 x 520)
const ARC_PATH =
  'M340,112 C380,82 420,52 458,50 C480,49 495,55 507,63 C525,75 536,95 535,118 C534,145 524,170 507,183 C490,196 480,222 480,250 C480,278 490,302 507,317'

/*
 * ================================================================
 * PARAMÈTRES DU TRAIT LUMINEUX
 * ================================================================
 *
 * Petit trait lumineux comme sur la capture.
 */
const TRAIL_LENGTH = 24
const TRAIL_WIDTH = 2.2
const TRAIL_GLOW_WIDTH = 8

/*
 * Durée d'un tour complet.
 */
const TRAIL_DURATION = 3.1

/*
 * Zone de fondu au début et à la fin.
 */
const FADE_ZONE = 0.10

const NODES = [
  {
    x: 507,
    y: 63,
    label: 'APPRENDRE',
  },
  {
    x: 507,
    y: 183,
    label: 'ÉVOLUER',
  },
  {
    x: 507,
    y: 317,
    label: 'RÉUSSIR',
  },
]

export default function HeroSection() {
  const rootRef = useRef(null)

  // Arc principal
  const pathRef = useRef(null)

  // Petit trait lumineux
  const trailRef = useRef(null)

  // Halo du trait lumineux
  const trailGlowRef = useRef(null)

  // Texte machine à écrire
  const typeRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    const trail = trailRef.current
    const trailGlow = trailGlowRef.current

    if (!root || !path || !trail || !trailGlow) {
      return undefined
    }

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

    const len = path.getTotalLength()

    const nodeEls = gsap.utils.toArray(
      '[data-node]',
      root
    )

    const labelEls = gsap.utils.toArray(
      '[data-node-label]',
      root
    )

    /*
     * ==============================================================
     * POSITION DES NŒUDS SUR L'ARC
     * ==============================================================
     */

    const fractions = NODES.map((n) => {
      let best = 0
      let bestD = Infinity

      for (let i = 0; i <= 300; i++) {
        const p = path.getPointAtLength(
          (len * i) / 300
        )

        const d =
          (p.x - n.x) ** 2 +
          (p.y - n.y) ** 2

        if (d < bestD) {
          bestD = d
          best = i / 300
        }
      }

      return best
    })

    /*
     * ==============================================================
     * MODE RÉDUCTION DES ANIMATIONS
     * ==============================================================
     */

    if (reduce) {
      path.style.strokeDasharray = 'none'
      path.style.strokeDashoffset = '0'

      trail.style.strokeDasharray =
        `${TRAIL_LENGTH} ${len}`

      trail.style.strokeDashoffset = '0'
      trail.style.opacity = '1'

      trailGlow.style.strokeDasharray =
        `${TRAIL_LENGTH} ${len}`

      trailGlow.style.strokeDashoffset = '0'
      trailGlow.style.opacity = '0.35'

      gsap.set(
        root.querySelectorAll(
          '[data-tag], [data-line], [data-diamond], [data-fade], [data-signature]'
        ),
        {
          opacity: 1,
          yPercent: 0,
          y: 0,
          scale: 1,
        }
      )

      gsap.set(
        [...nodeEls, ...labelEls],
        {
          opacity: 1,
          x: 0,
        }
      )

      if (typeRef.current) {
        typeRef.current.textContent =
          SIGNATURE
      }

      return undefined
    }

    /*
     * ==============================================================
     * GSAP CONTEXT
     * ==============================================================
     */

    const ctx = gsap.context(() => {
      /*
       * ============================================================
       * ARC PRINCIPAL
       * ============================================================
       */

      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`

      /*
       * ============================================================
       * TRAIT LUMINEUX
       * ============================================================
       */

      trail.style.strokeDasharray =
        `${TRAIL_LENGTH} ${len}`

      trail.style.strokeDashoffset =
        `${TRAIL_LENGTH}`

      trail.style.opacity = '0'

      /*
       * ============================================================
       * HALO
       * ============================================================
       */

      trailGlow.style.strokeDasharray =
        `${TRAIL_LENGTH} ${len}`

      trailGlow.style.strokeDashoffset =
        `${TRAIL_LENGTH}`

      trailGlow.style.opacity = '0'

      /*
       * ============================================================
       * TIMELINE PRINCIPALE
       * ============================================================
       */

      const tl = gsap.timeline({
        defaults: {
          ease: 'power4.out',
        },
      })

      /*
       * ------------------------------------------------------------
       * Étiquette supérieure
       * ------------------------------------------------------------
       */

      tl.fromTo(
        '[data-tag]',
        {
          opacity: 0,
          x: -16,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
        },
        0.1
      )

      /*
       * ------------------------------------------------------------
       * Titre
       * ------------------------------------------------------------
       */

      tl.fromTo(
        '[data-line]',
        {
          yPercent: 115,
          opacity: 1,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.14,
        },
        0.2
      )

      /*
       * ------------------------------------------------------------
       * Textes secondaires
       * ------------------------------------------------------------
       */

      tl.fromTo(
        '[data-fade]',
        {
          y: 28,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.14,
        },
        0.85
      )

      /*
       * ------------------------------------------------------------
       * Apparition du diamant
       * ------------------------------------------------------------
       */

      tl.fromTo(
        '[data-diamond]',
        {
          scale: 0.82,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
        },
        0.35
      )

      /*
       * ------------------------------------------------------------
       * Flottement permanent du diamant
       * ------------------------------------------------------------
       */

      gsap.to('[data-float]', {
        y: -12,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      /*
       * ============================================================
       * DESSIN INITIAL DE L'ARC
       * ============================================================
       */

      const shown = NODES.map(() => false)

      const prog = {
        v: 0,
      }

      tl.to(
        prog,
        {
          v: 1,

          duration: 3.2,

          ease: 'power1.inOut',

          onUpdate: () => {
            /*
             * Dessine progressivement l'arc.
             */

            path.style.strokeDashoffset =
              `${len * (1 - prog.v)}`

            /*
             * Synchronisation des nœuds.
             */

            fractions.forEach((f, i) => {
              if (
                !shown[i] &&
                prog.v >= f - 0.005
              ) {
                shown[i] = true

                gsap.to(
                  nodeEls[i],
                  {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                  }
                )

                gsap.fromTo(
                  labelEls[i],
                  {
                    opacity: 0,
                    x: -10,
                  },
                  {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                  }
                )
              }
            })
          },

          /*
           * ========================================================
           * LANCEMENT DE LA CIRCULATION
           * ========================================================
           */

          onComplete: () => {
            if (!trailRef.current) {
              return
            }

            gsap.set(
              trailRef.current,
              {
                opacity: 0,
              }
            )

            gsap.set(
              trailGlowRef.current,
              {
                opacity: 0,
              }
            )

            /*
             * ======================================================
             * BOUCLE DU TRAIT LUMINEUX
             * ======================================================
             *
             * IMPORTANT :
             *
             * La circulation est maintenant INVERSÉE.
             *
             * Avant :
             *
             *     TRAIL_LENGTH + len * loop.v
             *
             * Maintenant :
             *
             *     TRAIL_LENGTH - len * loop.v
             *
             * Le trait circule donc dans le sens opposé
             * sur le même arc.
             * ======================================================
             */

            const loop = {
              v: 0,
            }

            gsap.to(
              loop,
              {
                v: 1,

                duration: TRAIL_DURATION,

                ease: 'none',

                repeat: -1,

                onUpdate: () => {
                  if (
                    !trailRef.current ||
                    !trailGlowRef.current
                  ) {
                    return
                  }

                  /*
                   * ==================================================
                   * POSITION INVERSÉE
                   * ==================================================
                   *
                   * C'est cette ligne qui inverse le sens.
                   *
                   * Le trait va maintenant de la fin du chemin
                   * vers le début du chemin.
                   * ==================================================
                   */

                  const offset =
                    TRAIL_LENGTH -
                    len * loop.v

                  trailRef.current.style.strokeDashoffset =
                    `${offset}`

                  trailGlowRef.current.style.strokeDashoffset =
                    `${offset}`

                  /*
                   * ==================================================
                   * FONDU DE DÉBUT / FIN
                   * ==================================================
                   *
                   * On conserve le fondu pour éviter tout
                   * saut visible lorsque la boucle recommence.
                   * ==================================================
                   */

                  let opacity = 1

                  if (loop.v < FADE_ZONE) {
                    opacity =
                      loop.v /
                      FADE_ZONE
                  } else if (
                    loop.v >
                    1 - FADE_ZONE
                  ) {
                    opacity =
                      (1 - loop.v) /
                      FADE_ZONE
                  }

                  opacity =
                    Math.max(
                      0,
                      Math.min(
                        1,
                        opacity
                      )
                    )

                  /*
                   * Cœur lumineux.
                   */

                  trailRef.current.style.opacity =
                    String(opacity)

                  /*
                   * Halo plus discret.
                   */

                  trailGlowRef.current.style.opacity =
                    String(opacity * 0.42)
                },

                /*
                 * À chaque nouveau tour :
                 * on commence invisible puis le trait
                 * réapparaît progressivement.
                 */

                onRepeat: () => {
                  if (
                    trailRef.current &&
                    trailGlowRef.current
                  ) {
                    trailRef.current.style.opacity =
                      '0'

                    trailGlowRef.current.style.opacity =
                      '0'
                  }
                },
              }
            )
          },
        },
        1.0
      )

      /*
       * ============================================================
       * MACHINE À ÉCRIRE
       * ============================================================
       */

      const typed = {
        n: 0,
      }

      tl.fromTo(
        '[data-signature]',
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.6,
        },
        1.7
      )

      tl.to(
        typed,
        {
          n: SIGNATURE.length,

          duration: 1.9,

          ease: 'none',

          onUpdate: () => {
            if (typeRef.current) {
              typeRef.current.textContent =
                SIGNATURE.slice(
                  0,
                  Math.round(typed.n)
                )
            }
          },
        },
        2.0
      )
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="accueil"
      ref={rootRef}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020817]
        font-outfit
        text-white
      "
    >
      {/* ==========================================================
          HALOS D'AMBIANCE
          ========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <div
          className="
            absolute
            -left-[10%]
            top-[18%]
            h-[620px]
            w-[760px]
            rounded-full
            bg-[#1d4ed8]/[0.10]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            right-[4%]
            top-[22%]
            h-[560px]
            w-[640px]
            rounded-full
            bg-[#1d4ed8]/[0.16]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-40
            bg-gradient-to-t
            from-[#020817]
            to-transparent
          "
        />
      </div>

      <div
        className="
          relative
          mx-auto
          min-h-screen
          w-full
          max-w-[1280px]
          px-6
          pb-40
          pt-[126px]
        "
      >
        {/* ========================================================
            COLONNE GAUCHE
            ======================================================== */}

        <div
          className="
            relative
            z-10
            max-w-[640px]
          "
        >
          {/* Lueur bleue derrière CENTRE */}

          <div
            className="
              pointer-events-none
              absolute
              -left-[213px]
              top-[132px]
              -z-10
              h-[380px]
              w-[900px]
              rounded-full
              bg-[radial-gradient(ellipse,rgba(41,121,255,0.30),transparent_66%)]
              blur-[24px]
            "
          />

          {/* Tag */}

          <p
            data-tag
            className="
              dice-glow-text
              text-[12px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[#2f6dff]
              opacity-0
            "
          >
            Talents · Leadership · Impact
          </p>

          {/* ======================================================
              TITRE
              ====================================================== */}

          <h1
            aria-label="Diamond Centre"
            className="
              mt-[62px]
              w-max
              max-w-none
              whitespace-nowrap
              font-anton
              font-normal
              uppercase
              leading-[0.87]
              tracking-[-0.012em]
            "
            style={{
              fontSize:
                'var(--dice-hero-title)',
            }}
          >
            <span
              className="
                -mx-[0.05em]
                block
                overflow-hidden
                px-[0.05em]
                pb-[0.02em]
              "
            >
              <span
                data-line
                className="
                  dice-title-white
                  block
                  opacity-0
                "
              >
                Diamond
              </span>
            </span>

            <span
              className="
                -mx-[0.05em]
                block
                overflow-hidden
                px-[0.05em]
              "
            >
              <span
                data-line
                className="
                  dice-title-blue
                  block
                  opacity-0
                "
              >
                Centre
              </span>
            </span>
          </h1>

          {/* Sous-titre */}

          <p
            data-fade
            className="
              mt-[22px]
              font-barlow
              text-[28px]
              font-light
              italic
              leading-[1.15]
              tracking-[0.01em]
              text-[#cdd6ee]
              opacity-0
            "
          >
            Des expériences qui révèlent votre potentiel.
          </p>

          {/* Description */}

          <p
            data-fade
            className="
              mt-[20px]
              max-w-[480px]
              text-[15px]
              leading-[26px]
              text-[#8b95ab]
              opacity-0
            "
          >
            Formations, conférences et ateliers pour
            développer des talents, des leaders et des
            organisations à fort impact en Afrique et
            au-delà.
          </p>

          {/* Boutons */}

          <div
            data-fade
            className="
              mt-[38px]
              flex
              flex-wrap
              items-center
              gap-4
              opacity-0
            "
          >
            <Link
              href="/events"
              className="
                group
                inline-flex
                h-[50px]
                items-center
                justify-center
                gap-3
                rounded-[3px]
                bg-gradient-to-r
                from-[#0a5cff]
                to-[#2a7bff]
                px-7
                text-[14px]
                font-semibold
                text-white
                shadow-[0_10px_30px_-8px_rgba(10,92,255,0.7)]
                transition-all
                duration-300
                hover:shadow-[0_14px_36px_-6px_rgba(10,92,255,0.9)]
              "
            >
              <span>
                Découvrir nos événements
              </span>

              <FiArrowRight
                className="
                  text-[15px]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

            <a
              href="#evenements"
              className="
                inline-flex
                h-[50px]
                items-center
                justify-center
                rounded-[3px]
                border
                border-white/15
                px-7
                text-[14px]
                font-semibold
                text-white
                transition-all
                duration-300
                hover:border-white/50
                hover:bg-white/[0.04]
              "
            >
              Voir le programme
            </a>
          </div>
        </div>

        {/* ========================================================
            COLONNE DROITE
            ======================================================== */}

        <div
          className="
            mt-14
            flex
            flex-col
            items-center
            lg:absolute
            lg:right-6
            lg:top-[270px]
            lg:mt-0
            lg:block
            lg:h-[520px]
            lg:w-[610px]
          "
        >
          {/* ======================================================
              ARC + TRAIT LUMINEUX + NŒUDS
              ====================================================== */}

          <svg
            aria-hidden="true"
            viewBox="0 0 610 520"
            className="
              pointer-events-none
              absolute
              inset-0
              hidden
              h-full
              w-full
              overflow-visible
              lg:block
            "
          >
            {/* ====================================================
                ARC PRINCIPAL
                ==================================================== */}

            <path
              ref={pathRef}
              d={ARC_PATH}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                filter:
                  'drop-shadow(0 0 6px rgba(140,180,255,0.95))',
              }}
            />

            {/* ====================================================
                HALO DU TRAIT LUMINEUX
                ==================================================== */}

            <path
              ref={trailGlowRef}
              d={ARC_PATH}
              fill="none"
              stroke="#4d8dff"
              strokeWidth={TRAIL_GLOW_WIDTH}
              strokeLinecap="round"
              opacity="0"
              style={{
                filter:
                  'blur(5px)',
              }}
            />

            {/* ====================================================
                PETIT TRAIT LUMINEUX
                ==================================================== */}

            <path
              ref={trailRef}
              d={ARC_PATH}
              fill="none"
              stroke="#ffffff"
              strokeWidth={TRAIL_WIDTH}
              strokeLinecap="round"
              opacity="0"
              style={{
                filter:
                  'drop-shadow(0 0 3px rgba(255,255,255,1)) drop-shadow(0 0 7px rgba(93,160,255,0.95)) drop-shadow(0 0 12px rgba(47,109,255,0.75))',
              }}
            />

            {/* ====================================================
                NŒUDS
                ==================================================== */}

            {NODES.map((n) => (
              <g
                key={n.label}
                data-node
                opacity="0"
              >
                {/* Halo */}

                <circle
                  cx={n.x}
                  cy={n.y}
                  r="12"
                  fill="rgba(59,130,246,0.16)"
                />

                {/* Anneau */}

                <circle
                  className="dice-node-ring"
                  cx={n.x}
                  cy={n.y}
                  r="9"
                  fill="none"
                  stroke="rgba(120,170,255,0.7)"
                  strokeWidth="1"
                />

                {/* Cercle intermédiaire */}

                <circle
                  cx={n.x}
                  cy={n.y}
                  r="6"
                  fill="none"
                  stroke="rgba(160,200,255,0.55)"
                  strokeWidth="1"
                />

                {/* Centre */}

                <circle
                  cx={n.x}
                  cy={n.y}
                  r="3"
                  fill="#ffffff"
                />

                {/* Ligne vers le texte */}

                <line
                  x1={n.x + 12}
                  y1={n.y}
                  x2={n.x + 22}
                  y2={n.y}
                  stroke="rgba(160,190,255,0.35)"
                />
              </g>
            ))}
          </svg>

          {/* ======================================================
              LIBELLÉS
              ====================================================== */}

          {NODES.map((n) => (
            <span
              key={n.label}
              data-node-label
              className="
                pointer-events-none
                absolute
                hidden
                -translate-y-1/2
                text-[10.5px]
                font-bold
                uppercase
                tracking-[0.24em]
                text-[#e6edff]
                opacity-0
                [text-shadow:0_0_10px_rgba(120,170,255,0.7)]
                lg:block
              "
              style={{
                left: n.x + 24,
                top: n.y,
              }}
            >
              {n.label}
            </span>
          ))}

          {/* ======================================================
              DIAMANT
              ====================================================== */}

          <div
            data-diamond
            className="
              opacity-0
              lg:absolute
              lg:left-[34px]
              lg:top-[60px]
            "
          >
            <div data-float>
              <Diamond3D
                size={380}
                mode="sway"
                speed={0.38}
                amp={0.62}
                tilt={14}
                scale={0.392}
              />
            </div>
          </div>

          {/* ======================================================
              CITATION + SIGNATURE
              ====================================================== */}

          <div
            data-signature
            className="
              mt-6
              w-full
              text-center
              opacity-0
              lg:absolute
              lg:-left-[9px]
              lg:top-[446px]
              lg:mt-0
              lg:w-[420px]
            "
          >
            <p
              className="
                text-[11px]
                italic
                tracking-[0.02em]
                text-[#56637f]
              "
            >
              “Un écosystème d’opportunités pour révéler
              votre plein potentiel.”
            </p>

            <p
              aria-label={SIGNATURE}
              className="
                mt-[10px]
                min-h-[46px]
                font-cormorant
                text-[36px]
                italic
                leading-[1.1]
                text-[#e8edf8]
              "
            >
              <span ref={typeRef} />

              <span
                className="dice-caret"
                aria-hidden="true"
              />
            </p>
          </div>
        </div>

        {/* ========================================================
            INDICATEUR DE SCROLL
            ======================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-[64px]
            left-6
            hidden
            items-center
            gap-4
            md:flex
          "
        >
          <span
            className="
              h-px
              w-[30px]
              bg-[#22304d]
            "
          />

          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#34435f]
            "
          >
            Défiler pour explorer
          </span>

          <span
            className="
              relative
              block
              h-[30px]
              w-px
              overflow-hidden
              bg-[#0f1c3a]
            "
          >
            <span
              className="
                dice-scroll-line
                absolute
                inset-0
                bg-[#1d4ed8]
              "
            />
          </span>
        </div>
      </div>
    </section>
  )
}