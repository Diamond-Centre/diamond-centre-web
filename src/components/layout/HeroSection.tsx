import { useRef, useState, useCallback, useEffect } from 'react'
import DiamondCanvas from '@/components/home/DiamondCanvas'
import ProgressionPath from '@/components/home/ProgressionPath'

interface Props {
  introProgress: number
  heroScrollY: number
}

function reveal(p: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (p - start) / (end - start)))
}

const TAGLINE = 'Fulfil Your dreams...'

export default function Hero({ introProgress, heroScrollY }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const [mouse,      setMouse]      = useState({ x: 0.5, y: 0.5 })
  const [mouseInside, setMouseInside] = useState(false)

  // Persistent hero-ready flag — becomes true once introProgress >= 0.86 and stays true
  const [heroReady, setHeroReady] = useState(false)
  // Smooth liquid fade-in (0→1) once heroReady fires
  const [liquidPhaseLive, setLiquidPhaseLive] = useState(0)
  // Milestone pulse trigger for diamond
  const [liquidPulseTrigger, setLiquidPulseTrigger] = useState(0)

  // Typewriter state
  const [typedCount,    setTypedCount]    = useState(0)
  const [typingStarted, setTypingStarted] = useState(false)
  const [cursorAlpha,   setCursorAlpha]   = useState(0)

  // Set heroReady once — never resets
  useEffect(() => {
    if (heroReady || introProgress < 0.86) return
    setHeroReady(true)
  }, [introProgress, heroReady])

  // Animate liquidPhase 0→1 over 1.4s once heroReady
  useEffect(() => {
    if (!heroReady) return
    const start = performance.now()
    let raf = 0
    function tick(now: number) {
      const t = Math.min(1, (now - start) / 1400)
      setLiquidPhaseLive(t)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [heroReady])

  // Typewriter effect — starts after RÉUSSIR milestone (idx=2) fires
  useEffect(() => {
    if (!typingStarted) return
    setCursorAlpha(1)
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setTypedCount(i)
      if (i >= TAGLINE.length) {
        clearInterval(interval)
        // Keep cursor blinking 1.5s then fade out
        setTimeout(() => {
          let a = 1
          const fade = setInterval(() => {
            a = Math.max(0, a - 0.06)
            setCursorAlpha(a)
            if (a === 0) clearInterval(fade)
          }, 50)
        }, 1500)
      }
    }, 65)
    return () => clearInterval(interval)
  }, [typingStarted])

  const handleMilestone = useCallback((idx: number) => {
    setLiquidPulseTrigger(t => t + 1)
    if (idx === 2) {
      // Start tagline ~450ms after RÉUSSIR
      setTimeout(() => setTypingStarted(true), 450)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [])
  const handleMouseEnter = useCallback(() => setMouseInside(true), [])
  const handleMouseLeave = useCallback(() => {
    setMouseInside(false)
    setMouse({ x: 0.5, y: 0.5 })
  }, [])

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const scrollParallax = Math.min(1, heroScrollY / vh);

  const eyebrowAlpha  = reveal(introProgress, 0.30, 0.50)
  const headlineAlpha = reveal(introProgress, 0.40, 0.62)
  const sublineAlpha  = reveal(introProgress, 0.50, 0.70)
  const bodyAlpha     = reveal(introProgress, 0.56, 0.75)
  const ctaAlpha      = reveal(introProgress, 0.65, 0.82)
  const diamondAlpha  = reveal(introProgress, 0.50, 0.88)

  const slideUp = (alpha: number, extra = 0) =>
    `translateY(${(1 - alpha) * (28 + extra)}px)`
  const blurPx = (alpha: number) =>
    `blur(${(1 - alpha) * 5}px)`

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col"
      style={{ background: '#030816', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '65vw', height: '80vh', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,60,200,0.16) 0%, rgba(0,40,150,0.06) 45%, transparent 72%)',
          transform: `translateY(${scrollParallax * -30}px)`,
          transition: 'transform 0.1s linear',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '-10%',
          width: '50vw', height: '60vh', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,30,120,0.10) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: '22%',
          width: '2px', height: '55%',
          background: 'linear-gradient(180deg, transparent, rgba(0,87,255,0.10), transparent)',
          animation: 'lightBeam 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: '38%',
          width: '1px', height: '42%',
          background: 'linear-gradient(180deg, transparent, rgba(0,200,255,0.07), transparent)',
          animation: 'lightBeam 9s ease-in-out infinite 2.5s',
        }} />
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i % 6) * 18 + 4 + (i * 3) % 8}%`,
            top:  `${Math.floor(i / 6) * 32 + 8 + (i * 7) % 14}%`,
            width: '2px', height: '2px', borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(0,200,255,0.35)' : 'rgba(100,150,255,0.22)',
            animation: `particleDrift ${8 + (i % 5) * 2}s ${i * 0.45}s ease-in-out infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,87,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,87,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Main content */}
      <div
        className="relative flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col"
        style={{ paddingTop: '120px', paddingBottom: '60px', zIndex: 10 }}
      >
        {/* Eyebrow */}
        <div
          className="mb-10"
          style={{
            opacity: eyebrowAlpha,
            transform: `${slideUp(eyebrowAlpha)} ${blurPx(eyebrowAlpha)}`,
            transition: 'none',
          }}
        >
          <span className="glow-label glow-label-d1" style={{
            fontFamily: 'Outfit',
            fontWeight: 500,
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#2979FF',
          }}>
            TALENTS · LEADERSHIP · IMPACT
          </span>
        </div>

        {/* Two-column layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left: Text */}
          <div className="flex flex-col">
            <div
              className="mb-4"
              style={{
                opacity: headlineAlpha,
                transform: `${slideUp(headlineAlpha, 10)} ${blurPx(headlineAlpha)}`,
                transition: 'none',
              }}
            >
              <h1 style={{ fontFamily: "'Anton', sans-serif", fontWeight: 400, lineHeight: 0.88, margin: 0 }}>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(88px, 14vw, 180px)',
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}>DIAMOND</span>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(88px, 14vw, 180px)',
                  color: '#2979FF',
                  letterSpacing: '-0.01em',
                  textShadow: '0 0 80px rgba(41,121,255,0.50)',
                }}>CENTRE</span>
              </h1>
            </div>

            <p
              className="mb-6"
              style={{
                fontFamily: 'Barlow Condensed',
                fontWeight: 300,
                fontSize: 'clamp(22px, 3vw, 32px)',
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.02em',
                fontStyle: 'italic',
                lineHeight: 1.25,
                opacity: sublineAlpha,
                transform: slideUp(sublineAlpha),
                transition: 'none',
              }}
            >
              Des expériences qui révèlent votre potentiel.
            </p>

            <p
              className="mb-10"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.52)',
                maxWidth: '480px',
                opacity: bodyAlpha,
                transform: slideUp(bodyAlpha),
                transition: 'none',
              }}
            >
              Formations, conférences et ateliers pour développer des talents,
              des leaders et des organisations à fort impact en Afrique et au-delà.
            </p>

            <div
              className="flex flex-wrap gap-4"
              style={{
                opacity: ctaAlpha,
                transform: slideUp(ctaAlpha),
                transition: 'none',
              }}
            >
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-300"
                style={{
                  fontFamily: 'Outfit',
                  background: 'linear-gradient(135deg, #0057FF 0%, #2979FF 100%)',
                  color: '#ffffff',
                  borderRadius: '3px',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(0,87,255,0.3)',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,87,255,0.5)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(0,87,255,0.3)'
                }}
              >
                Découvrir nos événements
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="#why"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium transition-all duration-300"
                style={{
                  fontFamily: 'Outfit',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.72)',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,87,255,0.55)'
                  ;(e.currentTarget as HTMLElement).style.color = '#fff'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,87,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.72)'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                Voir le programme
              </a>
            </div>
          </div>

          {/* Right: Diamond + progression path + tagline */}
          <div
            className="flex items-center justify-center lg:justify-start relative"
            style={{
              opacity: diamondAlpha,
              transform: `translateY(${(1 - diamondAlpha) * 40 + scrollParallax * -25}px)`,
              transition: 'none',
            }}
          >
            {/* Diamond container — SVG overflows to the right via overflow:visible */}
            <div style={{ position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <DiamondCanvas
                  scrollProgress={scrollParallax}
                  mouseNormX={mouseInside ? mouse.x : 0.5}
                  mouseNormY={mouseInside ? mouse.y : 0.5}
                  active={true}
                  liquidPhase={liquidPhaseLive}
                  liquidPulseTrigger={liquidPulseTrigger}
                />
              </div>

              {/* Animated progression path */}
              <ProgressionPath
                active={heroReady}
                onMilestone={handleMilestone}
              />

              {/* "Fulfil Your dreams..." typewriter tagline */}
              {typedCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '504px',
                  right: '-26px',
                  left: '71px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 22,
                }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: 'clamp(26px, 2.4vw, 36px)',
                    color: 'rgba(245,248,255,0.94)',
                    textShadow: '0 0 8px rgba(80,150,255,0.25)',
                    letterSpacing: '0.01em',
                  }}>
                    {TAGLINE.slice(0, typedCount)}
                  </span>
                  {/* Blinking cursor */}
                  <span style={{
                    display: 'inline-block',
                    width: '1.5px',
                    height: '0.85em',
                    background: 'rgba(200,220,255,0.90)',
                    marginLeft: '2px',
                    verticalAlign: 'middle',
                    boxShadow: '0 0 6px rgba(80,150,255,0.60)',
                    opacity: cursorAlpha,
                    animation: typedCount < TAGLINE.length ? 'taglineCursor 0.6s ease-in-out infinite' : 'taglineCursor 0.6s ease-in-out infinite',
                  }} />
                </div>
              )}

              {/* Italic subline */}
              <p
                className="text-center px-4"
                style={{
                  fontFamily: 'Outfit',
                  fontStyle: 'italic',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.04em',
                  marginTop: '8px',
                }}
              >
                "Un écosystème d'opportunités pour révéler votre plein potentiel."
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden lg:flex items-center gap-3 mt-10"
          style={{ opacity: ctaAlpha * Math.max(0, 1 - scrollParallax * 3) }}
        >
          <div style={{ width: '30px', height: '1px', background: 'rgba(0,87,255,0.45)' }} />
          <span style={{
            fontFamily: 'Outfit',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
          }}>Défiler pour explorer</span>
          <div style={{
            width: '1px', height: '38px',
            background: 'linear-gradient(180deg, rgba(0,87,255,0.45), transparent)',
            marginLeft: '4px',
          }} />
        </div>
      </div>
    </section>
  )
}
