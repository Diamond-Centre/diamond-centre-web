'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import { isProfileImageTooLargeError, profileImageTooLargeMessage } from '@/lib/profileImage'
import '../auth.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    telephone: '+237 ', sexe: 'homme', picture: '', acceptTerms: false, role: 'client'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [intro, setIntro] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 1000)
    return () => window.clearTimeout(t)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const { confirmPassword, acceptTerms, ...userData } = formData

    if (!userData.name || !userData.name.trim()) return toast.error('Veuillez entrer votre nom complet')
    if (!userData.email || !userData.email.trim()) return toast.error('Veuillez entrer votre email')
    if (!userData.password || userData.password.length < 6) return toast.error('Le mot de passe doit contenir au moins 6 caractères')
    if (userData.password !== confirmPassword) return toast.error('Les mots de passe ne correspondent pas')
    if (!acceptTerms) return toast.error("Veuillez accepter les conditions d'utilisation")

    setIsLoading(true)
    try {
      const registerData = {
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name.trim(),
        role: 'client',
        telephone: userData.telephone?.trim() || '+237000000000',
        sexe: userData.sexe || 'homme',
        picture: userData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}&background=0a89f2&color=fff&size=128`
      }

      let result = await api.register(registerData)

      if (!result?.access_token) {
        result = await api.login(registerData.email, registerData.password)
      }

      if (!result?.access_token || !result?.user) {
        throw new Error('Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter.')
      }

      auth.setToken(result.access_token)
      auth.setUser({
        ...result.user,
        picture: result.user.picture || registerData.picture,
      })

      toast.success('Inscription réussie ! Bienvenue dans votre espace.')
      window.location.href = '/espace-client'

    } catch (error) {
      console.error('❌ Erreur inscription:', error)
      const message = isProfileImageTooLargeError(error)
        ? profileImageTooLargeMessage()
        : error.message || "Erreur lors de l'inscription"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
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
        <section className={`auth-brand auth-brand-register ${intro ? 'is-intro' : 'is-settled'}`}>
          <div className="circle-intro" aria-hidden="true"><i /><i /><i /><span>ENTREZ</span></div>
          <div className="orbit-scene" aria-hidden="true">
            <div className="orbit-ring orbit-ring-outer" />
            <div className="orbit-ring orbit-ring-inner" />
            <div className="orbit-core">D</div>
            {people.map((src, i) => (
              <div key={i} className={`orbit-person orbit-person-${i + 1}`}>
                <img src={src} alt="Portrait" />
              </div>
            ))}
          </div>
          <div className="auth-brand-copy">
            <img src={logoSrc} alt="Logo" />
            <div className="auth-kicker">DIAMOND CENTRE · ESPACE MEMBRE</div>
            <h1>Entrez dans le cercle.</h1>
            <p>Créez votre espace personnel pour réserver vos expériences, conserver vos billets et suivre vos certifications.</p>
          </div>
        </section>

        <section className="auth-card">
          <div className="eyebrow">INSCRIPTION</div>
          <h2>Créer mon espace</h2>
          <p className="muted">Quelques informations suffisent pour commencer.</p>

          <form onSubmit={handleRegister}>
            <div className="form-row">
              <label>Nom complet
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom complet" required />
              </label>
              <label>Téléphone
                <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+237 6•• •• •• ••" required />
              </label>
            </div>

            <label>Adresse e-mail
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vous@exemple.com" required />
            </label>

            <div className="form-row">
              <label>Mot de passe
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" required />
              </label>
              <label>Confirmer le mot de passe
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••••••" required />
              </label>
            </div>

            <label>Sexe
              <select name="sexe" value={formData.sexe} onChange={handleChange} style={{ height: '52px', border: '1px solid #d7e3ef', borderRadius: '13px', padding: '0 15px', background: '#fff', color: '#12203a', textTransform: 'none', letterSpacing: '0', fontSize: '15px' }}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </label>

            <div className="form-meta" style={{ marginTop: '15px' }}>
              <label className="check">
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} required />
                <span style={{ marginLeft: '8px' }}>J'accepte les conditions et la confidentialité</span>
              </label>
            </div>

            <button type="submit" className="primary-auth px-4" disabled={isLoading}>
              {isLoading ? 'Création en cours...' : 'Créer mon compte'} <span>→</span>
            </button>
          </form>

          <div className="auth-switch">
            Déjà membre ? <Link href="/auth/login">Se connecter</Link>
          </div>
        </section>
      </div>
    </div>
  )
}