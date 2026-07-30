/**
 * Édition du profil utilisateur
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaImage, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    sexe: '',
    picture: ''
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      router.push('/auth/login')
      return
    }
    
    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        telephone: userData.telephone || '',
        sexe: userData.sexe || '',
        picture: userData.picture || ''
      })
      if (userData.picture) {
        setImagePreview(userData.picture)
      }
    } catch (e) {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      
      let pictureUrl = formData.picture
      
      // Upload de l'image si nouvelle
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('image', imageFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })
        
        if (uploadResponse.ok) {
          const result = await uploadResponse.json()
          pictureUrl = result.url
        }
      }

      const updateData = {
        name: formData.name,
        telephone: formData.telephone,
        sexe: formData.sexe,
        picture: pictureUrl
      }

      const response = await fetch(`${API_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la mise à jour')
      }

      const updatedUser = await response.json()
      
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      toast.success('Profil mis à jour avec succès !')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mon profil</h1>
          <p className="text-gray-500">Modifiez vos informations personnelles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Photo de profil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-dice-blue shadow-lg">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Photo de profil"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                  {formData.name?.charAt(0) || '👤'}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1 bg-dice-blue rounded-full cursor-pointer hover:bg-dice-blue-dark transition-colors">
              <FaImage className="text-white text-sm" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cliquez sur l'icône pour changer la photo</p>
        </div>

        <div className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Email - non modifiable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500"
                disabled
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+237 690142918"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexe
            </label>
            <div className="relative">
              <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="">Sélectionner</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave className="text-sm" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}