'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'
import '../auth.css'

const loginSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis')
})

export default function LoginPage() {
  const { login, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [intro, setIntro] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 1000)
    return () => window.clearTimeout(t)
  }, [])

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const people = [
    '/assets/orbit-portraits/person-1.png',
    '/assets/orbit-portraits/person-2.png',
    '/assets/orbit-portraits/person-3.png',
    '/assets/orbit-portraits/person-4.png',
    '/assets/orbit-portraits/person-5.png',
    '/assets/orbit-portraits/person-6.png',
    '/assets/orbit-portraits/person-7.png'
  ]
  const logoSrc = '/images/logo-dice.png'

  return (
    <div className="auth-page">
      <div className="auth-grid" />
      <Link href="/" className="auth-back">← Retour au site</Link>
      <div className="auth-shell">
        <section className={`auth-brand auth-brand-login ${intro ? 'is-intro' : 'is-settled'}`}>
          <div className="bento-intro" aria-hidden="true">
            {people.slice(0, 6).map((src, i) => (
              <i key={i} style={{ '--i': i }}>
                <img src={src} alt="Portrait" />
              </i>
            ))}
          </div>
          <div className="auth-brand-copy">
            <img src={logoSrc} alt="Logo" />
            <div className="auth-kicker">DIAMOND CENTRE · ESPACE MEMBRE</div>
            <h1>Heureux de vous revoir.</h1>
            <p>Retrouvez vos événements, vos billets, votre agenda et vos certifications dans une expérience pensée autour de votre progression.</p>
          </div>
        </section>

        <section className="auth-card">
          <div className="eyebrow">CONNEXION</div>
          <h2>Accéder à mon espace</h2>
          <p className="muted">Utilisez les identifiants associés à votre compte DiCe.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Adresse e-mail
              <input type="email" placeholder="vous@exemple.com" {...register('email')} />
              {errors.email && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'normal' }}>{errors.email.message}</span>}
            </label>

            <label>Mot de passe
              <input type="password" placeholder="••••••••••••" {...register('password')} />
              {errors.password && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'normal' }}>{errors.password.message}</span>}
            </label>

            <div className="form-meta">
              <label className="check"><input type="checkbox" /> <span style={{ marginLeft: '8px' }}>Se souvenir de moi</span></label>
              <button type="button">Mot de passe oublié ?</button>
            </div>

            <button type="submit" className="primary-auth px-4" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? 'Connexion...' : 'Se connecter'} <span>→</span>
            </button>
          </form>

          <div className="auth-switch">
            Pas encore de compte ? <Link href="/auth/register">S'inscrire</Link>
          </div>
        </section>
      </div>
    </div>
  )
}