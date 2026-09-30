/**
 * Diamant flottant 3D (facettes dessinées sur <canvas>, aucune image).
 *
 * Le diamant est le même maillage 3D que `Diamond3D.jsx` (couronne + pavillon
 * à 8 facettes, éclairage par facette) : il TOURNE VRAIMENT sur son axe
 * vertical, au lieu d'une image aplatie qui se retourne.
 *
 * Trajectoire relevée image par image sur la vidéo de référence (Figma) et
 * recoupée avec les captures d'écran de la page :
 *
 *   1. Il apparaît quand la section « Événements » entre dans l'écran et reste
 *      ÉPINGLÉ à droite des cartes (≈ 88,5 % de la largeur, 77 % de la hauteur)
 *      pendant tout le défilement des cartes.
 *   2. Quand la section « Notre mission » monte dans l'écran, il quitte son
 *      épingle, descend en diagonale vers la gauche, passe sur la fin de
 *      « ...de vos ambitions. » puis sur le début du paragraphe.
 *   3. Il CHUTE dans la photo (celle des statistiques), au centre-bas de la
 *      photo (≈ 34 % de la largeur, 88 % de la hauteur), puis s'efface.
 *
 * La position dépend UNIQUEMENT du scroll (aucun retard) : on lit en direct
 * le haut de la section « Mission » par rapport à la fenêtre.
 *
 * Aucune dépendance (ni gsap, ni three.js) : canvas 2D + requestAnimationFrame.
 * Nécessite seulement `./Diamond3D.jsx` (déjà dans ce dossier).
 */
'use client'

import { useEffect, useRef } from 'react'
import { buildFaces, drawFrame } from './Diamond3D'

// --- Rendu 3D --------------------------------------------------------------
const CANVAS_LOGICAL = 300 // taille du dessin (px logiques), affiché à l'échelle
const GEM_SCALE = 0.36 // même valeur par défaut que Diamond3D (gemme = 72 % du canvas)
const GEM_TILT = 6 // inclinaison (°) : on voit un peu la table du dessus
// Vitesse de rotation (rad/s) : 1.1 ≈ un tour en 5,7 s. Monte pour tourner plus vite.
const SPIN_SPEED = 1.1

// Largeur visible de la gemme : ≈ 8,4 % de la largeur de la fenêtre
// (156 px sur 1852 px), bornée pour les petits / très grands écrans.
const GEM_VW = 0.084
const GEM_MIN = 110
const GEM_MAX = 190

// Largeur minimale de la fenêtre pour afficher l'animation.
const MIN_VIEWPORT = 900

// --- POSE:START -----------------------------------------------------------
// Toutes les valeurs sont des FRACTIONS de la fenêtre (0 = haut/gauche,
// 1 = bas/droite).
//   e = haut de la section #evenements / hauteur fenêtre
//   m = haut de la section Mission     / hauteur fenêtre

// Épingle (pendant les cartes) et point de chute (dans la photo).
const PIN_X = 0.885
const END_X = 0.338

// Le trajet commence quand m = 0.70 et finit quand m = 0.40.
const TRAVEL_START = 0.7
const TRAVEL_SPAN = 0.3

// y(p), échelle(p) — points relevés, p = avancement du trajet (0 → 1).
const Y_TABLE = [
  [0, 0.77],
  [0.143, 0.784], // m = 0.657
  [0.28, 0.822], //  m = 0.616
  [0.397, 0.858], // m = 0.581  (sur « ...ambitions. »)
  [0.607, 0.919], // m = 0.518  (sur le paragraphe)
  [0.737, 0.918],
  [0.847, 0.91],
  [0.913, 0.895],
  [0.95, 0.884], //  m = 0.415  (dans la photo)
  [1, 0.862],
]
const SCALE_TABLE = [
  [0, 1],
  [0.3, 1],
  [0.6, 1.06],
  [0.85, 1.08],
  [1, 1.02],
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Interpolation linéaire dans une table [[p, valeur], ...]
function lerpTable(table, p) {
  if (p <= table[0][0]) return table[0][1]
  for (let i = 1; i < table.length; i += 1) {
    if (p <= table[i][0]) {
      const [p0, v0] = table[i - 1]
      const [p1, v1] = table[i]
      return v0 + ((v1 - v0) * (p - p0)) / (p1 - p0)
    }
  }
  return table[table.length - 1][1]
}

// Accélère puis ralentit (comme le rendu de référence sur l'axe horizontal).
const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2)

// Pose du diamant pour un état de scroll donné.
//   e, m : voir plus haut   |   retourne x, y (fractions), scale, opacity
function diamondPose(e, m) {
  const p = clamp01((TRAVEL_START - m) / TRAVEL_SPAN)

  const x = PIN_X + (END_X - PIN_X) * easeInOut(p)
  const y = lerpTable(Y_TABLE, p)
  const scale = lerpTable(SCALE_TABLE, p)

  // Apparition quand la section Événements entre (e de 0.80 à 0.70)
  const appear = clamp01((0.8 - e) / 0.1)
  // Fondu de sortie dans la photo (m de 0.43 à 0.39)
  const fade = m >= 0.43 ? 1 : m <= 0.39 ? 0 : ((m - 0.39) / 0.04) ** 1.3

  return { x, y, scale, opacity: appear * fade }
}
// --- POSE:END -------------------------------------------------------------

export default function FloatingDiamond() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    // Canvas net sur écrans haute densité
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(CANVAS_LOGICAL * dpr)
    canvas.height = Math.round(CANVAS_LOGICAL * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const faces = buildFaces(1)
    const opts = {
      size: CANVAS_LOGICAL,
      mode: 'spin',
      speed: SPIN_SPEED,
      amp: 0,
      tilt: GEM_TILT,
      scale: GEM_SCALE,
    }
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let startEl = null // #evenements
    let endEl = null // section Mission (#mission, sinon #why)
    let raf = 0
    let dirty = true
    let shown = false
    let disposed = false
    const t0 = performance.now()

    const onScroll = () => {
      dirty = true
    }

    const render = (now) => {
      if (disposed) return
      raf = requestAnimationFrame(render)

      // Les sections peuvent ne pas être encore montées (dev / Strict Mode)
      if (!startEl) startEl = document.getElementById('evenements')
      if (!endEl) endEl = document.getElementById('mission') || document.getElementById('why')

      // --- Position, pilotée par le scroll ----------------------------
      if (dirty) {
        dirty = false
        const vw = window.innerWidth
        const vh = window.innerHeight

        if (!startEl || !endEl || vw < MIN_VIEWPORT) {
          shown = false
          el.style.opacity = '0'
        } else {
          const e = startEl.getBoundingClientRect().top / vh
          const m = endEl.getBoundingClientRect().top / vh
          const pose = diamondPose(e, m)

          // Le canvas est carré ; la gemme en occupe 2 × GEM_SCALE de la largeur.
          const gemW = Math.min(GEM_MAX, Math.max(GEM_MIN, vw * GEM_VW))
          const box = gemW / (2 * GEM_SCALE)
          el.style.width = `${box}px`
          el.style.height = `${box}px`
          el.style.opacity = String(pose.opacity)
          el.style.transform =
            `translate3d(${pose.x * vw}px, ${pose.y * vh}px, 0) ` +
            `translate(-50%, -50%) scale(${pose.scale})`
          shown = pose.opacity > 0.01
        }
      }

      // --- Rotation 3D en temps réel (seulement si visible) -----------
      if (shown) {
        const t = reduce ? 0.6 : (now - t0) / 1000
        drawFrame(ctx, faces, opts, t, reduce)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    raf = requestAnimationFrame(render)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden opacity-0 will-change-transform md:block"
      style={{ width: 216, height: 216 }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          filter:
            'drop-shadow(0 0 22px rgba(37,99,235,0.75)) drop-shadow(0 0 60px rgba(37,99,235,0.4))',
        }}
      />
    </div>
  )
}