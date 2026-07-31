/**
 * Page d'inscription - Version finale avec format exact
 */
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
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

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    
    const { confirmPassword, acceptTerms, ...userData } = formData
    
    // Validation des champs obligatoires
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
      // Construire les données EXACTEMENT comme le curl qui fonctionne
      const registerData = {
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name.trim(),
        role: 'client',  // Toujours envoyer "client" comme rôle
        telephone: userData.telephone?.trim() || '+237000000000',
        sexe: userData.sexe || 'homme',
        picture: userData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}&background=0a89f2&color=fff&size=128`
      }
      
      console.log('📤 Envoi au backend:', JSON.stringify(registerData, null, 2))
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerData)
      })
      
      const text = await response.text()
      console.log('📥 Réponse brute:', text)
      
      if (!response.ok) {
        let errorMessage
        try {
          const error = JSON.parse(text)
          errorMessage = error.message || error.error || `Erreur ${response.status}`
        } catch {
          errorMessage = text || `Erreur ${response.status}`
        }
        throw new Error(errorMessage)
      }
      
      let result
      try {
        result = JSON.parse(text)
      } catch {
        throw new Error(`Réponse invalide du serveur (${response.status})`)
      }
      console.log('✅ Inscription réussie:', result)
      
      setSuccess(true)
      toast.success('Inscription réussie ! Connectez-vous pour continuer.')
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
      
    } catch (error) {
      console.error('❌ Erreur inscription:', error)
      setError(error.message)
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    toast.info("L'inscription Google sera bientôt disponible")
  }

  return (
    <><Navbar />
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 p-0">
      <div className="w-full h-screen max-h-screen bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Panneau gauche */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-dice-blue to-dice-blue-dark p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white h-full">
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
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center h-full bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center max-w-sm mx-auto w-full"
          >
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
              <p className="text-gray-500 text-sm mt-1.5">
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-dice-blue hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Inscription réussie ! Redirection vers la connexion...
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Photo de profil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                <div className="mt-2">
                  {isUploading ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-dice-blue">
                      <FaSpinner className="animate-spin text-dice-blue text-xl" />
                      <span className="text-sm text-gray-500">Téléchargement...</span>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative inline-block">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-dice-blue shadow-lg">
                        <Image
                          src={imagePreview}
                          alt="Photo"
                          fill
                          className="object-cover"
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
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-dice-blue hover:bg-dice-blue/5 transition-all cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Ajouter une photo</p>
                      <p className="text-xs text-gray-400">PNG, JPG, JPEG • Max 5MB</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+237 690142918"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Sexe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative flex items-center justify-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      name="sexe"
                      value="homme"
                      checked={formData.sexe === 'homme'}
                      onChange={handleChange}
                      className="sr-only peer"
                      required
                    />
                    <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2 text-sm">
                      <FaVenusMars className="text-blue-500" /> Homme
                    </span>
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl" />
                  </label>
                  <label className="relative flex items-center justify-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      name="sexe"
                      value="femme"
                      checked={formData.sexe === 'femme'}
                      onChange={handleChange}
                      className="sr-only peer"
                      required
                    />
                    <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2 text-sm">
                      <FaVenusMars className="text-pink-500" /> Femme
                    </span>
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl" />
                  </label>
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{getStrengthText()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                  className="h-4 w-4 text-dice-blue focus:ring-dice-blue/30 border-gray-300 rounded mt-0.5"
                  required
                />
                <label className="ml-2.5 text-sm text-gray-600">
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
                className="text-base py-2.5 bg-dice-blue hover:bg-dice-blue-dark rounded-xl"
              >
                {isUploading ? 'Téléchargement...' : 'Créer un compte'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 text-sm">Ou s'inscrire avec</span>
              </div>
            </div>

            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span className="text-base font-medium text-gray-700">Google</span>
            </button>

            <div className="mt-4 text-center text-xs text-gray-400">
              <p>✅ Le rôle <span className="font-semibold text-dice-blue">"client"</span> est attribué par défaut</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div></>
  )
}