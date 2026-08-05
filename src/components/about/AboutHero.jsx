/**
 * Section Hero de la page À propos - Version premium, immersive et cinématique
 */
'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaPlay, FaChevronDown } from 'react-icons/fa'
import gsap from 'gsap'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function AboutHero({ onVideoClick }) {
  const containerRef = useRef(null)

  // Floating ambient movement using GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slow background orb animation
      gsap.to('.orb-1', {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      gsap.to('.orb-2', {
        x: 'random(-60, 60)',
        y: 'random(-60, 60)',
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      gsap.to('.orb-3', {
        x: 'random(-40, 40)',
        y: 'random(-40, 40)',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Parallax effects using Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  // Split title animation words
  const titleWordsLine1 = "Diamond Centre".split(" ")
  const titleWordsLine2 = "L'excellence".split(" ")
  const titleWordsLine3 = "depuis 2015".split(" ")

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#030816] min-h-[90vh] md:min-h-screen flex items-center pt-24 pb-16 text-white"
    >
      {/* Background Layer with Primitives */}
      <motion.div style={{ y: heroBgY }} className="absolute inset-0 pointer-events-none z-0">
        {/* Crystal Grid Overlay */}
        <div className="about-crystal-grid opacity-75" />

        {/* Subtle noise texture or linear gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030816]/0 via-[#030816]/50 to-[#030816]" />

        {/* Ambient Glowing Orbs */}
        <div className="about-glow-orb about-glow-orb-primary orb-1 top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px]" />
        <div className="about-glow-orb about-glow-orb-secondary orb-2 bottom-1/4 right-1/4 w-[45vw] h-[45vw] max-w-[600px]" />
        <div className="about-glow-orb about-glow-orb-accent orb-3 top-1/2 left-1/3 w-[30vw] h-[30vw] max-w-[350px]" />
      </motion.div>

      <Container className="relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Column Left: Typography Content */}
          <motion.div
            style={{ y: heroTextY }}
            className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Elegant Floating Glass Badge */}
            <motion.div
              className="flex justify-center lg:justify-start mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-white border border-white/10 text-white/90 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a89f2] animate-pulse" />
                Notre Univers d'Excellence
              </div>
            </motion.div>

            {/* Giant Title - Word Split Reveal */}
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
              <span className="block overflow-hidden pb-1">
                {titleWordsLine1.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-3 md:mr-4"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden pb-1">
                {titleWordsLine2.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-3 md:mr-4 gradient-text"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden text-white/50 text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-light mt-4 tracking-normal">
                {titleWordsLine3.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-2"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Cinematic Description */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Nous façonnons les leaders de demain. Explorez les fondations, la mission et les valeurs de Diamond Centre, incubateur de talents et d'impact durable.
            </motion.p>

            {/* Interactive Play Button CTA */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={onVideoClick}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#0a89f2] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-blue-600 shadow-[0_0_30px_rgba(10,137,242,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#6c5ce7] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <FaPlay className="text-white text-xs ml-0.5" />
                  </span>
                  Découvrir notre histoire en vidéo
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Column Right: Layered Image Composition */}
          <motion.div
            style={{ y: heroImageY, scale: heroScale }}
            className="lg:col-span-5 relative order-1 lg:order-2 flex justify-center w-full"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Depth-of-Field Blur Background Shapes */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-dice-blue/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-60 mix-blend-color-dodge animate-pulse-glow" />

            {/* Main Outer Container breaking bounds */}
            <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] hover-glow-border prism-shimmer">
              {/* Luxury reflection gradient on the card container */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 z-10 pointer-events-none" />

              {/* The high-fidelity Generated Image */}
              <motion.img
                src="/images/about/hero_diamond_prism.png"
                alt="Diamond Centre Prism"
                className="w-full h-full object-cover select-none scale-105"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Glassmorphic Brand Tag overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-dark border border-white/10 z-10 backdrop-blur-md flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-base leading-tight tracking-wide">
                    Diamond Centre
                  </div>
                  <div className="text-white/60 text-xs mt-1 font-light">
                    Excellence & Leadership
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-[#0a89f2] text-sm">
                  DC
                </div>
              </div>
            </div>

            {/* Hanging Crystal Geometry (SVG elements) */}
            <div className="absolute -top-10 -left-10 w-24 h-24 pointer-events-none opacity-40">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#0a89f2] stroke-current stroke-[0.5] fill-none">
                <polygon points="50,10 90,40 90,60 50,90 10,60 10,40" />
                <line x1="50" y1="10" x2="50" y2="90" />
                <line x1="90" y1="40" x2="10" y2="60" />
                <line x1="10" y1="40" x2="90" y2="60" />
              </svg>
            </div>
            <div className="absolute -bottom-12 -right-10 w-32 h-32 pointer-events-none opacity-30">
              <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400 stroke-current stroke-[0.5] fill-none">
                <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" />
                <line x1="50" y1="5" x2="50" y2="95" />
                <line x1="5" y1="30" x2="95" y2="30" />
                <line x1="5" y1="70" x2="95" y2="70" />
              </svg>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}