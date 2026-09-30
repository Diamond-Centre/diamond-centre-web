'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import './about.css'

const team = [
  ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&h=900&fit=crop', 'Grégoire Armand TATSI', 'FONDATEUR & CONFÉRENCIER PRINCIPAL'],
  ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&h=900&fit=crop', 'Marie-Claire KOUASSI', 'DIRECTRICE DES FORMATIONS'],
  ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=900&fit=crop', 'Jean-Marc BAMBA', 'COACH EN ENTREPRENEURIAT'],
  ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=700&h=900&fit=crop', 'Sophie KOFFI', 'ORATRICE PROFESSIONNELLE']
]

const values = [
  ['01', 'Excellence', 'Viser le plus haut niveau dans chaque expérience que nous créons.'],
  ['02', 'Transmission', 'Transformer le savoir en compétences concrètes et durables.'],
  ['03', 'Impact', 'Faire émerger des leaders capables de transformer leur environnement.']
]

function LifeDiamond({ progress }) {
  const pieces = [
    [-22, -20, 'polygon(50% 0,100% 100%,0 100%)'],
    [22, -20, 'polygon(50% 0,100% 100%,0 100%)'],
    [-32, 10, 'polygon(0 0,100% 0,65% 100%)'],
    [0, 10, 'polygon(0 0,100% 0,50% 100%)'],
    [32, 10, 'polygon(0 0,100% 0,35% 100%)']
  ]
  return (
    <div
      className="life-diamond"
      style={{
        transform: `rotateY(${progress >= 0.99 ? 360 : 0}deg) rotateX(${progress >= 0.99 ? 10 : 0}deg)`,
        filter: `drop-shadow(0 0 ${10 + progress * 20}px rgba(23,107,255,.8))`
      }}
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `calc(50% + ${p[0]}px)`,
            top: `calc(50% + ${p[1]}px)`,
            clipPath: p[2],
            opacity: Math.max(0, Math.min(1, (progress - i * 0.12) * 2.5)),
            transform: `translate(${(1 - progress) * (i % 2 ? 28 : -28)}px,${(1 - progress) * -20}px) scale(${0.65 + progress * 0.35})`
          }}
        />
      ))}
    </div>
  )
}

export default function AboutPage() {
  const teamRef = useRef(null)
  const lifeRef = useRef(null)
  const [teamProgress, setTeamProgress] = useState(0)
  const [lifeProgress, setLifeProgress] = useState(0)

  // Initialize Lenis smooth scroll and custom scroll tracking
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const calc = () => {
      if (teamRef.current) {
        const r = teamRef.current.getBoundingClientRect()
        setTeamProgress(Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height * 0.45))))
      }
      if (lifeRef.current) {
        const r = lifeRef.current.getBoundingClientRect()
        setLifeProgress(Math.max(0, Math.min(1, (innerHeight * 0.72 - r.top) / (innerHeight * 0.72 + r.height * 0.58))))
      }
    }
    
    calc()
    window.addEventListener('scroll', calc, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', calc)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="about-page">
      <main>
        <section className="about-hero">
          <div className="about-glow" />
          <div className="about-wrap">
            <div className="about-kicker">DIAMOND CENTRE · NOTRE HISTOIRE</div>
            <h1>L'excellence ne s'invente pas.<br /><span>Elle se bâtit.</span></h1>
            <div className="hero-rule" />
            <div className="about-hero-grid">
              <div>
                <small>NOTRE PROMESSE INSTITUTIONNELLE</small>
                <strong>Façonner la nouvelle génération de leaders et d'entrepreneurs d'impact.</strong>
              </div>
              <p>Chez Diamond Centre, nous croyons que le potentiel humain est la ressource la plus précieuse d'un continent. Depuis une décennie, nous concevons des écosystèmes d'excellence pour transformer les compétences individuelles en valeur mesurable et durable.</p>
            </div>
          </div>
        </section>

        <section className="azure-grid pillars">
          <div className="about-wrap">
            <div className="center-title">
              <small>NOTRE ADN</small>
              <h2>Les Piliers de <span>Notre Histoire</span></h2>
            </div>
            <div className="pillar-flow">
              <article>
                <i>◎</i>
                <h3>Notre Mission</h3>
                <p>Révéler le potentiel de chaque individu et transformer les ambitions en réussites concrètes à travers des formations d'excellence.</p>
              </article>
              <div className="flow-line" />
              <article className="right">
                <i>◆</i>
                <h3>Notre Engagement</h3>
                <p>Proposer des parcours d'apprentissage uniques, transformateurs et mesurables qui libèrent l'excellence professionnelle.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="azure-grid values">
          <div className="about-wrap">
            <div className="center-title">
              <small>NOS VALEURS</small>
              <h2>Ce qui nous <em>guide</em></h2>
              <p>Des valeurs fondamentales ancrées dans notre identité pour propulser l'excellence collective.</p>
            </div>
            <div className="value-grid">
              {values.map(v => (
                <article key={v[0]}>
                  <b>{v[0]}</b>
                  <h3>{v[1]}</h3>
                  <p>{v[2]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="azure-grid team-section" ref={teamRef}>
          <div className="about-wrap">
            <div className="center-title">
              <small>LES VISAGES DE DIAMOND</small>
              <h2>Une aventure <span>humaine.</span></h2>
            </div>
            <div className="team-stage">
              {team.map((t, i) => {
                const bento = teamProgress < 0.48
                const bx = [[-25, -8], [2, -15], [25, 7], [-2, 14]][i]
                return (
                  <article
                    className="team-card"
                    key={t[1]}
                    style={{
                      transform: bento ? `translate(${bx[0]}%,${bx[1]}%) rotate(${[-4, 3, -2, 4][i]}deg) scale(${0.9 + i * 0.015})` : 'translate(0,0) rotate(0) scale(1)',
                      zIndex: bento ? [2, 4, 3, 1][i] : 1,
                      transitionDelay: `${i * 55}ms`
                    }}
                  >
                    <img src={t[0]} alt={t[1]} />
                    <div className="team-shade" />
                    <div className="team-copy">
                      <h3>{t[1]}</h3>
                      <p>{t[2]}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="life-section" ref={lifeRef}>
          <div className="about-wrap">
            <div className="center-title light">
              <small>NOTRE PHILOSOPHIE</small>
              <h2>Une aventure humaine,<br /><span>une trajectoire d'impact.</span></h2>
            </div>
            <div className="life-track">
              <div className="life-fill" style={{ height: `${lifeProgress * 100}%` }} />
              <div className="diamond-runner" style={{ top: `calc(${lifeProgress * 100}% - 42px)` }}>
                <LifeDiamond progress={lifeProgress} />
              </div>
              {[
                ['2016', 'Une vision'],
                ['2019', 'Une communauté'],
                ['2023', 'Un écosystème'],
                ['Aujourd’hui', 'L’impact continue']
              ].map((x, i) => (
                <div
                  className={`life-step ${i % 2 ? 'r' : 'l'}`}
                  style={{ top: `${8 + i * 27}%`, opacity: lifeProgress > i * 0.27 ? 0.95 : 0.18 }}
                  key={x[0]}
                >
                  <b>{x[0]}</b>
                  <h3>{x[1]}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}