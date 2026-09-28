/**
 * Diamant flottant (image réelle, public/images/home/diamond.png)
 *
 * Comportement calé sur la maquette Figma (vidéo + captures de référence) :
 *
 *  1. Il apparaît (fondu) dès que le titre « Des opportunités pour grandir
 *     ensemble » entre à l'écran, déjà à sa position quasi définitive.
 *  2. Il reste QUASI IMMOBILE, épinglé en haut à droite de l'écran
 *     (~89% largeur / ~77% hauteur), pendant tout le défilement des 3
 *     cartes événements. Seule sa bascule change.
 *  3. Une fois les cartes passées, il glisse en diagonale vers le bas/la
 *     gauche (jusqu'à ~43% largeur / ~93% hauteur) en un mouvement assez
 *     bref, puis s'efface complètement AVANT que la photo et les
 *     statistiques de « Notre mission » ne soient pleinement visibles —
 *     il ne « se pose » donc pas sur la photo, il disparaît juste avant.
 *
 * Point important, vérifié sur la vidéo de référence : la bascule
 * (l'effet « pièce qui tourne », c-à-d l'aplatissement en largeur qui fait
 * alterner le diamant entre sa vue pleine et un fin trait vertical lumineux)
 * n'est PAS liée à la vitesse de scroll. Sur la maquette, deux captures
 * prises quasiment à la même position de page montrent le diamant dans deux
 * phases de rotation différentes : la bascule tourne donc en continu, en
 * temps réel (comme une pièce qui tourne sur elle-même), indépendamment du
 * scroll. Scroller vite ou lentement, ou même ne pas scroller du tout,
 * ne change pas son rythme de rotation.
 *
 * On sépare donc clairement les deux animations :
 *  - Position / opacité / échelle : pilotées par le scroll (scrub), via un
 *    timeline GSAP/ScrollTrigger classique -> réversible, cohérent.
 *  - Bascule (spin) : une boucle temps réel indépendante (gsap.ticker),
 *    qui tourne en continu tant que le composant est monté, quelle que
 *    soit la position de scroll.
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Dimensions natives de l'image détourée (public/images/home/diamond.png)
const IMG_W = 1255
const IMG_H = 956
const BASE_W = 128 // largeur d'affichage de référence (px) — taille quasi
// constante observée sur la maquette (~105-110px avec le halo, sur un écran
// de référence ~1850px de large), avant les légers ajustements d'échelle.

// Durée (en secondes) d'un tour complet de bascule. Indépendant du scroll :
// tourne en continu, en temps réel, tant que le diamant est monté.
const SPIN_PERIOD = 6.5
// Largeur minimale (fraction de la largeur pleine) au moment le plus fin
// du basculement : jamais totalement à 0 pour rester visible/lisible.
const MIN_SCALE_X = 0.08

export default function FloatingDiamond() {
  const wrapRef = useRef(null)
  const flipRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    const flip = flipRef.current
    if (!el || !flip) return undefined

    const mq = window.matchMedia('(min-width: 900px)')
    if (!mq.matches) return undefined

    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const ctx = gsap.context(() => {
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
      })

      // ------------------------------------------------------------------
      // 1) Position / opacité / échelle — pilotées par le scroll (scrub)
      // ------------------------------------------------------------------
      // Trajet complet entre la fin de la section Événements et l'entrée de
      // la section Mission. Démarre tôt (dès que le titre « Des
      // opportunités... » approche) et se termine tôt aussi (le diamant a
      // disparu bien avant que la photo/les stats ne soient pleinement
      // visibles), conformément à la maquette.
      const scrollConfig = {
        trigger: '#evenements',
        start: 'top 75%',
        endTrigger: '#mission',
        end: 'top 55%',
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { ...scrollConfig, scrub: 0.5 },
      })

      // Position « épinglée » en haut à droite, pratiquement constante
      // pendant tout le défilement des 3 cartes événements.
      const PIN_X = () => W() * 0.885
      const PIN_Y = () => H() * 0.775

      tl
        // Étape 0 — apparition, déjà proche de sa position définitive
        .fromTo(
          el,
          { x: () => W() * 0.9, y: () => H() * 0.83, scale: 0.9, opacity: 0 },
          { x: PIN_X, y: PIN_Y, scale: 1, opacity: 1, duration: 0.06 },
          0
        )
        // Étape 1 — maintien : le diamant reste épinglé, immobile, pendant
        // tout le défilement des 3 cartes (seule la bascule continue de
        // tourner en arrière-plan, indépendamment de cette timeline).
        .to(el, { x: PIN_X, y: PIN_Y, scale: 1, duration: 0.49 })
        // Étape 2 — les cartes sont passées : glissement diagonal, assez
        // bref, vers le bas/la gauche (positions relevées sur la maquette).
        .to(el, { x: () => W() * 0.865, y: () => H() * 0.793, scale: 0.97, duration: 0.09 })
        .to(el, { x: () => W() * 0.768, y: () => H() * 0.839, scale: 0.93, duration: 0.08 })
        .to(el, { x: () => W() * 0.613, y: () => H() * 0.888, scale: 0.88, duration: 0.1 })
        .to(el, { x: () => W() * 0.479, y: () => H() * 0.925, scale: 0.82, duration: 0.09 })
        // Étape 3 — fondu de sortie : il s'efface avant que la photo et les
        // statistiques ne soient pleinement révélées (il ne se pose jamais
        // dessus).
        .to(el, {
          x: () => W() * 0.429,
          y: () => H() * 0.927,
          scale: 0.7,
          opacity: 0,
          duration: 0.06,
        })
        // Étape 4 — reste invisible jusqu'à la fin du trajet.
        .to(el, { opacity: 0, duration: 0.03 })
    })

    // ------------------------------------------------------------------
    // 2) Bascule (spin) — boucle temps réel, indépendante du scroll
    // ------------------------------------------------------------------
    // On aplatit la largeur du diamant en cosinus pour simuler une
    // rotation 3D sur un visuel 2D à plat. `time` vient de gsap.ticker et
    // avance en secondes réelles, jamais en fonction du scroll : le
    // diamant continue donc de tourner même si on arrête de scroller.
    const spin = (time) => {
      const angle = (time / SPIN_PERIOD) * Math.PI * 2
      const scaleX = Math.max(MIN_SCALE_X, Math.abs(Math.cos(angle)))
      gsap.set(flip, { scaleX })
    }
    gsap.ticker.add(spin)

    return () => {
      gsap.ticker.remove(spin)
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden opacity-0 will-change-transform md:block"
      style={{ width: BASE_W, height: (BASE_W * IMG_H) / IMG_W }}
    >
      <div ref={flipRef} className="h-full w-full" style={{ transformOrigin: '50% 50%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/diamond.png"
          alt=""
          width={IMG_W}
          height={IMG_H}
          className="h-full w-full object-contain"
          style={{
            filter:
              'drop-shadow(0 0 22px rgba(37,99,235,0.75)) drop-shadow(0 0 60px rgba(37,99,235,0.4))',
          }}
        />
      </div>
    </div>
  )
}