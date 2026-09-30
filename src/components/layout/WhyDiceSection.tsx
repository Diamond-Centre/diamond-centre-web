import { useEffect, useRef, useState } from 'react'

const metrics = [
  { end: 10000, prefix: '+', suffix: '', label: 'personnes formées' },
  { end: 150, prefix: '', suffix: '+', label: 'événements organisés' },
  { end: 50, prefix: '', suffix: '+', label: 'experts internationaux' },
  { end: 8, prefix: '', suffix: ' ans', label: "d'impact en Afrique" },
]

function Counter({ end, prefix, suffix }: { end:number; prefix:string; suffix:string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let wasVisible = false
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !wasVisible) {
        wasVisible = true
        setValue(0)
        setRunId(id => id + 1)
      } else if (!entry.isIntersecting) {
        wasVisible = false
        setValue(0)
      }
    }, { threshold: .55 })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (runId === 0) return
    const startedAt = performance.now()
    const duration = 4000
    let raf = 0
    const tick = (now:number) => {
      const p = Math.min(1, (now - startedAt) / duration)
      // Smooth premium count: quick enough to feel alive, slow landing on final value.
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [runId, end])

  return <div ref={ref}>{prefix}{value.toLocaleString('fr-FR')}{suffix}</div>
}

export default function WhyDiamond() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reveal, setReveal] = useState(0)
  useEffect(() => {
    const update = () => {
      if (!sectionRef.current) return
      const r = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.max(0, Math.min(1, (vh * .58 - r.top) / (vh * .24)))
      setReveal(p)
    }
    update(); window.addEventListener('scroll', update, {passive:true}); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  return (
    <section ref={sectionRef} id="why" className="premium-light-section" style={{ padding:'120px 0', overflow:'hidden' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1" data-mission-image>
            <div style={{ position:'relative', borderRadius:'12px', overflow:'hidden', height:'520px', boxShadow:'0 30px 80px rgba(0,65,160,.16)', opacity: reveal, transform:`scale(${.82 + reveal*.18})`, clipPath:`circle(${Math.max(0.1,reveal)*75}% at 52% 54%)`, transition:'opacity .12s linear', willChange:'transform, clip-path, opacity' }}>
              <img src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=700&h=520&fit=crop&auto=format" alt="African leaders in a summit" style={{width:'100%',height:'100%',objectFit:'cover'}} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg, rgba(0,87,255,.30), transparent 58%, rgba(0,200,255,.12))'}} />
            </div>
            <div style={{position:'absolute',top:'-16px',left:'-16px',width:'80px',height:'80px',borderTop:'2px solid rgba(0,87,255,.55)',borderLeft:'2px solid rgba(0,87,255,.55)',filter:'drop-shadow(0 0 8px rgba(0,87,255,.35))'}} />
            <div style={{position:'absolute',bottom:'-16px',right:'-16px',width:'80px',height:'80px',borderBottom:'2px solid rgba(0,200,255,.48)',borderRight:'2px solid rgba(0,200,255,.48)',filter:'drop-shadow(0 0 8px rgba(0,200,255,.28))'}} />
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6"><div className="glow-line" style={{width:32,height:1,background:'#0057FF'}}/><span className="glow-label" style={{fontFamily:'Outfit',fontSize:11,letterSpacing:'.22em',color:'#0057FF',textTransform:'uppercase'}}>NOTRE MISSION</span></div>
            <h2 style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:'clamp(36px,5vw,60px)',color:'#061631',lineHeight:.95,marginBottom:24}}>L'excellence au service<br/><span style={{color:'#176BFF'}}>de vos ambitions.</span></h2>
            <p style={{fontFamily:'Outfit',fontSize:15,color:'rgba(6,22,49,.68)',lineHeight:1.75,marginBottom:40}}>Diamond Centre est un écosystème d'apprentissage et de croissance professionnelle conçu pour les talents africains et les organisations qui souhaitent développer leur capital humain. À travers des formations certifiantes, des conférences internationales et des programmes de mentorat, nous accompagnons des milliers de professionnels vers l'excellence.</p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              {metrics.map((m) => <div key={m.label} style={{borderLeft:'2px solid rgba(0,87,255,.42)',paddingLeft:16}}>
                <div style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:42,color:'#176BFF',lineHeight:1,marginBottom:4,textShadow:'0 0 18px rgba(23,107,255,.18)'}}><Counter {...m}/></div>
                <div style={{fontFamily:'Outfit',fontSize:13,color:'rgba(6,22,49,.58)'}}>{m.label}</div>
              </div>)}
            </div>
            <a href="#about" style={{fontFamily:'Outfit',color:'#0A2D63',textDecoration:'none',letterSpacing:'.06em',textTransform:'uppercase',fontSize:12,borderBottom:'1px solid rgba(0,87,255,.28)',paddingBottom:2}}>Notre histoire →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
