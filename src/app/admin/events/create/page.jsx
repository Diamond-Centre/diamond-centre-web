/**
 * Création d'événement - Admin (version avec soumission manuelle)
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FaArrowLeft, FaSave, FaImage, FaTimes, FaUpload, FaTag } from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import Image from 'next/image'

const eventSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis').min(3, 'Titre trop court'),
  description: yup.string().required('La description est requise').min(10, 'Description trop courte'),
  price: yup.number().required('Le prix est requis').min(0, 'Le prix doit être positif'),
  currency: yup.string().default('XAF'),
  start_date: yup.string().required('La date de début est requise'),
  end_date: yup.string().required('La date de fin est requise'),
  start_time: yup.string().required('L\'heure de début est requise'),
  end_time: yup.string().required('L\'heure de fin est requise'),
  location: yup.string().required('Le lieu est requis'),
  category: yup.string().required('La catégorie est requise'),
  capacity: yup.number().required('La capacité est requise').min(1, 'Capacité minimale de 1'),
  image_url: yup.string().nullable(),
  hasPromotion: yup.boolean(),
  promotion: yup.object().shape({
    nombre: yup.number().nullable(),
    sexe: yup.string().nullable(),
    pourcentage: yup.number().nullable(),
    duree: yup.number().nullable(),
    description: yup.string().nullable()
  })
})

export default function CreateEvent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
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

  const [errors, setErrors] = useState({})

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: formErrors }
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      currency: 'XAF',
      category: 'conférence',
      capacity: 50,
      price: 0,
      image_url: '',
      start_time: '09:00',
      end_time: '17:00',
      hasPromotion: false,
      promotion: {
        nombre: '',
        sexe: 'tous',
        pourcentage: '',
        duree: '',
        description: ''
      }
    }
  })

  const watchHasPromotion = watch('hasPromotion')

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

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
    setValue('image_url', '')
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setValue('image_url', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Fonction de soumission manuelle
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log('🚀🚀🚀 SOUMISSION MANUELLE !!! 🚀🚀🚀')
    
    // Récupérer les données du formulaire
    const data = {
      title: document.getElementById('title')?.value || '',
      description: document.getElementById('description')?.value || '',
      price: Number(document.getElementById('price')?.value) || 0,
      currency: document.getElementById('currency')?.value || 'XAF',
      start_date: document.getElementById('start_date')?.value || '',
      end_date: document.getElementById('end_date')?.value || '',
      start_time: document.getElementById('start_time')?.value || '09:00',
      end_time: document.getElementById('end_time')?.value || '17:00',
      location: document.getElementById('location')?.value || '',
      category: document.getElementById('category')?.value || 'conférence',
      capacity: Number(document.getElementById('capacity')?.value) || 50,
      hasPromotion: document.getElementById('hasPromotion')?.checked || false,
      promotion: {
        nombre: document.getElementById('promotion_nombre')?.value || '',
        sexe: document.getElementById('promotion_sexe')?.value || 'tous',
        pourcentage: document.getElementById('promotion_pourcentage')?.value || '',
        duree: document.getElementById('promotion_duree')?.value || '',
        description: document.getElementById('promotion_description')?.value || ''
      }
    }

    console.log('📋 Données récupérées:', data)
    
    try {
      setLoading(true)
      setError(null)
      
      const token = auth.getToken()
      console.log('🔑 Token présent:', token ? 'Oui' : 'Non')
      
      if (!token) {
        toast.error('Vous devez être connecté')
        setLoading(false)
        return
      }

      let finalImageUrl = ''
      
      if (imageFile) {
        setUploading(true)
        try {
          console.log('📤 Upload de l\'image...')
          const uploadResult = await api.uploadImage(imageFile)
          finalImageUrl = uploadResult.url
          console.log('✅ Image uploadée:', finalImageUrl)
          toast.success('Image téléchargée avec succès')
        } catch (err) {
          console.error('❌ Erreur upload image:', err)
          toast.error(err.message || 'Erreur lors du téléchargement de l\'image')
          setUploading(false)
          setLoading(false)
          return
        } finally {
          setUploading(false)
        }
      }

      const formattedData = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        currency: data.currency || 'XAF',
        start_date: data.start_date,
        end_date: data.end_date,
        start_time: data.start_time || '09:00',
        end_time: data.end_time || '17:00',
        location: data.location.trim(),
        category: data.category,
        capacity: Number(data.capacity),
        image_url: finalImageUrl,
        status: 'published'
      }

      if (data.hasPromotion && data.promotion) {
        const promo = data.promotion
        const pourcentage = Number(promo.pourcentage)
        if (pourcentage > 0) {
          formattedData.promotion = {
            nombre: Number(promo.nombre) || 0,
            sexe: promo.sexe || 'tous',
            pourcentage: pourcentage,
            duree: Number(promo.duree) || 0,
            description: promo.description || ''
          }
        }
      }

      console.log('📤 Envoi au backend:', JSON.stringify(formattedData, null, 2))
      
      const result = await api.createEvent(formattedData, token)
      
      console.log('✅ Événement créé:', result)
      
      toast.success('Événement créé avec succès !')
      
      setTimeout(() => {
        router.push('/admin/events')
      }, 1000)
      
    } catch (err) {
      console.error('❌ Erreur:', err)
      setError(err.message)
      toast.error(err.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Nouvel événement</h1>
          <p className="text-gray-500">L'événement sera immédiatement visible sur la page publique</p>
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
                  <p className="text-sm text-gray-500">Cliquez pour sélectionner une image</p>
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
                className="w-4 h-4 text-dice-blue rounded focus:ring-dice-blue"
              />
              <span className="text-sm text-gray-600">Activer une promotion</span>
            </label>
          </div>

          {/* La section promotion sera affichée via JS */}
          <div id="promotionFields" style={{ display: 'none' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de places *
                </label>
                <input
                  id="promotion_nombre"
                  name="promotion_nombre"
                  type="number"
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
                  placeholder="Description de la promotion"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>
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
            {uploading ? 'Téléchargement...' : 'Publier l\'événement'}
          </Button>
        </div>
      </form>

      {/* Script pour afficher/masquer les champs de promotion */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const checkbox = document.getElementById('hasPromotion');
            const promotionFields = document.getElementById('promotionFields');
            
            if (checkbox && promotionFields) {
              checkbox.addEventListener('change', function() {
                if (this.checked) {
                  promotionFields.style.display = 'block';
                } else {
                  promotionFields.style.display = 'none';
                }
              });
            }
          });
        `
      }} />
    </div>
  )
}