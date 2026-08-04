/**
 * Modification d'événement - Admin (version redessinée)
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  FaArrowLeft, 
  FaSave, 
  FaImage, 
  FaTimes, 
  FaUpload, 
  FaTag, 
  FaCalendarAlt, 
  FaClock, 
  FaCoins, 
  FaUsers, 
  FaLayerGroup, 
  FaInfoCircle,
  FaPercentage
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Image from 'next/image'
import LocationPicker from '@/components/maps/LocationPicker'

export default function EditEvent() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  
  const [loading, setLoading] = useState(false)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)
  const [hasPromotion, setHasPromotion] = useState(false)
  const fileInputRef = useRef(null)

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'XAF',
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '17:00',
    location: '',
    latitude: null,
    longitude: null,
    category: 'conference',
    capacity: 50,
    image_url: '',
    hasPromotion: false,
    promotion: {
      nombre: '',
      sexe: 'tous',
      pourcentage: '',
      duree: '',
      description: ''
    }
  })

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    try {
      setLoadingEvent(true)
      const token = auth.getToken()
      const event = await api.getEventById(id, token)
      
      if (!event) {
        toast.error('Événement non trouvé')
        router.push('/admin/events')
        return
      }
      
      setCurrentImage(event.image_url || null)
      
      const hasPromo = event.promotion && event.promotion.pourcentage && Number(event.promotion.pourcentage) > 0
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        price: event.price || 0,
        currency: event.currency || 'XAF',
        start_date: event.start_date || '',
        end_date: event.end_date || '',
        start_time: event.start_time || '09:00',
        end_time: event.end_time || '17:00',
        location: event.location || '',
        latitude: event.latitude ?? null,
        longitude: event.longitude ?? null,
        category: event.category || 'conférence',
        capacity: event.capacity || 50,
        image_url: event.image_url || '',
        hasPromotion: hasPromo,
        promotion: {
          nombre: hasPromo ? event.promotion.nombre || '' : '',
          sexe: hasPromo ? event.promotion.sexe || 'tous' : 'tous',
          pourcentage: hasPromo ? event.promotion.pourcentage || '' : '',
          duree: hasPromo ? event.promotion.duree || '' : '',
          description: hasPromo ? event.promotion.description || '' : ''
        }
      })
      
      setHasPromotion(hasPromo)
      
    } catch (error) {
      console.error('Erreur chargement:', error)
      setError(error.message || 'Erreur lors du chargement')
      toast.error(error.message || 'Erreur lors du chargement')
    } finally {
      setLoadingEvent(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setRemoveExistingImage(true)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setRemoveExistingImage(true)
    setCurrentImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: checked }))
      if (id === 'hasPromotion') {
        setHasPromotion(checked)
      }
    } else if (id && id.startsWith('promotion_')) {
      const field = id.replace('promotion_', '')
      setFormData(prev => ({
        ...prev,
        promotion: { ...prev.promotion, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [id]: value }))
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const token = auth.getToken()
      if (!token) {
        toast.error('Vous devez être connecté')
        setLoading(false)
        return
      }

      let finalImageUrl = ''

      if (imageFile) {
        setUploading(true)
        try {
          const uploadResult = await api.uploadImage(imageFile)
          finalImageUrl = uploadResult.url
        } catch (err) {
          toast.error(err.message || 'Erreur lors du téléchargement de l\'image')
          setUploading(false)
          setLoading(false)
          return
        } finally {
          setUploading(false)
        }
      } 
      else if (removeExistingImage) {
        finalImageUrl = ''
      } 
      else if (currentImage) {
        finalImageUrl = currentImage
      }

      // Construire les données de promotion
      let promotionData = undefined
      if (formData.hasPromotion) {
        const promo = formData.promotion
        if (promo.pourcentage && Number(promo.pourcentage) > 0) {
          promotionData = {
            nombre: Number(promo.nombre) || 0,
            sexe: promo.sexe || 'tous',
            pourcentage: Number(promo.pourcentage),
            duree: Number(promo.duree) || 0,
            description: promo.description || ''
          }
        }
      }

      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        currency: formData.currency || 'XAF',
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_time: formData.start_time || '09:00',
        end_time: formData.end_time || '17:00',
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        category: formData.category,
        capacity: Number(formData.capacity),
        image_url: finalImageUrl,
        hasPromotion: formData.hasPromotion || false,
        promotion: promotionData
      }

      await api.updateEvent(id, formattedData, token)
      
      toast.success('Événement mis à jour avec succès')
      
      setTimeout(() => {
        router.push('/admin/events')
      }, 1000)
      
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (loadingEvent) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-dice-blue/20 animate-ping absolute" />
          <div className="w-12 h-12 rounded-full border-4 border-dice-blue border-t-transparent animate-spin" />
        </div>
        <span className="text-sm font-medium text-gray-500 animate-pulse">Chargement de l'événement...</span>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* En-tête avec bannière style glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A89F2] via-[#0878d6] to-[#0057C2] p-6 text-white shadow-xl">
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/15 " />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl backdrop-blur-md transition-all duration-200 border border-white/10"
            title="Retour"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-dice-blue/30 text-blue-200 border border-blue-400/30">
                Édition Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Modifier l'événement
            </h1>
          </div>
        </div>
      </div>
    </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-600 flex items-center gap-3 animate-shake">
          <FaInfoCircle className="text-xl flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Section 1: Informations Générales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-2.5 bg-dice-blue/10 text-dice-blue rounded-xl">
              <FaLayerGroup className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Informations générales</h2>
              <p className="text-xs text-gray-500">Détails principaux et catégorisation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Conférence Tech 2026"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium cursor-pointer"
              >
                <option value="conference">Conférence</option>
                <option value="seminaire">Séminaire</option>
                <option value="formation">Formation</option>
                <option value="atelier">Atelier</option>
                <option value="webinaire">Webinaire</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Décrivez votre événement de manière attractive..."
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium resize-y"
              required
            />
          </div>

          {/* Tarification & Jauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <FaCoins className="text-dice-blue" /> Prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <FaUsers className="text-dice-blue" /> Capacité totale <span className="text-red-500">*</span>
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Dates et Horaires */}
          <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600">
              <FaCalendarAlt className="text-dice-blue" /> Planning temporel
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Date de début *</label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Date de fin *</label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <FaClock className="text-gray-400" /> Heure de début *
                </label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <FaClock className="text-gray-400" /> Heure de fin *
                </label>
                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Lieu de l'événement <span className="text-red-500">*</span>
            </label>
            <LocationPicker
              location={formData.location}
              latitude={formData.latitude}
              longitude={formData.longitude}
              required
              inputClassName="w-full px-4 py-3 pl-10 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
              onChange={({ location, latitude, longitude }) => {
                setFormData((prev) => ({
                  ...prev,
                  location,
                  latitude,
                  longitude,
                }))
              }}
            />
          </div>

          {/* Visuel principal */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
              <FaImage className="text-dice-blue" /> Bannière / Image de l'événement
            </label>
            
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block group">
                  <div className="relative w-64 h-40 rounded-2xl overflow-hidden border-2 border-dice-blue shadow-lg ring-4 ring-dice-blue/10">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-3 text-white text-[11px] font-semibold bg-dice-blue/80 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      Nouvelle image sélectionnée
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-lg"
                    title="Supprimer l'image"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : currentImage && !removeExistingImage ? (
                <div className="relative inline-block group">
                  <div className="relative w-64 h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                    <Image
                      src={currentImage}
                      alt="Image actuelle"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-3 text-white text-[11px] font-medium bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      Visuel actuel
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-lg"
                    title="Supprimer l'image"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : (
                <div 
                  className="group border-2 border-dashed border-gray-300 hover:border-dice-blue bg-gray-50/50 hover:bg-dice-blue/5 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 group-hover:bg-dice-blue group-hover:text-white text-gray-400 transition-all duration-300">
                    <FaImage className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-dice-blue transition-colors">
                      Glissez votre image ou <span className="underline">parcourez</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Formats acceptés : PNG, JPG, JPEG • Max 5MB</p>
                  </div>
                  <div className="mt-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 group-hover:border-dice-blue/30 group-hover:text-dice-blue shadow-xs flex items-center gap-1.5">
                    <FaUpload className="text-[10px]" />
                    <span>Sélectionner un fichier</span>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {currentImage && !removeExistingImage && !imagePreview && (
                <p className="text-xs text-gray-400 mt-2 italic">
                  Cliquez sur la croix pour remplacer ou retirer le visuel actuel.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Promotion & Offres */}
        <div className={`rounded-2xl border transition-all duration-300 p-6 sm:p-8 space-y-6 ${
          formData.hasPromotion 
            ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-dice-blue/30 shadow-md' 
            : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl transition-colors ${
                formData.hasPromotion ? 'bg-dice-blue text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaTag className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Offre promotionnelle</h2>
                <p className="text-xs text-gray-500">Configurez des réductions spéciales pour attirer du public</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                id="hasPromotion"
                name="hasPromotion"
                type="checkbox"
                checked={formData.hasPromotion}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dice-blue" />
              <span className="ml-3 text-sm font-semibold text-gray-700">
                {formData.hasPromotion ? 'Promotion activée' : 'Activer une promotion'}
              </span>
            </label>
          </div>

          {formData.hasPromotion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Places réservées à la promo *
                </label>
                <input
                  id="promotion_nombre"
                  name="promotion_nombre"
                  type="number"
                  value={formData.promotion.nombre}
                  onChange={handleInputChange}
                  placeholder="50"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Public ciblé
                </label>
                <select
                  id="promotion_sexe"
                  name="promotion_sexe"
                  value={formData.promotion.sexe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium cursor-pointer"
                >
                  <option value="tous">Tous (Hommes & Femmes)</option>
                  <option value="homme">Hommes uniquement</option>
                  <option value="femme">Femmes uniquement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                  <FaPercentage className="text-dice-blue" /> Pourcentage de réduction (%) *
                </label>
                <input
                  id="promotion_pourcentage"
                  name="promotion_pourcentage"
                  type="number"
                  value={formData.promotion.pourcentage}
                  onChange={handleInputChange}
                  placeholder="20"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Durée de l'offre (en jours) *
                </label>
                <input
                  id="promotion_duree"
                  name="promotion_duree"
                  type="number"
                  value={formData.promotion.duree}
                  onChange={handleInputChange}
                  placeholder="7"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Description / Condition de la offre
                </label>
                <input
                  id="promotion_description"
                  name="promotion_description"
                  value={formData.promotion.description}
                  onChange={handleInputChange}
                  placeholder="Ex: Offre Early Bird réservée aux 50 premiers inscrits"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent transition-all outline-none text-gray-800 text-sm font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Barre d'actions fixe / flottante bottom */}
        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 transition-all font-semibold"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading || uploading}
            disabled={loading || uploading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-dice-blue hover:bg-dice-blue/90 shadow-lg shadow-dice-blue/20 transition-all font-bold flex items-center justify-center gap-2"
          >
            <FaSave />
            {uploading ? 'Téléchargement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  )
}