'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaUser, FaEnvelope, FaPhone, FaVenusMars, FaLock, FaKey,
  FaShieldAlt, FaSave, FaUserShield,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-dice-blue/25 focus:border-dice-blue outline-none transition-colors'

export default function AdminProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    telephone: '',
    sexe: 'homme',
    picture: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const isSuperAdmin = user?.role === 'super_admin'

  useEffect(() => {
    const token = auth.getToken()
    const stored = auth.getUser()
    if (!token || !stored || (stored.role !== 'admin' && stored.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        let profile = stored
        try {
          profile = await api.getMe(token)
        } catch {
          // Fallback to session if /me fails on older API
        }
        setUser(profile)
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          telephone: profile.telephone || '',
          sexe: profile.sexe || 'homme',
          picture: profile.picture || '',
        })
        auth.setUser({ ...stored, ...profile })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  const initials = (name) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Le nom est requis')
      return
    }

    try {
      setSaving(true)
      const token = auth.getToken()
      const updated = await api.updateMe(
        {
          name: form.name.trim(),
          telephone: form.telephone.trim(),
          sexe: form.sexe,
          ...(form.picture ? { picture: form.picture } : {}),
        },
        token
      )
      setUser(updated)
      setForm((prev) => ({
        ...prev,
        name: updated.name || prev.name,
        telephone: updated.telephone || prev.telephone,
        sexe: updated.sexe || prev.sexe,
        picture: updated.picture || prev.picture,
        email: updated.email || prev.email,
      }))
      auth.setUser({ ...(auth.getUser() || {}), ...updated })
      toast.success('Profil mis à jour')
    } catch (err) {
      toast.error(err.message || 'Impossible de mettre à jour le profil')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!isSuperAdmin) {
      toast.error('Seul le super admin peut modifier le mot de passe')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    try {
      setPasswordSaving(true)
      const token = auth.getToken()
      await api.changeMyPassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      )
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Mot de passe mis à jour')
    } catch (err) {
      toast.error(err.message || 'Impossible de modifier le mot de passe')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-dice-blue" />
          Mon profil
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez vos informations administrateur
          {isSuperAdmin ? ' et votre mot de passe.' : '.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
        {form.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.picture}
            alt=""
            className="w-16 h-16 rounded-full object-cover bg-gray-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-dice-blue/10 text-dice-blue font-bold text-lg flex items-center justify-center">
            {initials(form.name)}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 text-lg">{form.name || 'Administrateur'}</p>
          <p className="text-sm text-gray-500">{form.email}</p>
          <span className="inline-flex mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-dice-blue/10 text-dice-blue">
            {isSuperAdmin ? 'Super admin' : 'Admin'}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FaUser className="text-dice-blue" />
            Informations personnelles
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Nom complet
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                value={form.email}
                disabled
                className={`${inputClass} pl-10 pr-10 bg-gray-50 text-gray-500 cursor-not-allowed`}
              />
              <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Téléphone
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                placeholder="+237…"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Sexe
            </label>
            <div className="relative">
              <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
              <select
                name="sexe"
                value={form.sexe}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dice-blue text-white text-sm font-semibold hover:bg-dice-blue-dark disabled:opacity-50"
          >
            <FaSave />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {isSuperAdmin ? (
        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaKey className="text-dice-blue" />
              Mot de passe
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Réservé au super administrateur.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className={inputClass}
                autoComplete="current-password"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Confirmer
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dice-blue text-white text-sm font-semibold hover:bg-dice-blue-dark disabled:opacity-50"
            >
              <FaShieldAlt />
              {passwordSaving ? 'Mise à jour…' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#FFF8E8] border border-[#F5D48A] rounded-2xl p-5 flex gap-3 text-sm text-[#B78103]">
          <FaLock className="mt-0.5 shrink-0" />
          <p>
            La modification du mot de passe est réservée au <strong>super admin</strong>.
            Contactez-le si vous devez réinitialiser votre accès.
          </p>
        </div>
      )}
    </div>
  )
}
