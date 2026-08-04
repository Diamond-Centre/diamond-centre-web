'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaVenusMars,
  FaLock,
  FaCheckCircle,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'

/**
 * Profil client — design modernisé & audacieux.
 * Synchronisation locale avec la session auth.
 */
export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    sexe: '',
  })

  useEffect(() => {
    const token = auth.getToken()
    const userData = auth.getUser()
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }
    setFormData({
      name:
        userData.name ||
        [userData.prenom, userData.nom].filter(Boolean).join(' ') ||
        '',
      email: userData.email || '',
      telephone: userData.telephone || '',
      sexe: userData.sexe || '',
    })
    setLoading(false)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const current = auth.getUser() || {}
      const updated = {
        ...current,
        name: formData.name,
        telephone: formData.telephone,
        sexe: formData.sexe,
      }
      auth.setUser(updated)
      toast.success('Profil enregistré localement avec succès !')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSaving(false)
    }
  }

  // Génération des initiales pour le badge avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-dice-blue/20 border-t-dice-blue" />
          <div className="absolute h-6 w-6 rounded-full bg-dice-blue/10 animate-ping" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* En-tête de navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/espace-client"
          className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm border border-gray-200/80 transition-all hover:border-dice-blue hover:text-dice-blue hover:shadow-md active:scale-95"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-1 text-dice-blue" />
          <span>Retour au tableau de bord</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Session active
        </span>
      </div>

      {/* Carte Avatar Hero */}
     <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A89F2] via-[#0878d6] to-[#0057C2] p-6 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/15 " />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl font-black text-white shadow-inner backdrop-blur-md border border-white/20">
            {getInitials(formData.name)}
            <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 ring-4 ring-dice-blue-dark">
              <FaCheckCircle className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {formData.name || 'Profil Utilisateur'}
            </h1>
            <p className="text-sm text-blue-100/80">{formData.email}</p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">
                Espace Client DICE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice sur le stockage local */}
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 p-4 text-amber-900 border border-amber-200/60 shadow-sm">
        <FaInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-amber-950">Synchronisation locale</p>
          Le serveur DICE conserve la gestion centralisée des comptes clients. Les modifications apportées sur cette page sont enregistrées sur votre appareil actuel uniquement.
        </div>
      </div>

      {/* Formulaire principal */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl shadow-gray-100/80 space-y-6"
      >
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900">Informations personnelles</h2>
          <p className="text-xs text-gray-500">Mettez à jour vos coordonnées locales d'identification.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Nom complet */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Nom complet <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaUser className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-dice-blue focus:bg-white focus:ring-4 focus:ring-dice-blue/10 font-medium"
                required
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Adresse email
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                <FaLock className="h-2.5 w-2.5" /> Lecture seule
              </span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaEnvelope className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100/80 py-3 pl-10 pr-4 text-sm font-medium text-gray-500"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Numéro de téléphone
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaPhone className="h-4 w-4" />
              </div>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+237 …"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-dice-blue focus:bg-white focus:ring-4 focus:ring-dice-blue/10 font-medium"
              />
            </div>
          </div>

          {/* Sexe */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Genre / Sexe
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaVenusMars className="h-4 w-4" />
              </div>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-10 text-sm font-medium text-gray-800 outline-none transition-all duration-200 focus:border-dice-blue focus:bg-white focus:ring-4 focus:ring-dice-blue/10"
              >
                <option value="">Sélectionner</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Actions du formulaire */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-gray-100 pt-6">
          <Link
            href="/espace-client"
            className="flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95"
          >
            Annuler
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dice-blue to-dice-blue-dark px-7 py-3 text-sm font-bold text-white shadow-lg shadow-dice-blue/25 transition-all hover:shadow-dice-blue/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FaSave className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>{saving ? 'Enregistrement…' : 'Enregistrer localement'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}