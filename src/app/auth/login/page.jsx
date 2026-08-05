/**
 * Page de connexion - Version simplifiée
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

const loginSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis')
})

export default function LoginPage() {
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Handlers pour la connexion sociale
  const handleGoogleRegister = () => {
    toast("L'inscription Google sera bientôt disponible", {
      icon: 'ℹ️',
    })
  }

  const handleFacebookRegister = () => {
    toast("L'inscription Facebook sera bientôt disponible", {
      icon: 'ℹ️',
    })
  }

  // Vérifier si déjà connecté
  useEffect(() => {
    const token = auth.getToken()
    const user = auth.getUser()
    
    if (token && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/espace-client'
      }
    }
    setIsChecking(false)
  }, [])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
    } catch (error) {
      // Erreur déjà gérée dans useAuth
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
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
                Bienvenue
                <br />
                <span className="text-white/90">De retour parmi nous</span>
              </h1>

              <p className="text-white/80 text-base md:text-lg mb-6 leading-relaxed max-w-sm">
                Connectez-vous pour accéder à vos formations, certifications et ressources exclusives.
              </p>

              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Sécurisé
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> 24/7 Support
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Certifié
                </span>
              </div>
            </motion.div>
          </div>

          {/* Panneau droit */}
          <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center h-full bg-white">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center max-w-sm mx-auto w-full pt-[2cm]"
            >
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">Se connecter</h2>
                <p className="text-gray-500 text-sm mt-1.5">
                  Pas encore de compte ?{' '}
                  <Link href="/auth/register" className="text-dice-blue hover:underline font-medium">
                    S'inscrire
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="admin@diamondcentre.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-sm"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  fullWidth
                  loading={isSubmitting || loading}
                  disabled={isSubmitting || loading}
                  className="text-base py-2.5 bg-dice-blue hover:bg-dice-blue-dark rounded-xl"
                >
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400 text-sm">Ou continuer avec</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={isSubmitting || loading}
                  className="flex items-center justify-center gap-2.5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="text-red-500 text-lg" />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleFacebookRegister}
                  disabled={isSubmitting || loading}
                  className="flex items-center justify-center gap-2.5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FaFacebook className="text-blue-600 text-lg" />
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>

              <div className="mt-5 text-center text-sm text-gray-400">
                <p>© 2026 Diamond Centre. Tous droits réservés.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}