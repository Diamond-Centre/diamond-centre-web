/**
 * ProgressionPath — animated SVG orbital path with luminous milestone nodes.
 *
 * Key fix: phaseRef (not state) guards the drawing effect so that
 * setPhase('done') at animation end doesn't trigger cleanup that cancels
 * the drawing RAF mid-flight.
 */

import { useRef, useEffect, useState } from 'react'

interface Props {
  active: boolean
  onMilestone?: (idx: number) => void
}

const PATH_D = [
  'M 0,155',
  'C 85,88 132,80 167,106',
  'C 204,132 204,202 167,226',
  'C 130,250 130,328 167,360',
].join(' ')

const MILESTONES = [
  { ms: 820,  label: 'APPRENDRE', nx: 167, ny: 106 },
  { ms: 1860, label: 'ÉVOLUER',   nx: 167, ny: 226 },
  { ms: 2900, label: 'RÉUSSIR',   nx: 167, ny: 360 },
]
const DRAW_DURATION_MS = 2900
const DRAW_START_DELAY = 480

export default function ProgressionPath({ active, onMilestone }: Props) {
  const pathRef  = useRef<SVGPathElement>(null)
  const rafRef   = useRef(0)
  const startRef = useRef(0)
  const firedRef = useRef([false, false, false])

  // Synchronous phase ref — never causes re-renders; used to guard the drawing effect
  const phaseRef = useRef<'idle' | 'drawing' | 'done'>('idle')

  const [totalLen,   setTotalLen]   = useState(0)
  const [drawnLen,   setDrawnLen]   = useState(0)
  const [tipPt,      setTipPt]      = useState<{ x: number; y: number } | null>(null)
  const [nodes,      setNodes]      = useState([false, false, false])
  const [labels,     setLabels]     = useState([false, false, false])
  const [shimmerOff, setShimmerOff] = useState(0)
  // uiPhase is ONLY for shimmer effect trigger — it is set after animation is done
  const [uiPhase, setUiPhase] = useState<'idle' | 'drawing' | 'done'>('idle')

  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Measure path once mounted
  useEffect(() => {
    if (pathRef.current) setTotalLen(pathRef.current.getTotalLength())
  }, [])

  // ── Main drawing sequence ────────────────────────────────────────────────
  // Deps: [active, totalLen] ONLY — no phase in deps, so setUiPhase('done') at
  // animation end does NOT trigger this cleanup and cancel the RAF.
  useEffect(() => {
    if (!active || totalLen === 0 || phaseRef.current !== 'idle') return

    if (reducedMotion.current) {
      phaseRef.current = 'done'
      setDrawnLen(totalLen)
      setNodes([true, true, true])
      setLabels([true, true, true])
      setUiPhase('done')
      MILESTONES.forEach((_, i) => onMilestone?.(i))
      return
    }

    // Mark drawing started synchronously before any async work
    phaseRef.current = 'drawing'

    const delayTimer = setTimeout(() => {
      startRef.current = performance.now()

      function frame(now: number) {
        const elapsed = now - startRef.current
        const t       = Math.min(1, elapsed / DRAW_DURATION_MS)
        const eased   = 1 - Math.pow(1 - t, 1.85)
        const drawn   = eased * totalLen

        setDrawnLen(drawn)

        // Tip particle
        const clamped = Math.min(drawn, totalLen - 0.5)
        if (clamped > 0 && pathRef.current) {
          try {
            const pt = pathRef.current.getPointAtLength(clamped)
            setTipPt({ x: pt.x, y: pt.y })
          } catch { /* ignore */ }
        }

        // Milestone fires
        MILESTONES.forEach(({ ms }, i) => {
          if (elapsed >= ms && !firedRef.current[i]) {
            firedRef.current[i] = true
            setNodes(prev => { const n = [...prev]; n[i] = true; return n })
            onMilestone?.(i)
            setTimeout(() => {
              setLabels(prev => { const n = [...prev]; n[i] = true; return n })
            }, 200)
          }
        })

        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame)
        } else {
          setDrawnLen(totalLen)
          setTipPt(null)
          phaseRef.current = 'done'
          setUiPhase('done')  // Only now trigger shimmer effect — RAF is already done
        }
      }

      rafRef.current = requestAnimationFrame(frame)
    }, DRAW_START_DELAY)

    return () => {
      clearTimeout(delayTimer)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active, totalLen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Shimmer loop (only after drawing completes) ──────────────────────────
  useEffect(() => {
    if (uiPhase !== 'done' || totalLen === 0) return

    const PERIOD = 3800
    let start = 0

    const timer = setTimeout(() => {
      function loop(now: number) {
        if (!start) start = now
        setShimmerOff(((now - start) % PERIOD) / PERIOD * totalLen)
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    }, 600)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafRef.current)
    }
  }, [uiPhase, totalLen])

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <svg
      width="260"
      height="480"
      viewBox="0 0 260 480"
      aria-hidden
      style={{
        position: 'absolute',
        left: 330,
        top: 0,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <defs>
        {/* White-core + blue-bloom glow for path */}
        <filter id="ppGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="7"   result="b2" />
          <feColorMatrix in="b2" type="matrix"
            values="0.2 0 0 0 0.1
                    0.6 0 0 0 0.3
                    1   0 0 0 1
                    0   0 0 1.2 0"
            result="blueBloom"
          />
          <feMerge>
            <feMergeNode in="blueBloom" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Node glow */}
        <filter id="ppNode" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>{`
          @keyframes ppHalo {
            0%,100% { opacity: 0.55; transform: scale(1); }
            50%      { opacity: 0.15; transform: scale(1.9); }
          }
          @keyframes ppCore {
            0%,100% { opacity: 0.65; }
            50%      { opacity: 1.00; }
          }
          .pp-halo { transform-box: fill-box; transform-origin: center; }
        `}</style>
      </defs>

      {/* Hidden measurement path */}
      <path ref={pathRef} d={PATH_D} fill="none" stroke="none" />

      {/* Ghost track (always visible once measured) */}
      {totalLen > 0 && (
        <path
          d={PATH_D}
          fill="none"
          stroke="rgba(60, 120, 255, 0.18)"
          strokeWidth="1.5"
        />
      )}

      {/* Live-drawn segment */}
      {totalLen > 0 && drawnLen > 0 && (
        <path
          d={PATH_D}
          fill="none"
          stroke="rgba(255, 255, 255, 0.92)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={`${drawnLen} ${Math.max(0, totalLen - drawnLen + 1)}`}
          filter="url(#ppGlow)"
        />
      )}

      {/* Shimmer sweep */}
      {uiPhase === 'done' && totalLen > 0 && (
        <path
          d={PATH_D}
          fill="none"
          stroke="rgba(200, 235, 255, 0.90)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`20 ${totalLen}`}
          strokeDashoffset={-shimmerOff}
          filter="url(#ppGlow)"
        />
      )}

      {/* Energy tip particle */}
      {tipPt && (
        <g filter="url(#ppNode)">
          <circle cx={tipPt.x} cy={tipPt.y} r={6}   fill="rgba(60,160,255,0.35)" />
          <circle cx={tipPt.x} cy={tipPt.y} r={3}   fill="rgba(160,220,255,0.80)" />
          <circle cx={tipPt.x} cy={tipPt.y} r={1.4} fill="white" opacity={1} />
        </g>
      )}

      {/* Milestone nodes */}
      {MILESTONES.map(({ nx, ny }, i) =>
        nodes[i] ? (
          <g key={i} filter="url(#ppNode)">
            <circle
              className="pp-halo"
              cx={nx} cy={ny} r={10}
              fill="none"
              stroke="rgba(40, 140, 255, 0.65)"
              strokeWidth="1.5"
              style={{ animation: `ppHalo 2.8s ease-in-out ${i * 0.8}s infinite` }}
            />
            <circle
              cx={nx} cy={ny} r={6}
              fill="rgba(60, 160, 255, 0.50)"
              style={{ animation: `ppCore 2.8s ease-in-out ${i * 0.8}s infinite` }}
            />
            <circle cx={nx} cy={ny} r={2.8} fill="white" opacity={0.98} />
          </g>
        ) : null
      )}

      {/* Labels */}
      {MILESTONES.map(({ nx, ny, label }, i) =>
        labels[i] ? (
          <g key={i}>
            <line
              x1={nx + 8} y1={ny}
              x2={nx + 20} y2={ny}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1"
            />
            <text
              x={nx + 24}
              y={ny + 4.5}
              fill="rgba(255,255,255,0.95)"
              fontFamily="'Barlow Condensed', sans-serif"
              fontWeight="700"
              fontSize="12"
              letterSpacing="0.20em"
              style={{
                filter:
                  'drop-shadow(0 0 4px rgba(255,255,255,0.55)) drop-shadow(0 0 10px rgba(40,130,255,0.70))',
              }}
            >
              {label}
            </text>
          </g>
        ) : null
      )}
    </svg>
  )
}
