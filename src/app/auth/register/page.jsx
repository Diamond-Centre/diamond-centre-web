/**
<<<<<<< HEAD
 * Page d'inscription - Moderne avec glassmorphisme
=======
 * Page d'inscription - Centrée comme la page de connexion
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
<<<<<<< HEAD
import { FaArrowLeft, FaGem, FaShieldAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

// Composants Auth
import RegisterForm from '@/components/auth/RegisterForm'
import SocialAuth from '@/components/auth/SocialAuth'
import AuthDivider from '@/components/auth/AuthDivider'

// Composants UI
import Container from '@/components/ui/Container'
=======
import { 
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, 
  FaUser, FaPhoneAlt, FaVenusMars
} from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, isAuthenticated, loading } = useAuth()
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false)

  // Rediriger si déjà connecté
=======
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    sexe: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

<<<<<<< HEAD
  // Inscription
  const handleRegister = async (data) => {
    setIsLoading(true)
    try {
      const { confirmPassword, acceptTerms, ...userData } = data
=======
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
    const { confirmPassword, acceptTerms, ...userData } = formData
    
    if (!userData.nom || !userData.prenom || !userData.email || !userData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
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
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
      await registerUser(userData)
      toast.success('Compte créé avec succès !')
      router.push('/auth/login')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

<<<<<<< HEAD
  // Inscription sociale (mock)
  const handleSocialRegister = async (provider) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Inscription avec ${provider} réussie !`)
      router.push('/dashboard')
    } catch (error) {
      toast.error(`Erreur avec ${provider}`)
=======
  const handleGoogleRegister = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Inscription avec Google réussie !')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erreur avec Google')
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    } finally {
      setIsLoading(false)
    }
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Formes décoratives */}
      <motion.div className="absolute top-0 right-0 w-96 h-96 bg-dice-blue/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity }} />

      {/* Back button */}
      <motion.button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-gray-500 hover:text-dice-blue transition-colors glass-card-dice px-4 py-2 rounded-full text-sm"
        whileHover={{ x: -3 }}
      >
        <FaArrowLeft className="text-sm" /> Retour
      </motion.button>

      <Container className="relative z-10 max-w-md">
        <motion.div
          className="glass-card-dice rounded-3xl p-8 backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* En-tête */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dice-blue to-purple-600 rounded-2xl mb-4 shadow-lg"
            >
              <FaGem className="text-2xl text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
            <p className="text-gray-500 text-sm mt-1">Rejoignez la communauté</p>
          </div>

          {/* Contenu */}
          <div className="mt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Register Form */}
            <RegisterForm onSubmit={handleRegister} loading={isLoading || loading} />

            {/* Divider */}
            <AuthDivider text="Ou inscrivez-vous avec" />

            {/* Social Auth */}
            <SocialAuth onSocialLogin={handleSocialRegister} loading={isLoading || loading} />

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-dice-blue hover:text-dice-blue-dark font-medium transition-colors">
                  Connectez-vous
=======
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 p-0">
      {/* Conteneur principal - Plein écran */}
      <div className="w-full h-screen max-h-screen bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Panneau gauche - Message de bienvenue (50%) */}
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
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Sécurisé
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Gratuit
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                24/7 Support
              </span>
            </div>
          </motion.div>
        </div>

        {/* Panneau droit - Formulaire d'inscription avec décalage */}
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
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
                </Link>
              </p>
            </div>

<<<<<<< HEAD
            {/* Sécurité */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center gap-1">
                <FaShieldAlt className="text-dice-blue" /> Sécurisé
              </span>
              <span className="w-px h-3 bg-gray-300" />
              <span>🔒 Chiffré</span>
              <span className="w-px h-3 bg-gray-300" />
              <span>✓ 100% confidentiel</span>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* Styles */}
      <style jsx global>{`
        .glass-card-dice {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(10, 137, 242, 0.06);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(10, 137, 242, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(10, 137, 242, 0.5);
        }
      `}</style>
=======
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Dupont"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Jean"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email - avec placeholder grisé */}
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
                  />
                </div>
              </div>

              {/* Téléphone - avec format 9 chiffres et icône modifiée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhoneAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="690142918"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm placeholder-gray-400"
                    maxLength="9"
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
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
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

              {/* Sexe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative flex items-center justify-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="sexe"
                      value="M"
                      checked={formData.sexe === 'M'}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2 text-sm">
                      <FaVenusMars className="text-blue-500" /> Homme
                    </span>
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl pointer-events-none" />
                  </label>
                  <label className="relative flex items-center justify-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="sexe"
                      value="F"
                      checked={formData.sexe === 'F'}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2 text-sm">
                      <FaVenusMars className="text-pink-500" /> Femme
                    </span>
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl pointer-events-none" />
                  </label>
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
                loading={isLoading || loading}
                disabled={isLoading || loading}
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

            {/* Inscription avec Google */}
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading || loading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span className="text-base font-medium text-gray-700">S'inscrire avec Google</span>
            </button>

            {/* Footer - Position inchangée */}
            <div className="mt-5 text-center text-sm text-gray-400">
              <p>© 2026 Diamond Centre. Tous droits réservés.</p>
            </div>
          </motion.div>
        </div>
      </div>
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    </div>
  )
}