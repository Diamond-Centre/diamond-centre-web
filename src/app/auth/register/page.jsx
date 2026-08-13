/**
 * Page d'inscription - Version responsive optimisée
 */
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle,
  FaUser, FaPhoneAlt, FaVenusMars,
  FaImage, FaTimes, FaSpinner, FaCheckCircle
} from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Navbar'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import { fileToProfileDataUrl, isProfileImageTooLargeError, profileImageTooLargeMessage } from '@/lib/profileImage'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '+237',
    sexe: 'homme',
    picture: '',
    acceptTerms: false,
    role: 'client'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setFormData(prev => ({ ...prev, password }))

    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500'
    if (passwordStrength < 50) return 'bg-orange-500'
    if (passwordStrength < 75) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Faible'
    if (passwordStrength < 50) return 'Moyen'
    if (passwordStrength < 75) return 'Fort'
    return 'Très fort'
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))

    setIsUploading(true)
    try {
      const dataUrl = await fileToProfileDataUrl(file)
      setFormData((prev) => ({ ...prev, picture: dataUrl }))
      toast.success('Photo ajoutée')
    } catch (error) {
      console.error('Erreur photo:', error)
      toast.error(profileImageTooLargeMessage())
      setImageFile(null)
      setImagePreview(null)
      setFormData((prev) => ({ ...prev, picture: '' }))
      if (fileInputRef.current) fileInputRef.current.value = ''
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

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const { confirmPassword, acceptTerms, ...userData } = formData

    if (!userData.name || !userData.name.trim()) {
      toast.error('Veuillez entrer votre nom complet')
      return
    }

    if (!userData.email || !userData.email.trim()) {
      toast.error('Veuillez entrer votre email')
      return
    }

    if (!userData.password || userData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (userData.password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (!acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation')
      return
    }

    setIsLoading(true)
    try {
      const registerData = {
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name.trim(),
        role: 'client',
        telephone: userData.telephone?.trim() || '+237000000000',
        sexe: userData.sexe || 'homme',
        picture: userData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}&background=0a89f2&color=fff&size=128`
      }

      let result = await api.register(registerData)

      // Older APIs only return the user — then log in automatically
      if (!result?.access_token) {
        result = await api.login(registerData.email, registerData.password)
      }

      if (!result?.access_token || !result?.user) {
        throw new Error(
          'Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter.'
        )
      }

      auth.setToken(result.access_token)
      auth.setUser({
        ...result.user,
        picture: result.user.picture || registerData.picture,
      })

      setSuccess(true)
      toast.success('Inscription réussie ! Bienvenue dans votre espace.')

      window.location.href = '/espace-client'

    } catch (error) {
      console.error('❌ Erreur inscription:', error)
      const message = isProfileImageTooLargeError(error)
        ? profileImageTooLargeMessage()
        : error.message || "Erreur lors de l'inscription"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    toast("L'inscription Google sera bientôt disponible", {
      icon: 'ℹ️',
    })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 p-0">
        <div className="w-full h-screen max-h-screen bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">

          {/* Panneau gauche - Visuel & Branding */}
          <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-dice-blue to-dice-blue-dark p-8 md:p-12 lg:p-16 flex-col justify-center text-white h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center h-full max-w-lg mx-auto"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <GiDiamondRing className="text-white text-2xl" />
                </div>
                <span className="text-xl font-bold">Diamond Centre</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                Rejoignez-nous
                <br />
                <span className="text-white/90">Commencez gratuitement</span>
              </h1>

              <p className="text-white/80 text-base md:text-lg mb-6 leading-relaxed max-w-sm">
                Créez votre compte en moins d'une minute et accédez à toutes nos formations.
              </p>

              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Sécurisé
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Gratuit
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> 24/7 Support
                </span>
              </div>
            </motion.div>
          </div>

          {/* Panneau droit - Formulaire */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 lg:p-14 flex flex-col justify-start md:justify-center h-full bg-white overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center max-w-sm mx-auto w-full my-auto py-6"
            >
              <div className="text-center mt-2 md:mt-16 mb-3">
                <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Déjà un compte ?{' '}
                  <Link href="/auth/login" className="text-dice-blue hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-600 text-sm mb-3">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-green-700 text-sm mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Inscription réussie ! Redirection vers la connexion...
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-2.5">
                {/* Photo de profil */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Photo de profil</label>
                  <div className="mt-0.5">
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-3 p-2 bg-gray-50 rounded-xl border-2 border-dashed border-dice-blue">
                        <FaSpinner className="animate-spin text-dice-blue text-lg" />
                        <span className="text-xs text-gray-500">Téléchargement...</span>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative inline-block">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-dice-blue shadow-lg">
                          <img
                            src={imagePreview}
                            alt="Photo"
                            className="w-full h-full object-cover"
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
                        className="border-2 border-dashed border-gray-300 rounded-xl p-2.5 text-center hover:border-dice-blue hover:bg-dice-blue/5 transition-all cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FaImage className="text-xl sm:text-2xl text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Ajouter une photo</p>
                        <p className="text-[10px] text-gray-400">PNG, JPG, JPEG</p>
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

                {/* Nom complet */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Nom complet *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@gmail.com"
                      className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Téléphone *</label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+237 690142918"
                      className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Sexe */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Sexe *</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <label className="relative flex items-center justify-center py-1.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="sexe"
                        value="homme"
                        checked={formData.sexe === 'homme'}
                        onChange={handleChange}
                        className="sr-only peer"
                        required
                      />
                      <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                        <FaVenusMars className="text-blue-500" /> Homme
                      </span>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl" />
                    </label>
                    <label className="relative flex items-center justify-center py-1.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="sexe"
                        value="femme"
                        checked={formData.sexe === 'femme'}
                        onChange={handleChange}
                        className="sr-only peer"
                        required
                      />
                      <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                        <FaVenusMars className="text-pink-500" /> Femme
                      </span>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl" />
                    </label>
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Mot de passe *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-xs sm:text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash className="text-xs sm:text-sm" /> : <FaEye className="text-xs sm:text-sm" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-500">{getStrengthText()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Confirmer *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-xs sm:text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-xs sm:text-sm" /> : <FaEye className="text-xs sm:text-sm" />}
                    </button>
                  </div>
                </div>

                {/* Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-dice-blue focus:ring-dice-blue/30 border-gray-300 rounded mt-0.5 cursor-pointer"
                    required
                  />
                  <label className="ml-2 text-[11px] sm:text-xs text-gray-600 leading-tight">
                    J'accepte les{' '}
                    <Link href="/terms" className="text-dice-blue hover:underline">conditions</Link>
                    {' '}et la{' '}
                    <Link href="/privacy" className="text-dice-blue hover:underline">confidentialité</Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  fullWidth
                  loading={isLoading || isUploading}
                  disabled={isLoading || isUploading}
                  className="text-xs sm:text-sm py-2 bg-dice-blue hover:bg-dice-blue-dark rounded-xl"
                >
                  {isUploading ? 'Téléchargement...' : 'Créer un compte'}
                </Button>
              </form>

              <div className="relative my-2 sm:my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[11px] sm:text-xs">
                  <span className="px-3 bg-white text-gray-400">Ou s'inscrire avec</span>
                </div>
              </div>

              <button
                onClick={handleGoogleRegister}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaGoogle className="text-red-500 text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Google</span>
              </button>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}