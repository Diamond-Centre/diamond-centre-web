import { useEffect, useRef, useState } from 'react'
const diamondImg = '/images/mission-diamond.png'

export default function DiamondJourney() {
  const [state, setState] = useState({ visible: false, x: 0, y: 0, p: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const update = () => {
      const events = document.getElementById('events')
      const mission = document.getElementById('why')
      const target = document.querySelector('[data-mission-image]') as HTMLElement | null
      if (!events || !mission || !target) return

      const er = events.getBoundingClientRect()
      const mr = mission.getBoundingClientRect()
      const tr = target.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth

      const visible = er.top < vh * 0.72 && mr.top > -vh * 0.2
      const travelStart = vh * 0.70
      const travelEnd = vh * 0.40
      const raw = (travelStart - mr.top) / Math.max(1, travelStart - travelEnd)
      const p = Math.max(0, Math.min(1, raw))

      const startX = vw * 0.885
      const startY = vh * 0.77
      const endX = tr.left + tr.width * 0.52
      const endY = tr.top + tr.height * 0.54
      const ease = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2

      setState({
        visible,
        x: startX + (endX - startX) * ease,
        y: startY + (endY - startY) * ease,
        p,
      })
    }
    const onScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const { visible, x, y, p } = state
  // landing: starts at 72% of travel, completes at 100%
  const landing = Math.max(0, Math.min(1, (p - .72) / .28))
  const opacity = p > .92 ? Math.max(0, 1 - (p - .92) / .08) : 1

  // Reduced by ~1/3 (67% of original: 160→107, 108→72)
  const size = typeof window !== 'undefined' && window.innerWidth < 768 ? 72 : 107

  // Landing tilt: tip the diamond forward (rotateX) as it falls into the mission image.
  // No flat rotateZ — the 3D rotation on the img handles the visual spin.
  const tiltX = landing * -58

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', left: 0, top: 0, width: size, height: size,
        transform: `translate3d(${x - size/2}px, ${y - size/2}px, 0) perspective(900px) rotateX(${tiltX}deg) scale(${1 - landing * .22})`,
        opacity: visible ? opacity : 0,
        transition: visible ? 'opacity .35s ease' : 'opacity .2s ease',
        pointerEvents: 'none', zIndex: 32, willChange: 'transform, opacity',
        // Breathing blue glow per spec
        filter: `drop-shadow(0 0 8px rgba(20,120,255,.65)) drop-shadow(0 0 20px rgba(0,140,255,.40)) drop-shadow(0 0 38px rgba(0,100,255,.20))`,
      }}
    >
      {/* Float wrapper — gentle vertical bob, secondary to the 3D rotation */}
      <div className="journey-diamond-float" style={{ width: '100%', height: '100%' }}>
        <img
          src={diamondImg}
          alt=""
          className="journey-diamond-spin-3d"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>
      <div style={{ position:'absolute', inset:'24%', borderRadius:'50%', background:'rgba(80,190,255,.18)', filter:'blur(14px)', mixBlendMode:'screen' }} />
    </div>
  )
}
