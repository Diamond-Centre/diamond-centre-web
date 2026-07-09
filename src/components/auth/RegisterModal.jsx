/**
 * Modal d'inscription simplifié
 */
'use client'

import { useState } from 'react'
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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
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
  )
}