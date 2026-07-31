'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser, FaVenusMars } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'

/**
 * Profil client — lecture depuis la session auth.
 * Le backend DICE n’expose pas de PUT /users/:id pour les clients
 * (routes users = admin only), donc on permet uniquement une copie locale.
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
      toast.success('Profil enregistré localement (pas d’API client de mise à jour)')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/espace-client"
          className="rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Mon profil</h1>
          <p className="text-sm text-gray-500">
            Données issues de la connexion. La mise à jour serveur n’est pas
            disponible pour les comptes clients.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-dice-blue"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="+237 …"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-dice-blue"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sexe</label>
          <div className="relative">
            <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-dice-blue"
            >
              <option value="">Sélectionner</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-dice-blue px-5 py-2.5 text-white transition hover:bg-dice-blue-dark disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer localement'}
          </button>
          <Link
            href="/espace-client"
            className="rounded-lg border border-gray-200 px-5 py-2.5 transition hover:bg-gray-50"
          >
            Retour
          </Link>
        </div>
      </form>
    </div>
  )
}
