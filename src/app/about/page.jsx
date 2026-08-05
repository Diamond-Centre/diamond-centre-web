/**
 * Page À propos de Diamond Centre - Version Premium Cinématique avec Smooth Scrolling
 */
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'

// Composants layout
import Container from '@/components/ui/Container'
import VideoModal from '@/components/layout/VideoModal'

// Composants about
import AboutHero from '@/components/about/AboutHero'
import AboutStats from '@/components/about/AboutStats'
import AboutMission from '@/components/about/AboutMission'
import AboutValues from '@/components/about/AboutValues'
import AboutTeam from '@/components/about/AboutTeam'
import AboutQuote from '@/components/about/AboutQuote'
import AboutTimeline from '@/components/about/AboutTimeline'

export default function AboutPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')

  // Initialize Lenis smooth scroll on mount
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

    return () => {
      lenis.destroy()
    }
  }, [])

  const handleVideoOpen = (videoUrl) => {
    setSelectedVideo(videoUrl)
    setIsVideoOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden antialiased">
      <main>
        {/* 1. Cinematic Hero Section */}
        <AboutHero onVideoClick={() => handleVideoOpen('https://www.youtube.com/embed/dQw4w9WgXcQ')} />

        {/* 2. Visual Statistics Milestones */}
        <AboutStats />

        {/* 3. Storytelling Mission & Vision */}
        <AboutMission />

        {/* 4. Asymmetrical Bento Values Grid */}
        <AboutValues />

        {/* 5. Elegant Team Portrait Presentation */}
        <AboutTeam />

        {/* 6. Premium Full-Width Quote Section */}
        <AboutQuote />

        {/* 7. Historical Milestone Timeline */}
        <AboutTimeline />
      </main>

      {/* Video Modal component */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={selectedVideo}
        title="Présentation Diamond Centre"
      />
    </div>
  )
}