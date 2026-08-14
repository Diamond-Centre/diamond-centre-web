'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaVenusMars,
  FaLock,
  FaShieldAlt,
  FaChevronRight,
  FaKey,
  FaMobileAlt,
  FaDesktop,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCamera,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { fileToProfileDataUrl, profileImageTooLargeMessage } from '@/lib/profileImage'

function formatLastSeen(iso) {
  if (!iso) return 'Actif récemment'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Actif récemment'
  const diff = Date.now() - d.getTime()
  if (diff < 60 * 1000) return 'Actif maintenant'
  if (diff < 60 * 60 * 1000) return `Il y a ${Math.max(1, Math.floor(diff / 60000))} min`
  if (diff < 24 * 60 * 60 * 1000) return `Il y a ${Math.max(1, Math.floor(diff / 3600000))} h`
  return d.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Profil client — lecture depuis la session auth.
 * Backend DICE : Mise à jour locale du profil et gestion de la sécurité.
 */
export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profil')

  // State Profil
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    sexe: '',
    picture: '',
  })
  const [photoBroken, setPhotoBroken] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoRemoving, setPhotoRemoving] = useState(false)
  const photoInputRef = useRef(null)

  // State Sécurité
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [hasLocalPassword, setHasLocalPassword] = useState(true)
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [revokingSessions, setRevokingSessions] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    const token = auth.getToken()
    const userData = auth.getUser()
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    const applyUser = (profile) => {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        telephone: profile.telephone || '',
        sexe: profile.sexe || '',
        picture: profile.picture || '',
      })
      setHasLocalPassword(
        profile.has_password != null
          ? Boolean(profile.has_password)
          : profile.auth_provider === 'local' || profile.auth_provider == null
      )
      setPhotoBroken(false)
    }

    applyUser(userData)

    const load = async () => {
      try {
        const profile = await api.getMe(token)
        applyUser({ ...userData, ...profile })
        auth.setUser({ ...userData, ...profile })
      } catch {
        // Keep the session photo if /users/me is unavailable
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  const loadSessions = async () => {
    const token = auth.getToken()
    if (!token) return
    setSessionsLoading(true)
    try {
      const list = await api.getMySessions(token)
      setSessions(Array.isArray(list) ? list : [])
    } catch {
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'security') {
      loadSessions()
    }
  }, [activeTab])

  // Handlers Profil
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Le nom est requis')
      return
    }
    setSaving(true)
    try {
      const current = auth.getUser() || {}
      const token = auth.getToken()
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      const updated = await api.updateMe(
        {
          name: formData.name.trim(),
          telephone: formData.telephone.trim(),
          sexe: formData.sexe,
          ...(formData.picture ? { picture: formData.picture } : {}),
        },
        token
      )
      auth.setUser({ ...current, ...updated })
      setFormData((prev) => ({
        ...prev,
        name: updated.name || prev.name,
        telephone: updated.telephone || prev.telephone,
        sexe: updated.sexe || prev.sexe,
        picture: updated.picture !== undefined ? updated.picture : prev.picture,
        email: updated.email || prev.email,
      }))
      toast.success('Profil mis à jour')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSaving(false)
    }
  }

  // Handlers Sécurité
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!hasLocalPassword) {
      toast.error('Ce compte n’a pas de mot de passe local.')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('Le nouveau mot de passe doit être différent de l’actuel.')
      return
    }

    setPasswordSaving(true)
    try {
      const token = auth.getToken()
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      await api.changeMyPassword(
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        token
      )
      toast.success('Mot de passe mis à jour. L’ancien mot de passe ne fonctionne plus.')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      await loadSessions()
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la modification')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleLogoutOtherSessions = async () => {
    const token = auth.getToken()
    if (!token) {
      toast.error('Session expirée. Veuillez vous reconnecter.')
      return
    }
    setRevokingSessions(true)
    try {
      const result = await api.revokeOtherSessions(token)
      const n = Number(result?.revoked || 0)
      await loadSessions()
      toast.success(
        n > 0
          ? `${n} autre${n > 1 ? 's' : ''} appareil${n > 1 ? 's' : ''} déconnecté${n > 1 ? 's' : ''}.`
          : 'Aucun autre appareil à déconnecter.'
      )
    } catch (error) {
      toast.error(
        error.message || 'Impossible de déconnecter les autres appareils.'
      )
    } finally {
      setRevokingSessions(false)
    }
  }

  const handleDeleteAccount = () => {
    if (deletingAccount) return
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteAccount = async () => {
    if (deletingAccount) return
    setDeletingAccount(true)
    try {
      const token = auth.getToken()
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      await api.deleteMe(token)
      setDeleteConfirmOpen(false)
      auth.logout?.()
      toast.success('Votre compte a été supprimé définitivement.')
      window.location.href = '/auth/login'
    } catch (error) {
      toast.error(
        error.message || 'Impossible de supprimer le compte. Réessayez plus tard.'
      )
      setDeletingAccount(false)
    }
  }

  // Initiales Avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    setPhotoUploading(true)
    try {
      const dataUrl = await fileToProfileDataUrl(file)
      const token = auth.getToken()
      const current = auth.getUser() || {}
      let picture = dataUrl
      try {
        const updated = await api.updateMe({ picture: dataUrl }, token)
        picture = updated.picture || dataUrl
        auth.setUser({ ...current, ...updated, picture })
      } catch (err) {
        throw err
      }
      setFormData((prev) => ({ ...prev, picture }))
      setPhotoBroken(false)
      toast.success('Photo de profil mise à jour')
    } catch (error) {
      toast.error(profileImageTooLargeMessage())
    } finally {
      setPhotoUploading(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  const handlePhotoRemove = async () => {
    if (photoUploading || photoRemoving) return
    setPhotoRemoving(true)
    try {
      const token = auth.getToken()
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      const current = auth.getUser() || {}
      const updated = await api.updateMe({ picture: '' }, token)
      const picture = updated.picture !== undefined ? updated.picture : ''
      auth.setUser({ ...current, ...updated, picture })
      setFormData((prev) => ({ ...prev, picture }))
      setPhotoBroken(false)
      toast.success('Photo de profil supprimée')
    } catch (error) {
      toast.error(error.message || 'Impossible de supprimer la photo')
    } finally {
      setPhotoRemoving(false)
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
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">

      {/* En-tête de la page */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight md:text-4xl">
            Paramètres du compte
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos informations personnelles et la sécurité de vos accès.
          </p>
        </div>
      </div>

      {/* Grid Principal avec Sidebar Navigation */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">

        {/* Navigation Latérale */}
        <aside className="lg:col-span-3">
          <nav className="flex lg:flex-col gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className={`flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all ${activeTab === 'profil'
                ? 'bg-white text-dice-blue shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <FaUser className="text-sm" />
                <span>Mon profil</span>
              </div>
              {activeTab === 'profil' && <FaChevronRight className="text-sm opacity-50" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all ${activeTab === 'security'
                ? 'bg-white text-dice-blue shadow-sm font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-sm" />
                <span>Sécurité</span>
              </div>
              {activeTab === 'security' && <FaChevronRight className="text-sm opacity-50" />}
            </button>
          </nav>
        </aside>

        {/* Zone de Contenu Principal */}
        <main className="lg:col-span-9 space-y-6">

          {/* En-tête d'Identité avec Avatar */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {formData.picture && !photoBroken ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.picture}
                    alt={formData.name || 'Photo de profil'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-gray-100 shadow-md shadow-dice-blue/20"
                    onError={() => setPhotoBroken(true)}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-dice-blue to-indigo-600 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md shadow-dice-blue/20">
                    {getInitials(formData.name)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading || photoRemoving}
                  className="absolute -bottom-1 -right-1 bg-dice-blue text-white p-1.5 rounded-full border-2 border-white text-xs hover:bg-dice-blue/90 disabled:opacity-60"
                  title="Changer la photo"
                >
                  {photoUploading ? (
                    <span className="block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <FaCamera />
                  )}
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{formData.name || 'Utilisateur'}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-dice-blue border border-blue-100">
                    Compte Client
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
                {formData.picture ? (
                  <button
                    type="button"
                    onClick={handlePhotoRemove}
                    disabled={photoUploading || photoRemoving}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                  >
                    {photoRemoving ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <FaTrashAlt className="text-xs" />
                    )}
                    Supprimer la photo
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* ONGLET 1 : PROFIL */}
          {activeTab === 'profil' && (
            <>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Mettez à jour vos coordonnées. Les changements sont enregistrés dans votre compte.</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Nom complet
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-base outline-none focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/20 transition-all text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Téléphone
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          placeholder="+237 …"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-base outline-none focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/20 transition-all text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-base text-gray-500"
                      />
                      <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">L'adresse e-mail est liée à votre compte d'authentification.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Sexe
                    </label>
                    <div className="relative">
                      <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                      <select
                        name="sexe"
                        value={formData.sexe}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-base outline-none focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/20 transition-all text-gray-900"
                      >
                        <option value="">Sélectionner</option>
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm text-gray-500">Les modifications sont enregistrées dans la base de données.</span>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link
                      href="/espace-client"
                      className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Retour
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-dice-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-dice-blue-dark transition-all shadow-sm disabled:opacity-50"
                    >
                      {saving ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

          {/* ONGLET 2 : SÉCURITÉ */}
          {activeTab === 'security' && (
            <div className="space-y-6">

              {/* 1. Modification du mot de passe */}
              <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaKey className="text-dice-blue text-base" />
                    Modification du mot de passe
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">Mettez à jour votre mot de passe pour sécuriser l'accès à votre compte.</p>
                </div>

                <div className="p-6 space-y-5">
                  {!hasLocalPassword ? (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                      Ce compte a été créé avec Google ou Facebook. Il n’a pas de mot de passe à modifier ici.
                    </p>
                  ) : null}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      disabled={!hasLocalPassword}
                      className="w-full rounded-xl border border-gray-200 py-3 px-4 text-base outline-none focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/20 transition-all text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                      required={hasLocalPassword}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-200 py-3 px-4 text-base outline-none focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/20 transition-all text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-200 py-3 px-4 text-base outline-none focus:border-dice-blue focus:ring-2 focus:ring-dice-blue/20 transition-all text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordSaving || !hasLocalPassword}
                    className="rounded-xl bg-dice-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-dice-blue-dark transition-all shadow-sm disabled:opacity-50"
                  >
                    {passwordSaving ? 'Mise à jour…' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>

              {/* 2. Sessions & Appareils connectés */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Sessions & Appareils connectés</h3>
                </div>

                <div className="p-6 space-y-4">
                  {sessionsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-dice-blue border-t-transparent" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Cet appareil est connecté. Déconnectez-vous puis reconnectez-vous pour voir la liste complète des appareils.
                    </p>
                  ) : (
                    sessions.map((session) => {
                      const mobile = session.device_type === 'mobile' || session.device_type === 'tablet'
                      return (
                        <div
                          key={session.id}
                          className={`flex items-center justify-between p-4 rounded-xl border ${
                            session.current
                              ? 'bg-gray-50/80 border-gray-100'
                              : 'border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm">
                              {mobile ? <FaMobileAlt className="text-base" /> : <FaDesktop className="text-base" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-gray-900">
                                  {session.device_label || 'Navigateur'}
                                </p>
                                {session.current ? (
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="En ligne" />
                                ) : null}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatLastSeen(session.last_seen_at)}
                                {session.ip ? ` • ${session.ip}` : ''}
                              </p>
                            </div>
                          </div>
                          {session.current ? (
                            <span className="text-xs font-semibold text-dice-blue bg-blue-50 px-3 py-1 rounded-lg">
                              Cet appareil
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                              En ligne
                            </span>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleLogoutOtherSessions}
                    disabled={revokingSessions || sessions.filter((s) => !s.current).length === 0}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {revokingSessions ? 'Déconnexion…' : 'Se déconnecter des autres appareils'}
                  </button>
                </div>
              </div>

              {/* 4. Zone de Danger : Suppression du compte */}
              <div className="bg-red-50/40 rounded-2xl border border-red-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500 text-base" />
                    Zone de danger
                  </h3>
                  <p className="text-sm text-red-700/80">
                    La suppression de votre compte effacera définitivement vos données dans la base et fermera l&apos;accès à votre espace.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm flex items-center gap-2 flex-shrink-0 disabled:opacity-60"
                >
                  <FaTrashAlt className="text-xs" />
                  {deletingAccount ? 'Suppression…' : 'Supprimer mon compte'}
                </button>
              </div>

            </div>
          )}

        </main>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Confirmer la suppression"
        message="Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera votre compte de la base de données."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        tone="danger"
        loading={deletingAccount}
        onConfirm={confirmDeleteAccount}
        onCancel={() => {
          if (deletingAccount) return
          setDeleteConfirmOpen(false)
        }}
      />
    </div>
  )
}