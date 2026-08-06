'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave, FaCalendar, FaMapMarker, FaDollarSign, FaUsers } from 'react-icons/fa'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const categories = [
  'conférence',
  'séminaire',
  'formation',
  'atelier',
  'webinaire',
  'autre'
]

export default function NewEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [hasPromotion, setHasPromotion] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      currency: 'XAF',
      capacity: 50,
      price: 0,
      promotion: {
        nombre: 0,
        pourcentage: 0,
        duree: 7,
        sexe: 'tous'
      }
    }
  })

  const price = watch('price')
  const promotionPercentage = watch('promotion.pourcentage')
  const promoPrice = price && promotionPercentage ? price * (1 - promotionPercentage / 100) : 0

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      const eventData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        currency: data.currency,
        start_date: data.startDate,
        end_date: data.endDate,
        location: data.location,
        category: data.category,
        capacity: parseInt(data.capacity),
        image_url: data.imageUrl || null,
        promotion: hasPromotion && data.promotion.nombre > 0 ? {
          nombre: parseInt(data.promotion.nombre),
          sexe: data.promotion.sexe || 'tous',
          pourcentage: parseFloat(data.promotion.pourcentage),
          duree: parseInt(data.promotion.duree) || 7,
          description: data.promotion.description || ''
        } : null
      }

      const response = await api.post('/events', eventData)
      
      toast.success('Événement créé avec succès !')
      router.push('/dashboard/events')
    } catch (error) {
      console.error('Erreur création:', error)
      toast.error(error.response?.data?.error || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Nouvel événement</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                {...register('title', { required: 'Le titre est requis' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="Titre de l'événement"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="Description de l'événement"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                {...register('category', { required: 'La catégorie est requise' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Capacité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité *
              </label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  {...register('capacity', { 
                    required: 'La capacité est requise',
                    min: { value: 1, message: 'Minimum 1 place' }
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                  placeholder="Nombre de places"
                />
              </div>
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix *
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Le prix est requis',
                    min: { value: 0, message: 'Le prix doit être positif' }
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                  placeholder="0"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Devise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                {...register('currency')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              >
                <option value="XAF">XAF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Date début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('startDate', { required: 'La date de début est requise' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            {/* Date fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin *
              </label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('endDate', { required: 'La date de fin est requise' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>

            {/* Lieu */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu *
              </label>
              <div className="relative">
                <FaMapMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('location', { required: 'Le lieu est requis' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                  placeholder="Ville, Pays"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image
              </label>
              <input
                {...register('imageUrl')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
          </div>

          {/* Promotion */}
          <div className="border-t border-gray-200 pt-6">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={hasPromotion}
                onChange={(e) => setHasPromotion(e.target.checked)}
                className="w-4 h-4 text-dice-blue rounded focus:ring-dice-blue"
              />
              Ajouter une promotion
            </label>

            {hasPromotion && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Nombre de places en promo
                  </label>
                  <input
                    type="number"
                    {...register('promotion.nombre')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pourcentage de réduction (%)
                  </label>
                  <input
                    type="number"
                    {...register('promotion.pourcentage')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                    placeholder="20"
                  />
                  {promotionPercentage > 0 && (
                    <p className="mt-1 text-sm text-green-600">
                      Prix promo: {promoPrice.toFixed(2)} XAF
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Durée (jours)
                  </label>
                  <input
                    type="number"
                    {...register('promotion.duree')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                    placeholder="7"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Public cible
                  </label>
                  <select
                    {...register('promotion.sexe')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                  >
                    <option value="tous">Tous</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Description de la promotion
                  </label>
                  <input
                    {...register('promotion.description')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                    placeholder="Description de la promotion"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Création...
                </>
              ) : (
                <>
                  <FaSave />
                  Créer l'événement
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}