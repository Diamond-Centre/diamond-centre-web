'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { 
  FaArrowRight, 
  FaCalendar, 
  FaMapMarker, 
  FaUser, 
  FaEuroSign,
  FaPlay,
  FaStar,
  FaUsers,
  FaGraduationCap,
  FaVideo,
  FaHeadset,
  FaChevronRight,
  FaClock,
  FaAward,
  FaChevronLeft,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaCircle,
  FaRegCircle
} from 'react-icons/fa'
import { GiDiamondRing, GiTeacher } from 'react-icons/gi'
import toast from 'react-hot-toast'

// Images du carousel
const carouselImages = [
  {
    src: '/images/formation/img1.jpg',
    alt: 'Formation Dice - Image 1',
    title: 'Formations d\'excellence',
    description: 'Des programmes adaptés à vos besoins'
  },
  {
    src: '/images/formation/img2.jpg',
    alt: 'Formation Dice - Image 2',
    title: 'Experts passionnés',
    description: 'Apprenez avec les meilleurs'
  },
  {
    src: '/images/formation/img3.jpg',
    alt: 'Formation Dice - Image 3',
    title: 'Ateliers pratiques',
    description: 'Mettez en pratique vos connaissances'
  },
  {
    src: '/images/formation/img4.jpg',
    alt: 'Formation Dice - Image 4',
    title: 'Conférences inspirantes',
    description: 'Découvrez les tendances de demain'
  },
  {
    src: '/images/formation/img5.jpg',
    alt: 'Formation Dice - Image 5',
    title: 'Séminaires interactifs',
    description: 'Échangez et partagez vos expériences'
  }
]

export default function Home() {
  const { events, loading } = useEvents()
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Carousel auto-slide
  useEffect(() => {
    let interval
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Statistiques
  const stats = [
    { icon: FaGraduationCap, label: 'Formations', value: '150+' },
    { icon: FaUsers, label: 'Étudiants', value: '12 000+' },
    { icon: FaStar, label: 'Satisfaction', value: '98%' },
    { icon: FaAward, label: 'Experts', value: '50+' }
  ]

  // Valeurs
  const values = [
    {
      icon: GiDiamondRing,
      title: 'Excellence',
      description: 'Des formations de qualité dispensées par des experts reconnus'
    },
    {
      icon: FaUsers,
      title: 'Communauté',
      description: 'Rejoignez une communauté de professionnels passionnés'
    },
    {
      icon: FaVideo,
      title: 'Flexibilité',
      description: 'Formations en présentiel et à distance selon vos besoins'
    },
    {
      icon: FaHeadset,
      title: 'Accompagnement',
      description: 'Un suivi personnalisé tout au long de votre parcours'
    }
  ]

  // Témoignages
  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'Data Scientist',
      image: '/images/testimonials/1.jpg',
      text: 'Une formation exceptionnelle qui a transformé ma carrière. Les formateurs sont passionnants et les contenus très actuels.',
      rating: 5
    },
    {
      name: 'Thomas Dubois',
      role: 'CTO, Startup Innov',
      image: '/images/testimonials/2.jpg',
      text: 'J\'ai suivi plusieurs formations chez Dice et chaque fois, j\'en ressors avec des compétences concrètes et utilisables immédiatement.',
      rating: 5
    },
    {
      name: 'Laura Petit',
      role: 'Product Manager',
      image: '/images/testimonials/3.jpg',
      text: 'L\'approche pratique et les études de cas réelles font toute la différence. Je recommande vivement !',
      rating: 4
    }
  ]

  const upcomingEvents = events.slice(0, 6)

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section avec carousel */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10"></div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            style={{ opacity }}
          />
        </div>

        {/* Formes flottantes animées */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte Hero */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">+ 150 formations disponibles</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dice
                </span>
                <br />
                <span className="text-white">Votre avenir</span>
                <br />
                <span className="text-white/90">commence ici</span>
              </motion.h1>

              <motion.p 
                className="text-xl text-white/80 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Des formations d'excellence en séminaires, conférences et ateliers, 
                animées par des experts passionnés.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/events">
                  <motion.button 
                    className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explorer les formations
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <motion.button
                  onClick={() => setIsVideoOpen(true)}
                  className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-3 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaPlay className="text-blue-600 ml-1" />
                  </div>
                  Voir la présentation
                </motion.button>
              </motion.div>

              {/* Stats Hero */}
              <motion.div 
                className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <stat.icon className="text-3xl text-blue-400 mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Carousel d'images avec flèches */}
            <motion.div 
              className="relative"
              style={{ y: y1 }}
            >
              <div 
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Container du carousel */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={carouselImages[currentSlide].src}
                        alt={carouselImages[currentSlide].alt}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        priority
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Texte superposé sur l'image */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <motion.h3 
                          className="text-white text-xl font-bold mb-1"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {carouselImages[currentSlide].title}
                        </motion.h3>
                        <motion.p 
                          className="text-white/80 text-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {carouselImages[currentSlide].description}
                        </motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Floating badges */}
                  <motion.div 
                    className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <FaStar className="text-yellow-400" />
                      <span className="text-sm font-medium">4.9/5</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <GiTeacher className="text-blue-400" />
                      <span className="text-sm font-medium">50+ Experts</span>
                    </div>
                  </motion.div>

                  {/* Indicateurs de progression */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="focus:outline-none"
                      >
                        {index === currentSlide ? (
                          <FaCircle className="text-white text-xs" />
                        ) : (
                          <FaRegCircle className="text-white/50 text-xs hover:text-white/80 transition-colors" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Flèches directionnelles hors du cadre */}
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden lg:block">
                <motion.button
                  onClick={prevSlide}
                  className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/20 shadow-xl"
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronCircleLeft className="text-3xl" />
                </motion.button>
              </div>

              <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:block">
                <motion.button
                  onClick={nextSlide}
                  className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/20 shadow-xl"
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronCircleRight className="text-3xl" />
                </motion.button>
              </div>

              {/* Flèches responsives (visibles sur mobile/tablette) */}
              <div className="absolute inset-y-0 left-2 flex items-center lg:hidden">
                <button
                  onClick={prevSlide}
                  className="bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-all"
                >
                  <FaChevronLeft className="text-xl" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-2 flex items-center lg:hidden">
                <button
                  onClick={nextSlide}
                  className="bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-all"
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </div>

              {/* Formes décoratives */}
              <motion.div 
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronRight className="rotate-90 text-2xl" />
        </motion.div>
      </section>

      {/* Reste de la page... */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Pourquoi Dice</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">L'excellence à chaque étape</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous nous engageons à vous offrir une expérience d'apprentissage unique 
              et transformatrice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <value.icon className="text-4xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section "Formations à venir" */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex justify-between items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">À venir</span>
              <h2 className="text-4xl font-bold mt-2">Formations populaires</h2>
            </div>
            <Link href="/events">
              <motion.button 
                className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                whileHover={{ x: 5 }}
              >
                Voir toutes <FaArrowRight className="text-sm" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image || '/images/events/placeholder.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
                    {event.type}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar className="text-blue-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarker className="text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUser className="text-blue-600" />
                      <span>{event.instructor}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{event.price} €</span>
                    <Link href={`/events/${event.id}`}>
                      <motion.button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Réserver
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm">Témoignages</span>
            <h2 className="text-4xl font-bold mt-2">Ce que disent nos étudiants</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà fait le choix de l'excellence avec Dice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register">
                <motion.button
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Commencer gratuitement
                </motion.button>
              </Link>
              <Link href="/events">
                <motion.button
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/30 hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explorer les formations
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 rounded-full p-2 transition-all"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}