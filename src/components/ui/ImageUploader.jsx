'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCloudUploadAlt, FaTimes, FaImage, FaSpinner } from 'react-icons/fa'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ImageUploader({ 
  value, 
  onChange, 
  label = 'Image de l\'événement',
  className = '',
  placeholder = '/images/events/placeholder.jpg'
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const fileInputRef = useRef(null)

  const handleFileSelect = async (file) => {
    if (!file) return

    // Vérification du type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast.error('Type de fichier non supporté')
      return
    }

    // Vérification de la taille
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB')
      return
    }

    // Upload du fichier
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setPreview(data.url)
        onChange(data.url)
        toast.success('Image uploadée avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error('Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging
            ? 'border-dice-blue bg-dice-blue/5'
            : preview
              ? 'border-green-500 bg-green-50/50'
              : 'border-gray-300 hover:border-dice-blue/50 bg-gray-50/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Aperçu de l'image */}
        {preview ? (
          <div className="relative group">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={preview}
                alt="Aperçu de l'événement"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Overlay au survol - Uniquement Supprimer */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="px-5 py-2.5 bg-red-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <FaTimes className="text-sm" />
                Supprimer l'image
              </button>
            </div>

            {/* Badge de chargement */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <FaSpinner className="text-3xl animate-spin mx-auto mb-2" />
                  <p className="text-sm">Upload en cours...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Zone de dépôt
          <div
            className="relative aspect-video flex flex-col items-center justify-center cursor-pointer p-8"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="text-center">
                <FaSpinner className="text-3xl animate-spin text-dice-blue mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Upload en cours...</p>
              </div>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-dice-blue/20' : 'bg-gray-100'
                }`}>
                  <FaCloudUploadAlt className={`text-3xl ${
                    isDragging ? 'text-dice-blue' : 'text-gray-400'
                  }`} />
                </div>
                <p className="mt-3 text-sm text-gray-600 font-medium">
                  {isDragging ? 'Déposez l\'image ici' : 'Cliquez ou glissez une image'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP, GIF, SVG • Max 5MB
                </p>
                <p className="text-xs text-dice-blue/70 mt-2">
                  ou utilisez une URL existante ci-dessous
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Champ URL alternatif */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaImage className="text-gray-400" />
        </div>
        <input
          type="text"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value)
            onChange(e.target.value)
          }}
          placeholder="https://exemple.com/image.jpg ou /images/events/..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm placeholder-gray-400"
        />
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors group"
          >
            <FaTimes className="text-sm group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </div>
  )
}