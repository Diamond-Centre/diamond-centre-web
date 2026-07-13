/**
 * Formulaire d'inscription
 */
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaPhone, FaVenusMars, FaCheckCircle 
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

export default function RegisterForm({ onSubmit, loading = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      confirmPassword: '',
      sexe: '',
      acceptTerms: false
    }
  })

  const watchPassword = watch('password')

  useEffect(() => {
    let strength = 0
    if (watchPassword) {
      if (watchPassword.length >= 8) strength += 25
      if (/[a-z]/.test(watchPassword)) strength += 25
      if (/[A-Z]/.test(watchPassword)) strength += 25
      if (/[0-9]/.test(watchPassword)) strength += 25
    }
    setPasswordStrength(strength)
  }, [watchPassword])

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nom et Prénom */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-4 w-4 text-gray-400" />
            </div>
            <Input id="nom" placeholder="Dupont" className="pl-9" error={errors.nom?.message} {...register('nom')} />
          </div>
          {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-4 w-4 text-gray-400" />
            </div>
            <Input id="prenom" placeholder="Jean" className="pl-9" error={errors.prenom?.message} {...register('prenom')} />
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
          <Input id="email" type="email" placeholder="exemple@email.com" className="pl-10" error={errors.email?.message} {...register('email')} />
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
          <Input id="telephone" type="tel" placeholder="0612345678" className="pl-10" error={errors.telephone?.message} {...register('telephone')} />
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
          />
          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        </div>
        {watchPassword && (
          <div className="mt-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${getStrengthColor()}`} initial={{ width: 0 }} animate={{ width: `${passwordStrength}%` }} transition={{ duration: 0.3 }} />
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
          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      {/* Conditions */}
      <div className="flex items-start">
        <input id="acceptTerms" type="checkbox" className="h-4 w-4 text-dice-blue focus:ring-dice-blue/30 border-gray-300 rounded mt-1" {...register('acceptTerms')} />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
          J'accepte les <button type="button" className="text-dice-blue hover:underline">conditions d'utilisation</button>
        </label>
      </div>
      {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>}

      {/* Submit */}
      <Button type="submit" variant="primary" size="large" fullWidth loading={loading} disabled={loading} className="mt-2">
        Créer un compte
      </Button>
    </form>
  )
}