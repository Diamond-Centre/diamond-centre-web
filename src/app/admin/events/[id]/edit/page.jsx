'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  FaArrowLeft, 
  FaSave, 
  FaCalendar, 
  FaClock, 
  FaMapMarker, 
  FaTag, 
  FaUsers,
  FaTrash
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import ImageUploader from '@/components/ui/ImageUploader'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    date: '',
    time: '',
    location: '',
    category: 'conference',
    capacity: '',
    image_url: '',
    status: 'published'
  })

  useEffect(() => {
    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          currency: data.currency || 'XAF',
          date: data.date || '',
          time: data.time || '',
          location: data.location || '',
          category: data.category || 'conference',
          capacity: data.capacity || '',
          image_url: data.image_url || '',
          status: data.status || 'published'
        })
      } else if (response.status === 404) {
        toast.error('Événement non trouvé')
        router.push('/admin/events')
      } else {
        toast.error('Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Erreur fetch:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    if (!formData.title || !formData.date || !formData.location) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          capacity: parseInt(formData.capacity) || 0
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Événement modifié avec succès !')
        router.push('/admin/events')
      } else if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter')
        router.push('/auth/login')
      } else {
        toast.error(data.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur modification:', error)
      toast.error('Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer cet événement ? Cette action est irréversible.')) return

    try {
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Événement supprimé')
        router.push('/admin/events')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/admin/events')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Modifier l'événement
          </h1>
          <p className="text-gray-500">Modifiez les informations de l'événement</p>
        </div>
      </div>

      <Card variant="hover" className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image - occupe toute la largeur */}
            <div className="md:col-span-2">
              <ImageUploader
                value={formData.image_url}
                onChange={handleImageChange}
                label="Image de l'événement"
              />
            </div>

            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l'événement *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-gray-400" />
                </div>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Conférence sur l'IA"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all resize-y"
                placeholder="Description détaillée de l'événement..."
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all bg-white"
              >
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>

            {/* Prix et Devise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all bg-white"
              >
                <option value="XAF">XAF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Date et Heure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendar className="text-gray-400" />
                </div>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <Input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Lieu et Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarker className="text-gray-400" />
                </div>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Yaoundé, Douala..."
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all bg-white"
              >
                <option value="conference">Conférence</option>
                <option value="seminaire">Séminaire</option>
                <option value="formation">Formation</option>
                <option value="atelier">Atelier</option>
              </select>
            </div>

            {/* Capacité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="text-gray-400" />
                </div>
                <Input
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="100"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/events')}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
            >
              <FaTrash className="mr-2" />
              Supprimer
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
              className="bg-gradient-to-r from-dice-blue to-purple-600 ml-auto"
            >
              <FaSave className="mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}