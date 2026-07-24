/**
 * Création d'événement - Admin
 * Synchronisé avec la page publique /events
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

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
  image_url: yup.string().url('URL invalide').nullable(),
})

export default function CreateEvent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      currency: 'XAF',
      category: 'conférence',
      capacity: 50,
      price: 0,
      image_url: ''
    }
  })

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = auth.getToken()
      
      // Formatage des données pour le backend
      const formattedData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        currency: data.currency || 'XAF',
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        category: data.category,
        capacity: Number(data.capacity),
        image_url: data.image_url || '',
        status: 'published' // Directement publié
      }

      console.log('📤 Création événement:', formattedData)
      
      const result = await api.createEvent(formattedData, token)
      
      console.log('✅ Événement créé:', result)
      
      toast.success('Événement créé avec succès ! Visible sur la page publique.')
      
      // Rediriger vers la liste des événements admin
      setTimeout(() => {
        router.push('/admin/events')
      }, 1000)
      
    } catch (err) {
      console.error('❌ Erreur création:', err)
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de l'image
            </label>
            <Input
              {...register('image_url')}
              placeholder="https://example.com/image.jpg"
              error={errors.image_url?.message}
            />
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
            loading={loading}
            disabled={loading}
          >
            <FaSave className="mr-2" />
            Publier l'événement
          </Button>
        </div>
      </form>
    </div>
  )
}