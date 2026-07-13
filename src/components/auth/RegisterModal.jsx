/**
<<<<<<< HEAD
 * Modal d'inscription simplifié
=======
 * Modal d'inscription pour la réservation de tickets
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
 */
'use client'

import { useState } from 'react'
<<<<<<< HEAD
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaVenusMars } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'

// Schéma de validation simplifié
const registerSchema = yup.object().shape({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  telephone: yup.string().matches(/^[0-9]{10}$/, 'Téléphone invalide').required(),
  password: yup.string().min(6, '6 caractères minimum').required(),
  sexe: yup.string().oneOf(['M', 'F']).required()
})

export default function RegisterModal({ isOpen, onClose, onSuccess, redirectAfterLogin = true }) {
  const { register: registerUser, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
=======
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaPhone, FaVenusMars, FaTimes, FaCheckCircle 
} from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const registerSchema = yup.object().shape({
  nom: yup.string().required('Le nom est requis').min(2, 'Nom trop court'),
  prenom: yup.string().required('Le prénom est requis').min(2, 'Prénom trop court'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  telephone: yup.string().matches(/^[0-9]{10}$/, 'Numéro invalide (10 chiffres)').required('Téléphone requis'),
  password: yup.string()
    .min(8, '8 caractères minimum')
    .matches(/[a-z]/, 'Une minuscule')
    .matches(/[A-Z]/, 'Une majuscule')
    .matches(/[0-9]/, 'Un chiffre')
    .required('Mot de passe requis'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('Confirmation requise'),
  sexe: yup.string().oneOf(['M', 'F']).required('Sexe requis'),
  acceptTerms: yup.boolean().oneOf([true], 'Acceptez les conditions')
})

export default function RegisterModal({ 
  isOpen, 
  onClose, 
  onRegister, 
  loading = false 
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)

  const {
    register,
    handleSubmit,
<<<<<<< HEAD
    formState: { errors }
=======
    watch,
    formState: { errors },
    reset
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
<<<<<<< HEAD
      sexe: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      toast.success('Inscription réussie !')
      if (onSuccess) {
        onSuccess()
      }
      if (redirectAfterLogin) {
        onClose()
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Créer un compte</h3>
          <p className="text-gray-500">Inscrivez-vous pour réserver votre place</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom"
              placeholder="Dupont"
              icon={<FaUser />}
              error={errors.nom?.message}
              {...register('nom')}
            />
            <Input
              label="Prénom"
              placeholder="Jean"
              icon={<FaUser />}
              error={errors.prenom?.message}
              {...register('prenom')}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            icon={<FaEnvelope />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Téléphone"
            type="tel"
            placeholder="0612345678"
            icon={<FaPhone />}
            error={errors.telephone?.message}
            {...register('telephone')}
          />

          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<FaLock />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <input type="radio" value="M" className="sr-only" {...register('sexe')} />
                <FaVenusMars className="text-blue-500" />
                <span>Homme</span>
              </label>
              <label className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <input type="radio" value="F" className="sr-only" {...register('sexe')} />
                <FaVenusMars className="text-pink-500" />
                <span>Femme</span>
              </label>
            </div>
            {errors.sexe && <p className="text-sm text-red-600 mt-1">{errors.sexe.message}</p>}
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            S'inscrire
          </Button>

          <p className="text-sm text-center text-gray-500">
            Déjà un compte ?{' '}
            <button type="button" className="text-dice-blue hover:underline" onClick={onClose}>
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </Modal>
=======
      confirmPassword: '',
      sexe: '',
      acceptTerms: false
    }
  })

  const watchPassword = watch('password')

  // Calculer la force du mot de passe
  const calculateStrength = (password) => {
    let strength = 0
    if (password) {
      if (password.length >= 8) strength += 25
      if (/[a-z]/.test(password)) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
    }
    return strength
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

  // Mettre à jour la force du mot de passe
  const handlePasswordChange = (e) => {
    const password = e.target.value
    setPasswordStrength(calculateStrength(password))
  }

  // Fermer et réinitialiser
  const handleClose = () => {
    reset()
    setPasswordStrength(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* En-tête */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dice-blue to-purple-600 rounded-2xl mb-4 shadow-lg">
              <FaUser className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
            <p className="text-gray-500 text-sm">Inscrivez-vous pour réserver</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="nom"
                    placeholder="Dupont"
                    className="pl-9"
                    error={errors.nom?.message}
                    {...register('nom')}
                  />
                </div>
                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
              </div>
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="prenom"
                    placeholder="Jean"
                    className="pl-9"
                    error={errors.prenom?.message}
                    {...register('prenom')}
                  />
                </div>
                {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  className="pl-10"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="0612345678"
                  className="pl-10"
                  error={errors.telephone?.message}
                  {...register('telephone')}
                />
              </div>
              {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>}
            </div>

            {/* Sexe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" value="M" className="sr-only peer" {...register('sexe')} />
                  <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2">
                    <FaVenusMars className="text-blue-500" /> Homme
                  </span>
                  <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl pointer-events-none" />
                </label>
                <label className="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" value="F" className="sr-only peer" {...register('sexe')} />
                  <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2">
                    <FaVenusMars className="text-pink-500" /> Femme
                  </span>
                  <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-xl pointer-events-none" />
                </label>
              </div>
              {errors.sexe && <p className="mt-1 text-sm text-red-600">{errors.sexe.message}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  error={errors.password?.message}
                  {...register('password')}
                  onChange={(e) => {
                    register('password').onChange(e)
                    handlePasswordChange(e)
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {watchPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{getStrengthText()}</span>
                  </div>
                </div>
              )}
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirmation */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            {/* Conditions */}
            <div className="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-dice-blue focus:ring-dice-blue/30 border-gray-300 rounded mt-1"
                {...register('acceptTerms')}
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                J'accepte les conditions d'utilisation
              </label>
            </div>
            {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
              className="mt-2"
            >
              Créer un compte
            </Button>

            {/* Lien connexion */}
            <div className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button type="button" className="text-dice-blue hover:text-dice-blue-dark font-medium transition-colors">
                Se connecter
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
>>>>>>> 5427ba6 (feat: mise à jour du design avec glassmorphisme et charte graphique Diamond Centre, Dashboard aussi)
  )
}