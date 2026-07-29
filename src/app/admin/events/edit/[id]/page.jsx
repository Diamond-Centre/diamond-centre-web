/**
 * Modification d'événement - Admin (version simplifiée)
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FaArrowLeft, FaSave, FaImage, FaTimes, FaUpload, FaTag } from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Image from 'next/image'

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
    category: 'conférence',
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'événement</h1>
          <p className="text-gray-500">Modifiez les informations de l'événement</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titre de l'événement"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              >
                <option value="conférence">Conférence</option>
                <option value="séminaire">Séminaire</option>
                <option value="formation">Formation</option>
                <option value="atelier">Atelier</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Description complète de l'événement"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (FCFA) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité *
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin *
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début *
              </label>
              <input
                id="start_time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin *
              </label>
              <input
                id="end_time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu *
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Abidjan, Plateau"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              required
            />
          </div>

          {/* Image */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image de l'événement
            </label>
            
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-dice-blue shadow-md">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      Nouvelle image
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : currentImage && !removeExistingImage ? (
                <div className="relative inline-block">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                    <Image
                      src={currentImage}
                      alt="Image actuelle"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      Image actuelle
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-dice-blue hover:bg-dice-blue/5 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour ajouter une image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG • Max 5MB</p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-dice-blue">
                    <FaUpload />
                    <span>Choisir un fichier</span>
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
                <p className="text-xs text-gray-400 mt-2">Image actuelle - Cliquez pour modifier</p>
              )}
            </div>
          </div>
        </div>

        {/* Section Promotion */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaTag className="text-dice-blue" />
              <h2 className="text-lg font-semibold text-gray-800">Promotion</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="hasPromotion"
                name="hasPromotion"
                type="checkbox"
                checked={formData.hasPromotion}
                onChange={handleInputChange}
                className="w-4 h-4 text-dice-blue rounded focus:ring-dice-blue"
              />
              <span className="text-sm text-gray-600">Activer une promotion</span>
            </label>
          </div>

          {formData.hasPromotion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de places *
                </label>
                <input
                  id="promotion_nombre"
                  name="promotion_nombre"
                  type="number"
                  value={formData.promotion.nombre}
                  onChange={handleInputChange}
                  placeholder="50"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexe ciblé
                </label>
                <select
                  id="promotion_sexe"
                  name="promotion_sexe"
                  value={formData.promotion.sexe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                >
                  <option value="tous">Tous</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pourcentage de réduction (%) *
                </label>
                <input
                  id="promotion_pourcentage"
                  name="promotion_pourcentage"
                  type="number"
                  value={formData.promotion.pourcentage}
                  onChange={handleInputChange}
                  placeholder="20"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (jours) *
                </label>
                <input
                  id="promotion_duree"
                  name="promotion_duree"
                  type="number"
                  value={formData.promotion.duree}
                  onChange={handleInputChange}
                  placeholder="7"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description de la promotion
                </label>
                <input
                  id="promotion_description"
                  name="promotion_description"
                  value={formData.promotion.description}
                  onChange={handleInputChange}
                  placeholder="Description de la promotion"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading || uploading}
            disabled={loading || uploading}
          >
            <FaSave className="mr-2" />
            {uploading ? 'Téléchargement...' : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </div>
  )
}