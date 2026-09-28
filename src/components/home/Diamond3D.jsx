/**
 * Diamant 3D facetté (brillant à 8 côtés) dessiné sur <canvas>.
 * Aucune dépendance : projection + éclairage + culling calculés à la main.
 *
 *  mode 'sway' : oscillation douce autour de l'axe vertical (hero)
 *  mode 'spin' : rotation continue « pièce qui tourne » (diamant flottant)
 *  depth       : 1 = section ronde ; < 1 = section aplatie (largeur qui varie plus
 *                fortement quand il tourne)
 */
'use client'

import { useEffect, useRef } from 'react'

const N = 8
const CENTER_Y = -0.39 // recentre verticalement le maillage

// Rampe éclaircie / plus saturée pour se rapprocher du rendu Figma (moins de
// facettes quasi noires en bas, un bleu plus riche et lumineux partout).
const RAMP = [
  [0.0, [26, 46, 150]],
  [0.35, [40, 104, 228]],
  [0.68, [104, 182, 252]],
  [1.0, [236, 246, 255]],
]

function ramp(t) {
  const v = Math.max(0, Math.min(1, t))
  for (let i = 1; i < RAMP.length; i++) {
    if (v <= RAMP[i][0]) {
      const [t0, c0] = RAMP[i - 1]
      const [t1, c1] = RAMP[i]
      const k = (v - t0) / (t1 - t0)
      return [
        c0[0] + (c1[0] - c0[0]) * k,
        c0[1] + (c1[1] - c0[1]) * k,
        c0[2] + (c1[2] - c0[2]) * k,
      ]
    }
  }
  return RAMP[RAMP.length - 1][1]
}

function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

function ring(r, y, offset, depth) {
  return Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 + offset
    return [Math.cos(a) * r, y - CENTER_Y, Math.sin(a) * r * depth]
  })
}

function buildFaces(depth) {
  const half = Math.PI / N
  const G = ring(1, 0, half, depth) // ceinture (haut)
  const L = ring(1, -0.08, half, depth) // ceinture (bas)
  const T = ring(0.67, 0.43, half, depth) // table : plus large et plus plate (comme sur la vidéo)
  const M = ring(0.62, -0.4, 0, depth) // anneau intermédiaire du pavillon (moins profond)
  const C = [0, -0.86 - CENTER_Y, 0] // colette (pointe plus courte, forme plus trapue)

  const faces = []
  faces.push({ pts: T, kind: 'table' })

  for (let i = 0; i < N; i++) {
    const n = (i + 1) % N
    faces.push({ pts: [G[i], G[n], T[n], T[i]], kind: 'crown' })
  }
  for (let i = 0; i < N; i++) {
    const n = (i + 1) % N
    faces.push({ pts: [G[i], G[n], L[n], L[i]], kind: 'girdle' })
  }
  for (let i = 0; i < N; i++) {
    const p = (i + N - 1) % N
    const n = (i + 1) % N
    faces.push({ pts: [L[p], L[i], M[i]], kind: 'pavilion' })
    faces.push({ pts: [M[i], M[n], L[i]], kind: 'pavilion' })
    faces.push({ pts: [M[i], M[n], C], kind: 'culet' })
  }

  // Normales sortantes (le solide est quasi convexe, centre ~ (0, -0.3, 0))
  const center = [0, -0.3 - CENTER_Y, 0]
  return faces.map((f, idx) => {
    const [p0, p1, p2] = f.pts
    let nrm = cross(
      [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]],
      [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]]
    )
    const cen = f.pts.reduce(
      (a, p) => [a[0] + p[0] / f.pts.length, a[1] + p[1] / f.pts.length, a[2] + p[2] / f.pts.length],
      [0, 0, 0]
    )
    const out = [cen[0] - center[0], cen[1] - center[1], cen[2] - center[2]]
    if (nrm[0] * out[0] + nrm[1] * out[1] + nrm[2] * out[2] < 0) {
      nrm = [-nrm[0], -nrm[1], -nrm[2]]
    }
    return { ...f, idx, normal: normalize(nrm) }
  })
}

const LIGHT = normalize([-0.45, 0.75, 0.55])
const HALF = normalize([LIGHT[0], LIGHT[1], LIGHT[2] + 1])

export default function Diamond3D({
  size = 300,
  mode = 'sway',
  speed = 0.5,
  amp = 0.5,
  tilt = 12,
  depth = 1,
  scale = 0.36,
  glow = true,
  className = '',
  style = undefined,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(size * dpr)
    canvas.height = Math.round(size * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const faces = buildFaces(depth)
    const ax = (tilt * Math.PI) / 180
    const cx = Math.cos(ax)
    const sx = Math.sin(ax)
    const s = size * scale

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let visible = true
    const start = performance.now()

    const draw = (time) => {
      const ay = mode === 'spin' ? time * speed : Math.sin(time * speed) * amp + 0.25
      const cy = Math.cos(ay)
      const sy = Math.sin(ay)

      const rot = (v) => {
        const x1 = v[0] * cy + v[2] * sy
        const z1 = -v[0] * sy + v[2] * cy
        const y2 = v[1] * cx - z1 * sx
        const z2 = v[1] * sx + z1 * cx
        return [x1, y2, z2]
      }

      ctx.clearRect(0, 0, size, size)
      ctx.lineJoin = 'round'

      const drawn = []
      for (const f of faces) {
        const n = rot(f.normal)
        if (n[2] <= 0.015) continue
        const pts = f.pts.map(rot)
        const depthZ = pts.reduce((a, p) => a + p[2], 0) / pts.length
        drawn.push({ f, n, pts, depthZ })
      }
      drawn.sort((a, b) => a.depthZ - b.depthZ)

      for (const { f, n, pts } of drawn) {
        const diffuse = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2])
        const spec = Math.pow(Math.max(0, n[0] * HALF[0] + n[1] * HALF[1] + n[2] * HALF[2]), 22)
        let col = ramp(0.1 + 0.9 * diffuse)

        // Facettes de couronne côté gauche : teinte violette (comme la maquette)
        if (f.kind === 'crown' && n[0] < -0.18) {
          const k = Math.min(1, -n[0] * 1.3) * 0.8
          col = [
            col[0] + (110 - col[0]) * k,
            col[1] + (64 - col[1]) * k,
            col[2] + (240 - col[2]) * k,
          ]
        }
        // Table : plus claire
        if (f.kind === 'culet') {
          const k = 0.5 * Math.max(0, n[2]) * (0.6 + 0.4 * Math.max(0, n[1] + 0.6))
          col = [
            col[0] + (52 - col[0]) * k,
            col[1] + (146 - col[1]) * k,
            col[2] + (255 - col[2]) * k,
          ]
        }
        if (f.kind === 'table') {
          col = [
            col[0] + (214 - col[0]) * 0.55,
            col[1] + (232 - col[1]) * 0.55,
            col[2] + (255 - col[2]) * 0.55,
          ]
        }

        // Scintillement discret, différent par facette
        const twinkle = reduce ? 0 : Math.pow(Math.max(0, Math.sin(time * 2.1 + f.idx * 2.399)), 12) * 0.32
        const w = Math.min(1, spec * 0.9 + twinkle)
        const r = Math.round(col[0] + (255 - col[0]) * w)
        const g = Math.round(col[1] + (255 - col[1]) * w)
        const b = Math.round(col[2] + (255 - col[2]) * w)

        const screenPts = pts.map((p) => [size / 2 + p[0] * s, size / 2 - p[1] * s])

        ctx.beginPath()
        screenPts.forEach(([px, py], i) => {
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.closePath()

        // Dégradé « verre poli » : plus clair du côté de la lumière (haut-gauche),
        // plus profond de l'autre côté — c'est ce qui donne l'aspect brillant/glacé
        // observé sur l'animation de référence, plutôt qu'un aplat de couleur.
        const xs = screenPts.map((p) => p[0])
        const ys = screenPts.map((p) => p[1])
        const minX = Math.min(...xs)
        const maxX = Math.max(...xs)
        const minY = Math.min(...ys)
        const maxY = Math.max(...ys)
        const lift = f.kind === 'table' ? 70 : 34 + spec * 60
        const lr = Math.min(255, r + lift)
        const lg = Math.min(255, g + lift)
        const lb = Math.min(255, b + lift * 0.85)
        const grad = ctx.createLinearGradient(minX, minY, maxX, maxY)
        grad.addColorStop(0, `rgb(${lr},${lg},${lb})`)
        grad.addColorStop(1, `rgb(${r},${g},${b})`)

        ctx.fillStyle = grad
        ctx.fill()
        ctx.strokeStyle = `rgb(${r},${g},${b})`
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.strokeStyle = 'rgba(255,255,255,0.16)'
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
    }

    const loop = () => {
      if (visible) draw((performance.now() - start) / 1000)
      raf = requestAnimationFrame(loop)
    }

    if (reduce) {
      draw(0.6)
    } else {
      raf = requestAnimationFrame(loop)
    }

    let io
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting)
        },
        { rootMargin: '120px' }
      )
      io.observe(canvas)
    }

    return () => {
      cancelAnimationFrame(raf)
      if (io) io.disconnect()
    }
  }, [size, mode, speed, amp, tilt, depth, scale])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        filter: glow
          ? 'drop-shadow(0 0 22px rgba(37,99,235,0.75)) drop-shadow(0 0 60px rgba(37,99,235,0.4))'
          : undefined,
        ...style,
      }}
    />
  )
}