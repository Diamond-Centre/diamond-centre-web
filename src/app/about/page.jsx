/**
 * Page À propos de Diamond Centre - Version responsive
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// Composants layout
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Container from '@/components/ui/Container'
import VideoModal from '@/components/layout/VideoModal'

// Composants about
import AboutHero from '@/components/about/AboutHero'
import AboutMission from '@/components/about/AboutMission'
import AboutStats from '@/components/about/AboutStats'
import AboutValues from '@/components/about/AboutValues'
import AboutTeam from '@/components/about/AboutTeam'
import AboutTimeline from '@/components/about/AboutTimeline'

// Composants partagés
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { FaArrowRight, FaQuoteRight } from 'react-icons/fa'

// Témoignages
const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Entrepreneure',
    text: 'Diamond Centre a transformé ma vision des affaires. Les formations sont d\'une qualité exceptionnelle.',
    rating: 5
  },
  {
    name: 'Thomas Dubois',
    role: 'Étudiant',
    text: 'Grâce aux séminaires, j\'ai pu lancer ma première entreprise. Une expérience inoubliable.',
    rating: 5
  },
  {
    name: 'Laura Petit',
    role: 'Chef d\'entreprise',
    text: 'L\'accompagnement personnalisé et la qualité des formateurs font la différence.',
    rating: 4
  }
]

export default function AboutPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')

  const handleVideoOpen = (videoUrl) => {
    setSelectedVideo(videoUrl)
    setIsVideoOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <AboutHero onVideoClick={() => handleVideoOpen('https://www.youtube.com/embed/dQw4w9WgXcQ')} />

        {/* Statistiques */}
        <AboutStats />

        {/* Mission */}
        <AboutMission />

        {/* Valeurs */}
        <AboutValues />

        {/* Équipe */}
        <AboutTeam />

        {/* Timeline */}
        <AboutTimeline />

      </main>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={selectedVideo}
        title="Présentation Diamond Centre"
      />
    </div>
  )
}