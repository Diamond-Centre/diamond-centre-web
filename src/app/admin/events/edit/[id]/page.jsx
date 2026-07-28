/**
 * Modification d'événement - Admin avec suppression des promotions
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FaArrowLeft, FaSave, FaImage, FaTimes, FaUpload, FaSpinner, FaTag } from 'react-icons/fa'
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
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      currency: 'XAF',
      category: 'conférence',
      capacity: 50,
      price: 0,
      image_url: '',
      hasPromotion: false,
      promotion: {
        nombre: '',
        sexe: '',
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
      
      setValue('title', event.title || '')
      setValue('description', event.description || '')
      setValue('price', event.price || 0)
      setValue('currency', event.currency || 'XAF')
      setValue('start_date', event.start_date || '')
      setValue('end_date', event.end_date || '')
      setValue('location', event.location || '')
      setValue('category', event.category || 'conférence')
      setValue('capacity', event.capacity || 50)
      setValue('image_url', event.image_url || '')
      
      // Charger la promotion si présente
      if (event.promotion && event.promotion.pourcentage && event.promotion.pourcentage > 0) {
        setValue('hasPromotion', true)
        setValue('promotion.nombre', event.promotion.nombre || '')
        setValue('promotion.sexe', event.promotion.sexe || '')
        setValue('promotion.pourcentage', event.promotion.pourcentage || '')
        setValue('promotion.duree', event.promotion.duree || '')
        setValue('promotion.description', event.promotion.description || '')
      } else {
        setValue('hasPromotion', false)
      }
      
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
    setValue('image_url', '')
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setRemoveExistingImage(true)
    setCurrentImage(null)
    setValue('image_url', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

 const onSubmit = async (data) => {
  try {
    setLoading(true)
    setError(null)
    
    const token = auth.getToken()
    if (!token) {
      toast.error('Vous devez être connecté')
      return
    }

    let finalImageUrl = ''

    if (imageFile) {
      setUploading(true)
      try {
        const uploadResult = await api.uploadImage(imageFile)
        finalImageUrl = uploadResult.url
        toast.success('Image téléchargée avec succès')
      } catch (err) {
        toast.error(err.message || 'Erreur lors du téléchargement de l\'image')
        console.error(err)
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

    // Construire les données de promotion UNIQUEMENT si activée
    let promotionData = undefined
    if (data.hasPromotion) {
      const promo = data.promotion
      // Vérifier que le pourcentage est valide (supérieur à 0)
      if (promo.pourcentage && Number(promo.pourcentage) > 0) {
        promotionData = {
          nombre: Number(promo.nombre) || 0,
          sexe: promo.sexe === '' ? 'tous' : promo.sexe,
          pourcentage: Number(promo.pourcentage),
          duree: Number(promo.duree) || 0,
          description: promo.description || ''
        }
      }
    }
    // Si hasPromotion est false, promotionData reste undefined
    // donc la promotion sera supprimée de l'événement

    const formattedData = {
      title: data.title.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      currency: data.currency || 'XAF',
      start_date: data.start_date,
      end_date: data.end_date,
      location: data.location.trim(),
      category: data.category,
      capacity: Number(data.capacity),
      image_url: finalImageUrl,
      hasPromotion: data.hasPromotion || false,
      promotion: promotionData
    }

    console.log('📤 Mise à jour événement:', {
      ...formattedData,
      promotion: promotionData ? 'Présente' : 'Supprimée'
    })
    
    const result = await api.updateEvent(id, formattedData, token)
    
    toast.success('Événement mis à jour avec succès !')
    
    setTimeout(() => {
      router.push('/admin/events')
    }, 1000)
    
  } catch (err) {
    console.error('❌ Erreur mise à jour:', err)
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <Input
                {...register('title')}
                placeholder="Titre de l'événement"
                error={errors.title?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                {...register('category')}
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
              {...register('description')}
              rows={4}
              placeholder="Description complète de l'événement"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (FCFA) *
              </label>
              <Input
                {...register('price')}
                type="number"
                placeholder="0"
                error={errors.price?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité *
              </label>
              <Input
                {...register('capacity')}
                type="number"
                placeholder="50"
                error={errors.capacity?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <Input
                {...register('start_date')}
                type="date"
                error={errors.start_date?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin *
              </label>
              <Input
                {...register('end_date')}
                type="date"
                error={errors.end_date?.message}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu *
            </label>
            <Input
              {...register('location')}
              placeholder="Abidjan, Plateau"
              error={errors.location?.message}
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
                type="checkbox"
                {...register('hasPromotion')}
                className="w-4 h-4 text-dice-blue rounded focus:ring-dice-blue"
              />
              <span className="text-sm text-gray-600">Activer une promotion</span>
            </label>
          </div>

          {watchHasPromotion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de places *
                </label>
                <Input
                  {...register('promotion.nombre')}
                  type="number"
                  placeholder="50"
                  required={watchHasPromotion}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexe ciblé
                </label>
                <select
                  {...register('promotion.sexe')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                >
                  <option value="">Tous</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pourcentage de réduction (%) *
                </label>
                <Input
                  {...register('promotion.pourcentage')}
                  type="number"
                  placeholder="20"
                  required={watchHasPromotion}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (jours) *
                </label>
                <Input
                  {...register('promotion.duree')}
                  type="number"
                  placeholder="7"
                  required={watchHasPromotion}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description de la promotion
                </label>
                <Input
                  {...register('promotion.description')}
                  placeholder="Description de la promotion"
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