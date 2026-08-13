'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave, FaCalendar, FaMapMarker, FaDollarSign, FaUsers } from 'react-icons/fa'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

const categories = ['conférence', 'séminaire', 'formation', 'atelier', 'webinaire', 'autre']

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      currency: 'XAF',
      capacity: 50,
      price: 0
    }
  })

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
        image_url: data.imageUrl || null
      }

      await api.post('/events', eventData)
      
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                {...register('title', { required: 'Le titre est requis' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                placeholder="Titre de l'événement"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                placeholder="Description de l'événement"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                {...register('category', { required: 'La catégorie est requise' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            {/* Capacité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité *</label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  {...register('capacity', { required: 'La capacité est requise', min: 1 })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                  placeholder="Nombre de places"
                />
              </div>
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Le prix est requis', min: 0 })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                  placeholder="0"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>

            {/* Devise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select {...register('currency')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue">
                <option value="XAF">XAF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Date début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('startDate', { required: 'La date de début est requise' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                />
              </div>
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
            </div>

            {/* Date fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('endDate', { required: 'La date de fin est requise' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                />
              </div>
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
            </div>

            {/* Lieu */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
              <div className="relative">
                <FaMapMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('location', { required: 'Le lieu est requis' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dice-blue"
                  placeholder="Ville, Pays"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : <><FaSave /> Créer l'événement</>}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}