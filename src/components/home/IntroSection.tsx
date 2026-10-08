/**
 * IntroSection — full cinematic opening sequence.
 *
 * Phase state machine:
 *   videoPlaying    → Video plays 00:00–00:15. Scroll locked. Skip button visible.
 *   videoTransition → Video fades to navy (~650 ms). Overlay takes over.
 *   logoRevealing   → Light-sweep logo materialises (~2.1 s via RAF).
 *   logoHolding     → Logo + tagline centred (~750 ms).
 *   scrollReady     → onAutoIntroComplete() fired; scroll now drives travel.
 *
 * Replace /public/intro-video.mp4 with the actual cinematic video file.
 * Replace logo asset with a transparent PNG/SVG when available.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
const RAW_LOGO_SRC = '/images/attachment-2.png'

/**
 * Supprime le fond blanc du logo (pixels clairs → transparents, bords adoucis).
 * Retourne l'URL d'origine tant que le traitement n'est pas terminé / en cas d'échec.
 */
function useTransparentLogo(src: string) {
  const [out, setOut] = useState(src)
  useEffect(() => {
    let cancelled = false
    const img = new window.Image()
    img.onload = () => {
      try {
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, c.width, c.height)
        const d = data.data
        const HARD = 250 // au-dessus : blanc pur → transparent
        const SOFT = 205 // en dessous : couleur conservée telle quelle
        for (let i = 0; i < d.length; i += 4) {
          const m = Math.min(d[i], d[i + 1], d[i + 2])
          if (m >= HARD) d[i + 3] = 0
          else if (m > SOFT) d[i + 3] = Math.round(d[i + 3] * (HARD - m) / (HARD - SOFT))
        }
        ctx.putImageData(data, 0, 0)
        if (!cancelled) setOut(c.toDataURL('image/png'))
      } catch {
        /* on garde le logo d'origine */
      }
    }
    img.src = src
    return () => { cancelled = true }
  }, [src])
  return out
}

// ─── Constants ───────────────────────────────────────────────────────────────

const VIDEO_STOP_AT = 15          // seconds — hard cutoff for the video
const NAV_LEFT      = 24          // px (matches Navbar.tsx)
const NAV_TOP       = 20          // px
const NAV_LOGO_H    = 40          // px (h-10 in Navbar)
const NAV_LOGO_W    = 136         // px (approx, logo aspect ≈ 3.4 : 1)
const START_SCALE   = 2           // so scroll-phase start = 2 × 40 = 80 px apparent
const INTRO_LOGO_H  = NAV_LOGO_H * START_SCALE   // 80 px
const SPARKLE_AT    = 0.21        // sweep fraction where diamond icon is hit

// ─── Easing ──────────────────────────────────────────────────────────────────

const easeOut   = (t: number) => 1 - Math.pow(1 - Math.min(1, t), 3)
const easeIO    = (t: number) => {
  const c = Math.min(1, t)
  return c < 0.5 ? 4*c*c*c : 1 - Math.pow(-2*c+2, 3)/2
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'videoPlaying' | 'videoTransition' | 'logoRevealing' | 'logoHolding' | 'scrollReady'

interface Props {
  scrollProgress:      number    // 0–1, active only when phase === 'scrollReady'
  scrollComplete:      boolean   // scrollProgress >= 1 → unmount
  onAutoIntroComplete: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IntroSection({ scrollProgress, scrollComplete, onAutoIntroComplete }: Props) {

  const logoSrc = useTransparentLogo(RAW_LOGO_SRC)

  const [phase,         setPhase]         = useState<Phase>('videoPlaying')
  const phaseRef                          = useRef<Phase>('videoPlaying')

  // Video
  const videoRef      = useRef<HTMLVideoElement>(null)
  const [videoAlpha,  setVideoAlpha]      = useState(1)
  const [skipVisible, setSkipVisible]     = useState(true)

  // Logo reveal (RAF-driven)
  const [glowAlpha,     setGlowAlpha]     = useState(0)
  const [sweepProgress, setSweepProgress] = useState(0)
  const [logoAlpha,     setLogoAlpha]     = useState(0)
  const [logoScale,     setLogoScale]     = useState(0.88)
  const [logoBlur,      setLogoBlur]      = useState(8)
  const [eyebrowAlpha,  setEyebrowAlpha]  = useState(0)
  const [sparkleOn,     setSparkleOn]     = useState(false)

  const sparkleRef   = useRef(false)
  const rafRef       = useRef(0)
  const startRef     = useRef(0)
  const particleRaf  = useRef(0)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  // Viewport for travel-phase maths
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  useEffect(() => {
    setVw(window.innerWidth)
    setVh(window.innerHeight)
    const up = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', up)
    return () => window.removeEventListener('resize', up)
  }, [])

  // ── prefers-reduced-motion ──────────────────────────────────────────────
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    phaseRef.current = 'scrollReady'
    setPhase('scrollReady')
    setVideoAlpha(0)
    setSweepProgress(1)
    setLogoAlpha(1); setLogoScale(1); setLogoBlur(0); setEyebrowAlpha(1)
    onAutoIntroComplete()
  }, [onAutoIntroComplete])

  // ── Logo reveal RAF loop ────────────────────────────────────────────────
  // Returns a frame function to kick off with requestAnimationFrame.
  const startLogoReveal = useCallback(() => {
    sparkleRef.current = false
    phaseRef.current   = 'logoRevealing'
    setPhase('logoRevealing')
    startRef.current   = performance.now()

    const GLOW_IN  = 260
    const SWEEP_LAG = 210
    const SWEEP_DUR = 1900
    const HOLD_DUR  = 750
    const EYE_IN    = 320

    function frame(now: number) {
      const p       = phaseRef.current
      const elapsed = now - startRef.current

      if (p === 'logoRevealing') {
        setGlowAlpha(easeOut(Math.min(1, elapsed / GLOW_IN)) * 0.55)

        const se    = Math.max(0, elapsed - SWEEP_LAG)
        const sweepP = easeIO(Math.min(1, se / SWEEP_DUR))
        setSweepProgress(sweepP)

        const revP = easeOut(Math.min(1, se / (SWEEP_DUR * 0.65)))
        setLogoAlpha(revP)
        setLogoScale(0.88 + revP * 0.12)
        setLogoBlur((1 - revP) * 8)

        if (sweepP >= SPARKLE_AT && !sparkleRef.current) {
          sparkleRef.current = true
          setSparkleOn(true)
          setTimeout(() => setSparkleOn(false), 480)
        }

        if (se >= SWEEP_DUR + 60) {
          setSweepProgress(1); setLogoAlpha(1); setLogoScale(1); setLogoBlur(0)
          setGlowAlpha(0.13)
          phaseRef.current = 'logoHolding'
          setPhase('logoHolding')
          startRef.current = now
        }
      }

      if (p === 'logoHolding') {
        setEyebrowAlpha(easeOut(Math.min(1, elapsed / EYE_IN)))
        setGlowAlpha(Math.max(0, 0.13 * (1 - elapsed / HOLD_DUR)))

        if (elapsed >= HOLD_DUR) {
          phaseRef.current = 'scrollReady'
          setPhase('scrollReady')
          onAutoIntroComplete()
          return   // Stop RAF
        }
      }

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
  }, [onAutoIntroComplete])

  // ── Video transition (fade out → start logo) ────────────────────────────
  const triggerVideoTransition = useCallback(() => {
    if (phaseRef.current !== 'videoPlaying') return
    phaseRef.current = 'videoTransition'
    setPhase('videoTransition')
    setSkipVisible(false)

    const vid = videoRef.current
    if (vid) vid.pause()

    const FADE    = 650
    const fadeStart = performance.now()

    function fadeTick(now: number) {
      const t = Math.min(1, (now - fadeStart) / FADE)
      setVideoAlpha(1 - easeOut(t))
      if (t < 1) {
        requestAnimationFrame(fadeTick)
      } else {
        setVideoAlpha(0)
        startLogoReveal()
      }
    }
    requestAnimationFrame(fadeTick)
  }, [startLogoReveal])

  // ── Video event wiring ──────────────────────────────────────────────────
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const onTime = () => { if (vid.currentTime >= VIDEO_STOP_AT) triggerVideoTransition() }
    const onEnd  = () => triggerVideoTransition()
    vid.addEventListener('timeupdate', onTime)
    vid.addEventListener('ended',      onEnd)
    return () => {
      vid.removeEventListener('timeupdate', onTime)
      vid.removeEventListener('ended',      onEnd)
    }
  }, [triggerVideoTransition])

  // ── Particle canvas ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    type P = { x:number; y:number; vx:number; vy:number; r:number; a:number; va:number }
    const pts: P[] = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.26, vy: (Math.random()-.5)*.26-.07,
      r: .7+Math.random()*1.3, a: .08+Math.random()*.5, va: (Math.random()-.5)*.003,
    }))

    function draw() {
      ctx.clearRect(0,0,W,H)
      pts.forEach((p,i) => {
        p.x+=p.vx; p.y+=p.vy; p.a+=p.va
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0
        p.a=Math.max(.05,Math.min(.65,p.a))
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle = i%3===0 ? `rgba(0,200,255,${p.a*.5})` : `rgba(80,140,255,${p.a*.42})`
        ctx.fill()
      })
      particleRaf.current = requestAnimationFrame(draw)
    }
    particleRaf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(particleRaf.current)
  }, [])

  // RAF cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  // ─── Scroll-phase travel maths ──────────────────────────────────────────
  // Visual centre of element at rest: (NAV_LEFT + NAV_LOGO_W/2, NAV_TOP + NAV_LOGO_H/2)
  // At scrollProgress=0 that centre must be at (vw/2, vh/2) → translate cx0, cy0
  const cx0 = vw/2 - (NAV_LEFT + NAV_LOGO_W/2)
  const cy0 = vh/2 - (NAV_TOP  + NAV_LOGO_H/2)

  const easeScroll = (t: number) => t < .5 ? 2*t*t : -1+(4-2*t)*t
  const sp  = Math.min(1, scrollProgress)
  const ep  = easeScroll(Math.min(1, sp * 1.04))
  const ttx = cx0 * (1 - ep)
  const tty = cy0 * (1 - ep)
  const tsc = START_SCALE + (1 - START_SCALE) * ep

  // Overlay opacity: solid until 40% scroll, fades to 0 by 85%
  const overlayAlpha = sp < 0.40 ? 1 : Math.max(0, 1 - (sp - 0.40) / 0.45)

  const isVideoPhase  = phase === 'videoPlaying' || phase === 'videoTransition'
  const isLogoPhase   = phase === 'logoRevealing' || phase === 'logoHolding'
  const isScrollPhase = phase === 'scrollReady'

  if (scrollComplete) return null

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Dark navy overlay (always) ──────────────────────────────────── */}
      <div aria-hidden style={{
        position:'fixed', inset:0, zIndex:40,
        background:'#030816',
        opacity: isScrollPhase ? overlayAlpha : 1,
        pointerEvents:'none', willChange:'opacity',
      }} />

      {/* ── VIDEO ───────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/intro-video.mp4"
        autoPlay muted playsInline
        style={{
          position:'fixed', inset:0,
          width:'100vw', height:'100vh',
          objectFit:'cover', zIndex:45,
          opacity: videoAlpha,
          pointerEvents:'none',
          willChange:'opacity',
          // Hide once fully transparent (keeps it paused in DOM during logoRevealing
          // so browser doesn't restart decoding; completely hidden visually)
          visibility: videoAlpha < 0.01 ? 'hidden' : 'visible',
        }}
      />

      {/* ── Particle canvas (logo phases only) ──────────────────────────── */}
      <canvas ref={canvasRef} aria-hidden style={{
        position:'fixed', inset:0, zIndex:41,
        opacity: isScrollPhase ? overlayAlpha * 0.75 : isLogoPhase ? 0.75 : 0,
        pointerEvents:'none', transition:'opacity 0.8s ease',
      }} />

      {/* ── Blue ambient glow ────────────────────────────────────────────── */}
      <div aria-hidden style={{
        position:'fixed', left:'50%', top:'50%',
        transform:'translate(-50%, -50%)',
        width:380, height:230, borderRadius:'50%',
        background:'radial-gradient(ellipse at center, rgba(0,87,255,0.42) 0%, rgba(0,160,255,0.13) 45%, transparent 72%)',
        filter:'blur(32px)', zIndex:42,
        opacity: isScrollPhase ? overlayAlpha * 0.22 : isLogoPhase ? glowAlpha : 0,
        pointerEvents:'none', transition: isLogoPhase ? 'none' : 'opacity 0.6s ease',
        willChange:'opacity',
      }} />

      {/* ── Auto-intro logo: clip-path sweep reveal ──────────────────────── */}
      {isLogoPhase && (
        <div style={{
          position:'fixed', left:'50%', top:'50%',
          transform:`translate(-50%, -50%) scale(${logoScale})`,
          transformOrigin:'center center', zIndex:51, pointerEvents:'none',
          willChange:'transform',
        }}>
          <div style={{
            position:'relative',
            // inset(0 X% 0 0): right-clip starts at 100% (hidden) → 0% (visible)
            clipPath: `inset(0 ${Math.max(0,(1-sweepProgress)*100).toFixed(2)}% 0 0)`,
            opacity: logoAlpha,
            filter: logoBlur > 0.1 ? `blur(${logoBlur.toFixed(1)}px)` : 'none',
            willChange:'clip-path, opacity, filter',
          }}>
                        <img src={logoSrc} alt="Diamond Centre" draggable={false}
              style={{ height:INTRO_LOGO_H, width:'auto', display:'block', userSelect:'none' }} />
          </div>

          {/* Moving light artifact at the sweep leading edge */}
          {sweepProgress > 0.01 && sweepProgress < 0.995 && (
            <div aria-hidden style={{
              position:'absolute', top:0, bottom:0,
              left:`calc(${(sweepProgress*100).toFixed(2)}% - 28px)`, width:56,
              background:'linear-gradient(90deg, transparent 0%, rgba(120,195,255,0.55) 35%, rgba(255,255,255,0.45) 50%, rgba(120,195,255,0.35) 65%, transparent 100%)',
              pointerEvents:'none', mixBlendMode:'screen',
            }} />
          )}

          {/* Sparkle at the diamond hex icon position */}
          {sparkleOn && (
            <div aria-hidden style={{
              position:'absolute',
              left:`${(SPARKLE_AT*100).toFixed(0)}%`, top:'50%',
              transform:'translate(-50%, -50%)',
              zIndex:5, pointerEvents:'none',
              animation:'sparkleIn 0.48s cubic-bezier(0.22,1,0.36,1) forwards',
            }}>
              <SparkleGlyph />
            </div>
          )}
        </div>
      )}

      {/* ── Scroll-phase logo: scroll-driven travel ──────────────────────── */}
      {isScrollPhase && (
        <img src={logoSrc} alt="Diamond Centre" draggable={false} style={{
          position:'fixed', left:NAV_LEFT, top:NAV_TOP,
          height:NAV_LOGO_H, width:'auto', objectFit:'contain',
          zIndex:52,
          transform:`translate(${ttx.toFixed(2)}px, ${tty.toFixed(2)}px) scale(${tsc.toFixed(4)})`,
          transformOrigin:'center center',
          opacity: overlayAlpha < 0.04 ? 0 : 1,
          pointerEvents:'none', willChange:'transform', userSelect:'none',
        }} />
      )}

      {/* ── "TALENTS · LEADERSHIP · IMPACT" tagline ─────────────────────── */}
      {(phase === 'logoHolding' || isScrollPhase) && (
        <div aria-hidden style={{
          position:'fixed', left:'50%', top:'50%',
          transform:`translateX(-50%) translateY(${INTRO_LOGO_H/2 + 22}px)`,
          zIndex:43, pointerEvents:'none', whiteSpace:'nowrap', textAlign:'center',
          opacity: isScrollPhase
            ? Math.max(0, Math.min(1, (overlayAlpha - 0.35)/0.35))
            : eyebrowAlpha,
          willChange:'opacity',
        }}>
          <span style={{
            fontFamily:'Outfit, sans-serif', fontSize:'11px', fontWeight:500,
            letterSpacing:'0.30em', textTransform:'uppercase', color:'#2979FF',
          }}>
            TALENTS · LEADERSHIP · IMPACT
          </span>
        </div>
      )}
    </>
  )
}

// ─── Sparkle ─────────────────────────────────────────────────────────────────

function SparkleGlyph() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ overflow:'visible' }}>
      {([[18,2,18,12],[18,24,18,34],[2,18,12,18],[24,18,34,18]] as const).map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      {([[6,6,13,13],[23,23,30,30],[30,6,23,13],[6,30,13,23]] as const).map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(140,210,255,0.75)" strokeWidth="1" strokeLinecap="round" />
      ))}
      <circle cx="18" cy="18" r="2.2" fill="white" opacity="0.95" />
    </svg>
  )
}
