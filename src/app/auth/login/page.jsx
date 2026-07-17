/**
<<<<<<< HEAD
 * Page de connexion - Moderne avec glassmorphisme
=======
 * Page de connexion - Plein écran avec Bleu Diamond Centre
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
import LoginForm from '@/components/auth/LoginForm'
import SocialAuth from '@/components/auth/SocialAuth'
import AuthDivider from '@/components/auth/AuthDivider'

// Composants UI
import Container from '@/components/ui/Container'
=======
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading } = useAuth()
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false)

  // Rediriger si déjà connecté
=======
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

<<<<<<< HEAD
  // Connexion avec email/password
  const handleLogin = async (data) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
=======
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setIsLoading(true)
    try {
      await login(email, password)
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

<<<<<<< HEAD
  // Connexion sociale (mock)
  const handleSocialLogin = async (provider) => {
    setIsLoading(true)
    try {
      // Simulation de connexion sociale
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Connexion avec ${provider} réussie !`)
      router.push('/dashboard')
    } catch (error) {
      toast.error(`Erreur avec ${provider}`)
=======
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Connexion avec Google réussie !')
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
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-dice-blue/5 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }} />

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
            <h2 className="text-2xl font-bold text-gray-800">Bienvenue</h2>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous pour continuer</p>
          </div>

          {/* Contenu */}
          <div className="mt-6">
            {/* Login Form */}
            <LoginForm onSubmit={handleLogin} loading={isLoading || loading} />

            {/* Divider */}
            <AuthDivider text="Ou continuez avec" />

            {/* Social Auth */}
            <SocialAuth onSocialLogin={handleSocialLogin} loading={isLoading || loading} />

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/auth/register" className="text-dice-blue hover:text-dice-blue-dark font-medium transition-colors">
                  Inscrivez-vous
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
              Hello
              <br />
              <span className="text-white/90">Bienvenue !</span>
            </h1>
            
            <p className="text-white/80 text-base md:text-lg mb-6 leading-relaxed max-w-sm">
              Accédez à vos formations, certifications et suivez votre progression en toute simplicité.
            </p>

            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Sécurisé
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                24/7 Support
              </span>
            </div>
          </motion.div>
        </div>

        {/* Panneau droit - Formulaire de connexion centré (50%) */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center h-full bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center max-w-sm mx-auto w-full"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-500 text-sm mt-1.5">
                Pas encore de compte ?{' '}
                <Link href="/auth/register" className="text-dice-blue hover:underline font-medium">
                  Créer un compte
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
      `}</style>
=======
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {/* Mot de passe oublié */}
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-dice-blue hover:underline font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                variant="primary"
                size="medium"
                fullWidth
                loading={isLoading || loading}
                disabled={isLoading || loading}
                className="text-base py-2.5 bg-dice-blue hover:bg-dice-blue-dark rounded-xl"
              >
                Se connecter
              </Button>
            </form>

            {/* Séparateur */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 text-sm">Ou continuer avec</span>
              </div>
            </div>

            {/* Connexion avec Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || loading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span className="text-base font-medium text-gray-700">Se connecter avec Google</span>
            </button>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>© 2026 Diamond Centre. Tous droits réservés.</p>
            </div>
          </motion.div>
        </div>
      </div>
>>>>>>> f28adba (feat: mise à jour du design pages de connexion et inscription)
    </div>
  )
}