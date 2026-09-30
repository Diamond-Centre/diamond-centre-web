import { useEffect, useRef, useState } from 'react'

const speakers = [
  { image:'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=500&h=650&fit=crop&auto=format', name:'Dr. Kofi Mensah', role:'Directeur Exécutif, Leadership Institute Africa', speciality:'LEADERSHIP' },
  { image:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&h=650&fit=crop&auto=format', name:'Amina Diallo', role:'Experte en Transformation Organisationnelle', speciality:'STRATÉGIE' },
  { image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&fit=crop&auto=format', name:'Jean-Baptiste Ouédraogo', role:'Professeur en Management, HEC Paris', speciality:'MANAGEMENT' },
  { image:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=650&fit=crop&auto=format', name:'Ngozi Adeyemi', role:'CEO & Fondatrice, AfricaTech Ventures', speciality:'INNOVATION' },
]

export default function Experts() {
  return <section className="premium-light-section" style={{padding:'120px 0',overflow:'hidden'}}>
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div><div className="flex items-center gap-3 mb-5"><div className="glow-line glow-line-d3" style={{width:32,height:1,background:'#176BFF'}}/><span className="glow-label glow-label-d3" style={{fontFamily:'Outfit',fontSize:11,letterSpacing:'.22em',color:'#176BFF'}}>INTERVENANTS</span></div>
          <h2 style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:'clamp(36px,5vw,64px)',color:'#061631',lineHeight:.95}}>Des talents qui<br/><span style={{color:'#176BFF'}}>façonnent demain.</span></h2></div>
        <a href="#" style={{fontFamily:'Outfit',fontSize:13,color:'rgba(6,22,49,.62)',textDecoration:'none'}}>Voir tous les intervenants &nbsp;→</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {speakers.map((s,i)=><SpeakerCard key={s.name} speaker={s} delay={i*110}/>) }
      </div>
    </div>
  </section>
}

function SpeakerCard({speaker,delay}:{speaker:(typeof speakers)[0];delay:number}) {
  const ref=useRef<HTMLDivElement>(null); const [visible,setVisible]=useState(false); const [hover,setHover]=useState(false)
  useEffect(()=>{const n=ref.current;if(!n)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true);else setVisible(false)},{threshold:.22});io.observe(n);return()=>io.disconnect()},[])
  return <div ref={ref} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{position:'relative',height:410,borderRadius:32,overflow:'hidden',cursor:'pointer',background:'#07142E',border:`2px solid ${hover?'#176BFF':'rgba(23,107,255,.72)'}`,boxShadow:hover?'0 26px 55px rgba(0,75,190,.28),0 0 30px rgba(23,107,255,.28)':'0 15px 38px rgba(9,55,115,.14)',opacity:visible?1:0,transform:visible?(hover?'translateY(-12px) scale(1.025)':'translateY(0) scale(1)'):'translateY(58px) scale(.88)',transition:`opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.8,.2,1) ${visible?delay:0}ms, box-shadow .35s ease, border-color .35s ease`,willChange:'transform,opacity'}}>
    <img src={speaker.image} alt={speaker.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transform:hover?'scale(1.075) translateY(-5px)':'scale(1)',filter:hover?'saturate(1.06) contrast(1.02)':'none',transition:'transform .65s cubic-bezier(.2,.8,.2,1), filter .4s ease'}}/>
    <div style={{position:'absolute',inset:0,background:hover?'linear-gradient(180deg,rgba(3,8,22,.02) 30%,rgba(3,8,22,.42) 60%,rgba(3,8,22,.96) 100%)':'linear-gradient(180deg,rgba(3,8,22,.04) 30%,rgba(3,8,22,.58) 66%,rgba(3,8,22,.98) 100%)',transition:'background .4s ease'}}/>
    <div style={{position:'absolute',top:18,left:18,padding:'5px 11px',borderRadius:8,border:'1px solid rgba(90,165,255,.85)',background:'rgba(4,35,91,.46)',backdropFilter:'blur(8px)',fontFamily:'Outfit',fontSize:10,fontWeight:700,letterSpacing:'.15em',color:'#9CC7FF',boxShadow:'0 0 16px rgba(23,107,255,.35)'}}>{speaker.speciality}</div>
    <div style={{position:'absolute',left:20,right:20,bottom:hover?25:20,transition:'bottom .4s ease'}}>
      <h3 style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:24,color:'#fff',lineHeight:1.05,marginBottom:7,textShadow:'0 2px 14px rgba(0,0,0,.4)'}}>{speaker.name}</h3>
      <p style={{fontFamily:'Outfit',fontSize:12,color:hover?'rgba(255,255,255,.86)':'rgba(255,255,255,.62)',lineHeight:1.45,transition:'color .3s ease'}}>{speaker.role}</p>
      <div style={{height:2,width:hover?'100%':'34%',marginTop:14,background:'linear-gradient(90deg,#176BFF,#66C7FF,transparent)',boxShadow:'0 0 12px rgba(23,107,255,.65)',transition:'width .45s ease'}}/>
    </div>
  </div>
}
