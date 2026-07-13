/**
 * Page d'inscription - Moderne avec glassmorphisme
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { FaArrowLeft, FaGem, FaShieldAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

// Composants Auth
import RegisterForm from '@/components/auth/RegisterForm'
import SocialAuth from '@/components/auth/SocialAuth'
import AuthDivider from '@/components/auth/AuthDivider'

// Composants UI
import Container from '@/components/ui/Container'

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, isAuthenticated, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Inscription
  const handleRegister = async (data) => {
    setIsLoading(true)
    try {
      const { confirmPassword, acceptTerms, ...userData } = data
      await registerUser(userData)
      toast.success('Compte créé avec succès !')
      router.push('/auth/login')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  // Inscription sociale (mock)
  const handleSocialRegister = async (provider) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Inscription avec ${provider} réussie !`)
      router.push('/dashboard')
    } catch (error) {
      toast.error(`Erreur avec ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
                </Link>
              </p>
            </div>

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
    </div>
  )
}