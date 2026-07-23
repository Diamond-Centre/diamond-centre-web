/**
 * Page d'inscription - Version avec tous les champs requis
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { 
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaUser
} from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Navbar'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',  // ← Ajout du champ role
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

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

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validation des champs
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    
    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation')
      return
    }

    setIsLoading(true)
    try {
      // Envoyer les données exactes attendues par le backend
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role // 'user' par défaut
      }
      
      console.log('📤 Envoi au backend:', payload)
      
      const response = await api.register(payload)
      
      console.log('📥 Réponse du backend:', response)
      
      toast.success('Inscription réussie ! Connectez-vous pour continuer.')
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
      
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error)
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
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
              Créez votre compte en moins d'une minute et accédez à toutes nos formations, certifications et ressources.
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
            className="flex flex-col justify-center max-w-sm mx-auto w-full pt-[2cm]"
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

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Rôle - Champ caché mais envoyé */}
              <input type="hidden" name="role" value={formData.role} />

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
                  <Link href="/terms" className="text-dice-blue hover:underline">
                    conditions
                  </Link>
                  {' '}et la{' '}
                  <Link href="/privacy" className="text-dice-blue hover:underline">
                    confidentialité
                  </Link>
                </label>
              </div>

              {/* Bouton d'inscription */}
              <Button
                type="submit"
                variant="primary"
                size="medium"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className="text-base py-2.5 bg-dice-blue hover:bg-dice-blue-dark rounded-xl"
              >
                Créer un compte
              </Button>
            </form>

            {/* Séparateur */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 text-sm">Ou s'inscrire avec</span>
              </div>
            </div>

            {/* Google */}
            <button
              onClick={() => toast.info('Inscription avec Google bientôt disponible')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span className="text-base font-medium text-gray-700">S'inscrire avec Google</span>
            </button>

            {/* Footer */}
            <div className="mt-5 text-center text-sm text-gray-400">
              <p>© 2026 Diamond Centre. Tous droits réservés.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div></>
  )
}