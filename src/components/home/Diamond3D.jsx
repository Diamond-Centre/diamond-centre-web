/**
 * Diamant 3D facetté dessiné sur <canvas> (aucune dépendance).
 *
 * Géométrie calquée sur la maquette Figma : couronne basse aux facettes
 * larges (violet → bleu ciel → blanc → bleu clair) et pavillon très profond,
 * bleu marine, qui se termine en pointe.
 *
 *  mode 'sway' : oscillation douce autour de l'axe vertical (hero)
 *  mode 'spin' : rotation continue « pièce qui tourne »
 *  depth       : 1 = section ronde ; < 1 = section aplatie
 */
'use client'

import { useEffect, useRef } from 'react'

const N = 8
const CENTER_Y = -0.39 // recentre verticalement le maillage

// Couronne : violet profond -> bleu ciel -> blanc bleuté
const RAMP_CROWN = [
  [0.0, [66, 44, 214]],
  [0.35, [58, 150, 240]],
  [0.7, [140, 200, 242]],
  [1.0, [244, 246, 255]],
]

// Pavillon : bleu marine profond -> bleu vif (facette éclairée)
const RAMP_PAVILION = [
  [0.0, [4, 18, 132]],
  [0.5, [8, 40, 186]],
  [1.0, [34, 124, 240]],
]

function ramp(stops, t) {
  const v = Math.max(0, Math.min(1, t))
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [t0, c0] = stops[i - 1]
      const [t1, c1] = stops[i]
      const k = (v - t0) / (t1 - t0)
      return [
        c0[0] + (c1[0] - c0[0]) * k,
        c0[1] + (c1[1] - c0[1]) * k,
        c0[2] + (c1[2] - c0[2]) * k,
      ]
    }
  }
  return stops[stops.length - 1][1]
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

export function buildFaces(depth = 1) {
  const half = Math.PI / N
  const G = ring(1, 0, half, depth) // ceinture (haut)
  const L = ring(1, -0.07, half, depth) // ceinture (bas)
  const T = ring(0.56, 0.43, half, depth) // table : couronne basse et évasée
  const C = [0, -1.18 - CENTER_Y, 0] // colette : pointe profonde (pavillon long)

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
  // Pavillon : 8 grands triangles qui convergent vers la pointe
  for (let i = 0; i < N; i++) {
    const n = (i + 1) % N
    faces.push({ pts: [L[i], L[n], C], kind: 'pavilion' })
  }

  const center = [0, -0.35 - CENTER_Y, 0]
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

const LIGHT = normalize([0.32, 0.62, 0.72]) // couronne : lumière de face, légèrement à droite
const LIGHT_P = normalize([0.55, -0.05, 0.85]) // pavillon : facette éclairée à droite du centre

export function drawFrame(ctx, faces, o, time, reduce) {
  const { size, mode, speed, amp, tilt, scale } = o
  const ax = (tilt * Math.PI) / 180
  const cx = Math.cos(ax)
  const sx = Math.sin(ax)
  const s = size * scale

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
    let col
    let lift

    if (f.kind === 'pavilion') {
      const d = Math.max(0, n[0] * LIGHT_P[0] + n[1] * LIGHT_P[1] + n[2] * LIGHT_P[2])
      col = ramp(RAMP_PAVILION, Math.pow(d, 2.4))
      lift = 26
    } else {
      const d = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2])
      col = ramp(RAMP_CROWN, Math.pow(d, 1.9) * 1.08)
      if (f.kind === 'girdle') col = [col[0] * 0.75 + 20, col[1] * 0.85 + 30, Math.min(255, col[2] * 0.95 + 30)]
      lift = f.kind === 'table' ? 40 : 14
    }

    // Scintillement discret, différent par facette
    const twinkle = reduce ? 0 : Math.pow(Math.max(0, Math.sin(time * 2.1 + f.idx * 2.399)), 14) * 0.2
    const w = Math.min(1, twinkle)
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

    const xs = screenPts.map((p) => p[0])
    const ys = screenPts.map((p) => p[1])
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const grad =
      f.kind === 'pavilion'
        ? ctx.createLinearGradient(0, minY, 0, maxY)
        : ctx.createLinearGradient(minX, minY, maxX, maxY)
    grad.addColorStop(
      0,
      `rgb(${Math.min(255, r + lift)},${Math.min(255, g + lift)},${Math.min(255, b + lift * 0.85)})`
    )
    grad.addColorStop(1, `rgb(${r},${g},${b})`)

    ctx.fillStyle = grad
    ctx.fill()
    ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.strokeStyle = 'rgba(120,160,255,0.16)'
    ctx.lineWidth = 0.6
    ctx.stroke()
  }
}

export default function Diamond3D({
  size = 300,
  mode = 'sway',
  speed = 0.5,
  amp = 0.5,
  tilt = 6,
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
    const opts = { size, mode, speed, amp, tilt, scale }

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let visible = true
    const start = performance.now()

    const loop = () => {
      if (visible) drawFrame(ctx, faces, opts, (performance.now() - start) / 1000, reduce)
      raf = requestAnimationFrame(loop)
    }

    if (reduce) {
      drawFrame(ctx, faces, opts, 0.6, true)
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