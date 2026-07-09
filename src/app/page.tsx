'use client'

import { useState } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { 
  FaGraduationCap, 
  FaUsers, 
  FaStar, 
  FaAward 
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// Composants layout
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/layout/HeroSection'
import WhyDiceSection from '@/components/layout/WhyDiceSection'
import TestimonialsSection from '@/components/layout/TestimonialsSection'
import CTASection from '@/components/layout/CTASection'
import Footer from '@/components/layout/Footer'
import VideoModal from '@/components/layout/VideoModal'
import Section from '@/components/ui/Section'
import EventCard from '@/components/events/EventCard'

// Types
interface CarouselImage {
  src: string
  alt: string
  title: string
  description: string
  videoUrl: string
}

interface Stat {
  icon: IconType
  label: string
  value: string
}

interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
}

// Données du carousel
const carouselImages: CarouselImage[] = [
  {
    src: '/images/formation/img1.jpg',
    alt: 'Diamond Centre - Formation',
    title: 'Formations d\'excellence',
    description: 'Des programmes adaptés à vos besoins',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    src: '/images/formation/img2.jpg',
    alt: 'Diamond Centre - Conférence',
    title: 'Conférences Inspirantes',
    description: 'Des moments de partage et de motivation',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    src: '/images/formation/img3.jpg',
    alt: 'Diamond Centre - Atelier',
    title: 'Ateliers Pratiques',
    description: 'Mettez en pratique vos connaissances',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    src: '/images/formation/img4.jpg',
    alt: 'Diamond Centre - Séminaire',
    title: 'Séminaires Transformateurs',
    description: 'Des expériences qui changent des vies',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    src: '/images/formation/img5.jpg',
    alt: 'Diamond Centre - Événement',
    title: 'Événements Exclusifs',
    description: 'Des opportunités uniques de développement',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
]

// Statistiques avec différentes icônes
const stats: Stat[] = [
  { icon: FaGraduationCap, label: 'Formations', value: '50+' },
  { icon: FaUsers, label: 'Participants', value: '5 000+' },
  { icon: FaStar, label: 'Satisfaction', value: '98%' },
  { icon: FaAward, label: 'Experts', value: '20+' }
]

// Témoignages
const testimonials: Testimonial[] = [
  {
    name: 'Sophie Martin',
    role: 'Entrepreneure',
    text: 'Les conférences de motivation du Dr SONFFO ont transformé ma vision des choses.',
    rating: 5
  },
  {
    name: 'Thomas Dubois',
    role: 'Étudiant',
    text: 'Le séminaire ÉTUPRENEUR m\'a donné les clés pour lancer ma première entreprise.',
    rating: 5
  },
  {
    name: 'Laura Petit',
    role: 'Chef d\'entreprise',
    text: 'L\'école de l\'art oratoire m\'a permis de gagner en confiance.',
    rating: 4
  }
]

export default function Home() {
  const { events, loading } = useEvents()
  const { user } = useAuth()
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false)
  const [selectedVideo, setSelectedVideo] = useState<string>('')

  // Filtrer les événements à venir
  const upcomingEvents = events
    ?.filter(e => e.statut === 'à venir')
    ?.slice(0, 6) || []

  // Gestion de la vidéo
  const handleVideoOpen = (videoUrl: string) => {
    setSelectedVideo(videoUrl)
    setIsVideoOpen(true)
  }

  // Contenu du hero
  const heroTitle = `
    <span class="gradient-text">Diamond Centre</span>
    <br />
    <span class="text-gray-800">Votre développement</span>
    <br />
    <span class="text-gray-600">commence ici</span>
  `

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <HeroSection
          badge="Diamond Centre - Depuis 2015"
          title={heroTitle}
          subtitle="Des conférences, séminaires et formations d'excellence animés par des experts passionnés pour révéler votre potentiel."
          stats={stats}
          carouselImages={carouselImages}
          onVideoClick={handleVideoOpen}
          primaryCta={{ text: 'Explorer les formations', href: '/events' }}
        />

        {/* Why Dice Section */}
        <WhyDiceSection />

        {/* Événements à venir */}
        <Section
          badge="À venir"
          title="Événements Diamond Centre"
          subtitle="Découvrez nos prochains événements et réservez votre place."
          className="bg-gray-50"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onVideoClick={handleVideoOpen} />
              ))
            )}
          </div>
        </Section>

        {/* Témoignages */}
        <TestimonialsSection
          testimonials={testimonials}
          bgClass="bg-gradient-to-br from-dice-blue to-purple-600 text-white"
        />

        {/* CTA */}
        <CTASection
          title="Prêt à transformer votre vie ?"
          subtitle="Rejoignez des milliers de personnes qui ont déjà fait le choix de l'excellence avec Diamond Centre."
          primaryCta={{ text: 'Commencer gratuitement', href: '/auth/register' }}
          secondaryCta={{ text: 'Explorer nos services', href: '/events' }}
        />
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