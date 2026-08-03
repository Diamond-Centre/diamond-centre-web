/**
 * Édition du profil utilisateur
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaArrowLeft, FaSave, FaUser, FaEnvelope, 
  FaPhone, FaVenusMars, FaCamera, FaTimes,
  FaSpinner
} from 'react-icons/fa'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    sexe: '',
    picture: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (!token || !storedUser) {
      router.push('/auth/login')
      return
    }
    
    setUser(storedUser)
    setFormData({
      name: storedUser.name || '',
      email: storedUser.email || '',
      telephone: storedUser.telephone || '',
      sexe: storedUser.sexe || '',
      picture: storedUser.picture || ''
    })
    if (storedUser.picture) {
      setImagePreview(storedUser.picture)
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
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

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })
      
      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({ ...prev, picture: result.url }))
        toast.success('Photo téléchargée avec succès')
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFormData(prev => ({ ...prev, picture: e.target.result }))
          toast.success('Photo sélectionnée')
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, picture: e.target.result }))
        toast.success('Photo sélectionnée')
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, picture: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simuler la mise à jour du profil
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mettre à jour l'utilisateur localement
      const updatedUser = {
        ...user,
        name: formData.name,
        telephone: formData.telephone,
        sexe: formData.sexe,
        picture: formData.picture
      }
      
      auth.setUser(updatedUser)
      toast.success('Profil mis à jour avec succès !')
      
      setTimeout(() => {
        router.push('/profile')
      }, 1000)
      
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Modifier le profil</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Photo de profil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
            <div className="flex items-center gap-4">
              {isUploading ? (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaSpinner className="animate-spin text-dice-blue text-2xl" />
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-dice-blue shadow-lg">
                    <Image
                      src={imagePreview}
                      alt="Photo"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : (
                <div 
                  className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-dice-blue transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCamera className="text-2xl text-gray-400" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-dice-blue hover:underline"
                >
                  Changer la photo
                </button>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG • Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Email (non modifiable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                disabled
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+237 690142918"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`relative flex items-center justify-center py-2.5 border rounded-lg cursor-pointer transition-all ${
                formData.sexe === 'homme' 
                  ? 'border-dice-blue bg-dice-blue/5 text-dice-blue' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="sexe"
                  value="homme"
                  checked={formData.sexe === 'homme'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 text-sm">
                  <FaVenusMars className="text-blue-500" /> Homme
                </span>
              </label>
              <label className={`relative flex items-center justify-center py-2.5 border rounded-lg cursor-pointer transition-all ${
                formData.sexe === 'femme' 
                  ? 'border-dice-blue bg-dice-blue/5 text-dice-blue' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="sexe"
                  value="femme"
                  checked={formData.sexe === 'femme'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="flex items-center gap-2 text-sm">
                  <FaVenusMars className="text-pink-500" /> Femme
                </span>
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" fullWidth>
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              <FaSave className="mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}