/**
 * Formulaire de connexion
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email invalide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  rememberMe: yup.boolean()
})

export default function LoginForm({ onSubmit, loading = false }) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse email
        </label>
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
        {errors.email && (
          <motion.p 
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
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
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <motion.p 
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            className="h-4 w-4 text-dice-blue focus:ring-dice-blue/30 border-gray-300 rounded"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Se souvenir de moi
          </label>
        </div>
        <div className="text-sm">
          <button type="button" className="text-dice-blue hover:text-dice-blue-dark font-medium transition-colors">
            Mot de passe oublié ?
          </button>
        </div>
      </div>

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
        Se connecter
      </Button>
    </form>
  )
}