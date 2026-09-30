/**
 * DiamondCanvas — 3D brilliant-cut diamond rendered on canvas.
 *
 * Enhanced with:
 * - Internal animated blue liquid (liquidPhase 0→1, clipped to diamond silhouette)
 * - Pulse flash when a milestone fires (liquidPulseTrigger increments)
 * - Existing geometry, sparkle, and caustic effects preserved
 */

import { useRef, useEffect, useCallback } from 'react'

// ─── Math ────────────────────────────────────────────────────────────────────
type V3 = [number, number, number]

const rotY = ([x, y, z]: V3, a: number): V3 => [
  x * Math.cos(a) - z * Math.sin(a), y,
  x * Math.sin(a) + z * Math.cos(a),
]
const rotX = ([x, y, z]: V3, a: number): V3 => [
  x,
  y * Math.cos(a) - z * Math.sin(a),
  y * Math.sin(a) + z * Math.cos(a),
]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const faceNorm = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0]-a[0], b[1]-a[1], b[2]-a[2]]
  const v: V3 = [c[0]-a[0], c[1]-a[1], c[2]-a[2]]
  const n: V3 = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]
  const l = Math.sqrt(n[0]**2 + n[1]**2 + n[2]**2) || 1
  return [n[0]/l, n[1]/l, n[2]/l]
}
const project = (v: V3, cx: number, cy: number, sc: number): [number, number] => {
  const f = 480 / (v[2] + 480) * sc
  return [cx + v[0] * f, cy - v[1] * f]
}

// ─── Geometry ────────────────────────────────────────────────────────────────
const N = 8
const TR = 54, TY = 44
const GR = 104, GY = 0
const CY = -126

function buildGeo() {
  const T: V3[] = [], G: V3[] = []
  for (let i = 0; i < N; i++) {
    const ta = (i / N) * Math.PI * 2
    const ga = ((i + 0.5) / N) * Math.PI * 2
    T.push([TR * Math.cos(ta), TY, TR * Math.sin(ta)])
    G.push([GR * Math.cos(ga), GY, GR * Math.sin(ga)])
  }
  return { T, G, C: [0, CY, 0] as V3 }
}

const GEO = buildGeo()

function buildFaces() {
  const { T, G, C } = GEO
  const faces: { verts: V3[]; type: string; idx: number }[] = []
  let idx = 0

  faces.push({ verts: [...T], type: 'table', idx: idx++ })

  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    faces.push({ verts: [T[i], T[j], G[j], G[i]], type: 'crown', idx: idx++ })
  }

  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const gTop = [...G[i]] as V3; gTop[1] = 5
    const gBot = [...G[i]] as V3; gBot[1] = -5
    const gTopJ = [...G[j]] as V3; gTopJ[1] = 5
    const gBotJ = [...G[j]] as V3; gBotJ[1] = -5
    faces.push({ verts: [gTop, gTopJ, gBotJ, gBot], type: 'girdle', idx: idx++ })
  }

  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    faces.push({ verts: [G[i], G[j], C], type: 'pavilion', idx: idx++ })
  }

  return faces
}

const FACES = buildFaces()
const LIGHT: V3 = [0.35, 0.75, 0.52]

function faceColor(n: V3, type: string) {
  const l = Math.max(0, dot(n, LIGHT))
  const hz = Math.atan2(n[0], n[2])

  if (type === 'table') {
    const v = Math.round(160 + l * 90)
    return { fill: `rgba(${v-30}, ${v}, 255, 0.90)`, alpha: 0.9 }
  }

  if (type === 'crown') {
    if (l > 0.82) {
      const w = Math.round(220 + l * 35)
      return { fill: `rgba(${w}, ${w}, 255, ${0.88 + l * 0.12})`, alpha: 1 }
    }
    const t = (Math.sin(hz) + 1) / 2
    if (t > 0.6) {
      const r = Math.round(60 + l * 140)
      const g = Math.round(160 + l * 80)
      return { fill: `rgba(${r}, ${g}, 255, ${0.75 + l * 0.2})`, alpha: 0.82 }
    } else if (t > 0.3) {
      const r = Math.round(l * 100)
      const g = Math.round(80 + l * 120)
      return { fill: `rgba(${r}, ${g}, 255, ${0.78 + l * 0.2})`, alpha: 0.85 }
    } else {
      const r = Math.round(60 + l * 80)
      const g = Math.round(20 + l * 80)
      return { fill: `rgba(${r}, ${g}, 255, ${0.70 + l * 0.25})`, alpha: 0.80 }
    }
  }

  if (type === 'girdle') {
    return { fill: `rgba(80, 140, 255, 0.55)`, alpha: 0.55 }
  }

  if (l > 0.55) {
    const r = Math.round(80 + l * 100)
    const g = Math.round(160 + l * 80)
    return { fill: `rgba(${r}, ${g}, 255, ${0.80 + l * 0.2})`, alpha: 0.88 }
  }
  const r = Math.round(l * 80)
  const g = Math.round(20 + l * 100)
  return { fill: `rgba(${r}, ${g}, ${Math.round(150 + l * 100)}, 0.88)`, alpha: 0.88 }
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number, alpha: number,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1
  for (let a = 0; a < 4; a++) {
    const angle = (a / 4) * Math.PI
    ctx.beginPath()
    ctx.moveTo(x + Math.cos(angle) * size * 0.3, y + Math.sin(angle) * size * 0.3)
    ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + Math.cos(angle + Math.PI) * size * 0.3, y + Math.sin(angle + Math.PI) * size * 0.3)
    ctx.lineTo(x + Math.cos(angle + Math.PI) * size, y + Math.sin(angle + Math.PI) * size)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(x, y, size * 0.18, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fill()
  ctx.restore()
}

// ─── Component ───────────────────────────────────────────────────────────────
interface Props {
  scrollProgress?:      number
  mouseNormX?:          number
  mouseNormY?:          number
  active?:              boolean
  liquidPhase?:         number   // 0–1: how visible the internal liquid is
  liquidPulseTrigger?:  number   // increments to trigger a brief brightness pulse
}

export default function DiamondCanvas({
  scrollProgress = 0,
  mouseNormX = 0.5,
  mouseNormY = 0.5,
  active = true,
  liquidPhase = 0,
  liquidPulseTrigger = 0,
}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const stateRef   = useRef({
    baseRotY:    0,
    tiltX:       0,
    tiltY:       0,
    sparkles:    [] as { x: number; y: number; size: number; born: number; life: number }[],
    lastSparkle: 0,
    raf:         0,
    last:        0,
    // Liquid
    liquidTime:  0,
    liquidPulse: 0,
  })
  const mouseRef        = useRef({ x: mouseNormX, y: mouseNormY })
  const liquidPhaseRef  = useRef(liquidPhase)

  useEffect(() => { mouseRef.current = { x: mouseNormX, y: mouseNormY } }, [mouseNormX, mouseNormY])
  useEffect(() => { liquidPhaseRef.current = liquidPhase }, [liquidPhase])
  useEffect(() => {
    if (liquidPulseTrigger > 0) stateRef.current.liquidPulse = 1
  }, [liquidPulseTrigger])

  const W   = 380
  const H   = 480
  const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const cx  = W / 2
    const cy  = H * 0.44
    const scale = W / 260

    const state = stateRef.current
    const now   = performance.now()
    const dt    = state.last > 0 ? Math.min((now - state.last) / 1000, 0.05) : 0.016
    state.last  = now

    state.baseRotY += dt * 0.348

    const targetTX = (mouseRef.current.y - 0.5) * 0.3
    const targetTY = (mouseRef.current.x - 0.5) * 0.25
    state.tiltX += (targetTX - state.tiltX) * 0.04
    state.tiltY += (targetTY - state.tiltY) * 0.04

    const ry = state.baseRotY + state.tiltY
    const rx = 0.08 + state.tiltX

    const scrollOffset = scrollProgress * 40
    const dCy = cy + scrollOffset * 0.3

    ctx.clearRect(0, 0, W, H)

    // Background glow beneath diamond
    const grad = ctx.createRadialGradient(cx, dCy, 10, cx, dCy, 140)
    grad.addColorStop(0, 'rgba(0, 87, 255, 0.18)')
    grad.addColorStop(0.5, 'rgba(0, 50, 180, 0.07)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // ── Project all faces ──────────────────────────────────────────────────
    type FaceData = {
      proj: [number, number][]
      centerZ: number
      n: V3
      type: string
      idx: number
      visible: boolean
    }
    const faceData: FaceData[] = FACES.map(face => {
      const rotated = face.verts.map(v => {
        let r = rotY(v, ry)
        r = rotX(r, rx)
        return r
      })
      const centerZ  = rotated.reduce((s, v) => s + v[2], 0) / rotated.length
      const n        = faceNorm(rotated[0], rotated[1], rotated[2])
      const visible  = n[2] > -0.05
      const projected = rotated.map(v => project(v, cx, dCy, scale) as [number, number])
      return { proj: projected, centerZ, n, type: face.type, idx: face.idx, visible }
    })

    faceData.sort((a, b) => a.centerZ - b.centerZ)

    // ── Build pavilion silhouette for liquid clip ───────────────────────────
    // Use ONLY G ring (8 vertices) + culet. T vertices interleave with G in
    // the angular sort and create a self-intersecting star polygon whose
    // non-zero winding area collapses to near-zero — that's why the liquid
    // was invisible. The pavilion shape (G+C) is always convex and correct.
    const projectV = (v: V3): [number, number] => {
      let r = rotY(v, ry)
      r     = rotX(r, rx)
      return project(r, cx, dCy, scale)
    }
    const gPts = GEO.G.map(projectV)
    const cPt  = projectV(GEO.C)
    const silhouette: [number, number][] = [...gPts, cPt]
    silhouette.sort(
      (a, b) => Math.atan2(a[1] - dCy, a[0] - cx) - Math.atan2(b[1] - dCy, b[0] - cx),
    )

    // ── Draw faces (back → front) ──────────────────────────────────────────
    faceData.forEach(face => {
      if (!face.visible) return
      const { fill } = faceColor(face.n, face.type)

      ctx.beginPath()
      ctx.moveTo(face.proj[0][0], face.proj[0][1])
      for (let i = 1; i < face.proj.length; i++) {
        ctx.lineTo(face.proj[i][0], face.proj[i][1])
      }
      ctx.closePath()

      if (face.proj.length >= 2) {
        const gx0 = face.proj[0][0], gy0 = face.proj[0][1]
        const gx1 = face.proj[Math.floor(face.proj.length / 2)][0]
        const gy1 = face.proj[Math.floor(face.proj.length / 2)][1]
        try {
          const fg = ctx.createLinearGradient(gx0, gy0, gx1, gy1)
          fg.addColorStop(0, fill)
          fg.addColorStop(1, fill.replace(/[\d.]+\)$/, v => String(Math.max(0, parseFloat(v) - 0.15) + ')')))
          ctx.fillStyle = fg
        } catch {
          ctx.fillStyle = fill
        }
      } else {
        ctx.fillStyle = fill
      }
      ctx.fill()

      ctx.strokeStyle = 'rgba(150, 200, 255, 0.18)'
      ctx.lineWidth   = 0.6
      ctx.stroke()
    })

    // ── Liquid ─────────────────────────────────────────────────────────────
    const lp = liquidPhaseRef.current
    if (lp > 0) {
      const pulse       = state.liquidPulse
      const effectAlpha = lp * (1 + pulse * 0.35)   // brighten on milestone
      const t           = state.liquidTime

      // Surface Y oscillates slightly with time
      const surfaceY = dCy + 32 + Math.sin(t * 0.70) * 6

      ctx.save()

      // Clip to diamond silhouette
      ctx.beginPath()
      silhouette.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
      ctx.closePath()
      ctx.clip()

      // ── Wave surface fill ─────────────────────────────────────────────
      const waveAmp = 7.5
      ctx.beginPath()
      for (let xp = 0; xp <= W; xp += 4) {
        const yp = surfaceY
          + Math.sin(xp * 0.036 + t * 2.2) * waveAmp
          + Math.sin(xp * 0.019 - t * 1.4) * waveAmp * 0.55
          + Math.sin(xp * 0.058 + t * 3.1) * waveAmp * 0.22
        if (xp === 0) ctx.moveTo(xp, yp)
        else          ctx.lineTo(xp, yp)
      }
      ctx.lineTo(W, H)
      ctx.lineTo(0, H)
      ctx.closePath()

      const lGrad = ctx.createLinearGradient(cx, surfaceY, cx, dCy + 195)
      lGrad.addColorStop(0,   `rgba(70, 160, 255, ${0.78 * effectAlpha})`)
      lGrad.addColorStop(0.18,`rgba(40, 120, 245, ${0.85 * effectAlpha})`)
      lGrad.addColorStop(0.55,`rgba(18,  72, 220, ${0.90 * effectAlpha})`)
      lGrad.addColorStop(1,   `rgba( 8,  38, 170, ${0.95 * effectAlpha})`)
      ctx.fillStyle = lGrad
      ctx.fill()

      // ── Wave surface glow line ────────────────────────────────────────
      ctx.beginPath()
      for (let xp = 0; xp <= W; xp += 4) {
        const yp = surfaceY
          + Math.sin(xp * 0.036 + t * 2.2) * waveAmp
          + Math.sin(xp * 0.019 - t * 1.4) * waveAmp * 0.55
          + Math.sin(xp * 0.058 + t * 3.1) * waveAmp * 0.22
        if (xp === 0) ctx.moveTo(xp, yp)
        else          ctx.lineTo(xp, yp)
      }
      ctx.strokeStyle = `rgba(160, 230, 255, ${0.82 * effectAlpha})`
      ctx.lineWidth   = 2.5
      ctx.shadowColor = 'rgba(0, 170, 255, 0.90)'
      ctx.shadowBlur  = 12
      ctx.stroke()
      ctx.shadowBlur  = 0

      // ── Flowing interior highlights ───────────────────────────────────
      for (let s = 0; s < 3; s++) {
        const sp  = ((t * 0.22 + s * 0.333) % 1)
        const sx  = cx - 85 + 170 * sp
        const sy  = surfaceY + 22 + s * 38 + Math.sin(t * 1.6 + s * 2.2) * 22
        const sg  = ctx.createLinearGradient(sx - 55, sy, sx + 55, sy)
        sg.addColorStop(0,   'rgba(100, 195, 255, 0)')
        sg.addColorStop(0.5, `rgba(180, 235, 255, ${0.35 * effectAlpha})`)
        sg.addColorStop(1,   'rgba(100, 195, 255, 0)')
        ctx.fillStyle = sg
        ctx.fillRect(sx - 55, sy - 3, 110, 6)
      }

      // ── Internal caustic flicker ──────────────────────────────────────
      const causticA = 0.08 + Math.sin(t * 2.4) * 0.04
      const cGrad = ctx.createRadialGradient(cx, dCy + 60, 0, cx, dCy + 60, 70)
      cGrad.addColorStop(0, `rgba(0, 160, 255, ${causticA * effectAlpha})`)
      cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = cGrad
      ctx.fillRect(0, 0, W, H)

      ctx.restore()

      state.liquidTime  += dt * 1.0
      state.liquidPulse  = Math.max(0, state.liquidPulse - dt * 1.6)
    }

    // ── Sparkles ───────────────────────────────────────────────────────────
    const frontCrown = faceData.filter(f => f.type === 'crown' && f.n[2] > 0.5 && f.visible)
    if (frontCrown.length && now - state.lastSparkle > 2800 + Math.random() * 1800) {
      state.lastSparkle = now
      const pick = frontCrown[Math.floor(Math.random() * frontCrown.length)]
      const sx   = pick.proj.reduce((s, p) => s + p[0], 0) / pick.proj.length
      const sy   = pick.proj.reduce((s, p) => s + p[1], 0) / pick.proj.length
      state.sparkles.push({ x: sx, y: sy, size: 8 + Math.random() * 6, born: now, life: 600 + Math.random() * 400 })
    }
    state.sparkles = state.sparkles.filter(sp => now - sp.born < sp.life)
    state.sparkles.forEach(sp => {
      const t     = (now - sp.born) / sp.life
      const alpha = t < 0.3 ? t / 0.3 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3
      drawSparkle(ctx, sp.x, sp.y, sp.size, alpha * 0.9)
    })

    // Bottom caustic reflection
    const causticY = dCy + 150 + scrollOffset * 0.2
    const cg       = ctx.createRadialGradient(cx, causticY, 0, cx, causticY, 80)
    cg.addColorStop(0, 'rgba(0, 150, 255, 0.12)')
    cg.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = cg
    ctx.fillRect(0, 0, W, H)

    state.raf = requestAnimationFrame(render)
  }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = W * DPR
    canvas.height = H * DPR
    canvas.style.width  = W + 'px'
    canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(DPR, DPR)
  }, [DPR])

  useEffect(() => {
    if (!active) return
    stateRef.current.raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(stateRef.current.raf)
  }, [active, render])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        background: 'transparent',
        filter: 'drop-shadow(0 0 24px rgba(0,87,255,0.45)) drop-shadow(0 0 60px rgba(0,180,255,0.15))',
      }}
    />
  )
}
