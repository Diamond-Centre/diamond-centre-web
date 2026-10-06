'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaCamera } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { fileToProfileDataUrl, profileImageTooLargeMessage } from '@/lib/profileImage'
import { ticketStore } from '@/lib/ticketStore'

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
      if (updated.name && updated.name !== current.name) {
        ticketStore.renameNamedHolder(updated.name)
      }
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
      <div className="ec-loading" style={{ minHeight: 320 }}>
        <div className="ec-spinner" />
      </div>
    )
  }

  const otherSessions = sessions.filter((s) => !s.current).length

  return (
    <div>
      <section className="ec-card ec-card--pad" style={{ padding: 41 }}>
        <h1 className="ec-card-title" style={{ margin: 0 }}>Paramètres du compte</h1>
        <p className="ec-card-sub">
          Gérez vos informations personnelles et la sécurité de vos accès.
        </p>

        <div className="ec-account">
          <nav className="ec-side" aria-label="Paramètres">
            <button
              type="button"
              aria-pressed={activeTab === 'profil'}
              onClick={() => setActiveTab('profil')}
            >
              <span aria-hidden="true">●</span> Mon profil →
            </button>
            <button
              type="button"
              aria-pressed={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            >
              <span aria-hidden="true">◈</span> Sécurité →
            </button>
          </nav>

          <div>
            {/* Identité */}
            <div className="ec-box ec-id">
              <div className="ec-avatar">
                {formData.picture && !photoBroken ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.picture}
                    alt={formData.name || 'Photo de profil'}
                    onError={() => setPhotoBroken(true)}
                  />
                ) : (
                  getInitials(formData.name)
                )}
                <button
                  type="button"
                  className="ec-avatar-btn"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading || photoRemoving}
                  title="Changer la photo"
                  aria-label="Changer la photo"
                >
                  <FaCamera />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div>
                <div className="ec-id-name">
                  {formData.name || 'Utilisateur'}
                  <span className="ec-pill ec-pill--blue" style={{ height: 26, fontWeight: 400, fontSize: 11 }}>
                    Compte Client
                  </span>
                </div>
                <p className="ec-id-mail">{formData.email}</p>
                {formData.picture ? (
                  <button
                    type="button"
                    className="ec-linkbtn"
                    onClick={handlePhotoRemove}
                    disabled={photoUploading || photoRemoving}
                  >
                    {photoRemoving ? 'Suppression…' : 'Supprimer la photo'}
                  </button>
                ) : null}
              </div>
            </div>

            {/* ONGLET PROFIL */}
            {activeTab === 'profil' && (
              <form onSubmit={handleSubmit} className="ec-box ec-form">
                <h3>Informations personnelles</h3>
                <p className="ec-form-sub">Mettez à jour vos coordonnées.</p>

                <div className="ec-fields">
                  <div className="ec-field">
                    <label htmlFor="ec-name">Nom complet</label>
                    <input
                      id="ec-name"
                      className="ec-input"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ec-field">
                    <label htmlFor="ec-tel">Téléphone</label>
                    <input
                      id="ec-tel"
                      className="ec-input"
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+237 …"
                    />
                  </div>
                  <div className="ec-field ec-field--full">
                    <label htmlFor="ec-mail">Adresse e-mail</label>
                    <input
                      id="ec-mail"
                      className="ec-input"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <div className="ec-field ec-field--full">
                    <label htmlFor="ec-sexe">Sexe</label>
                    <select
                      id="ec-sexe"
                      className="ec-input"
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleChange}
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                </div>

                <div className="ec-actions">
                  <Link href="/espace-client" className="ec-btn ec-btn--dark">
                    Retour
                  </Link>
                  <button type="submit" disabled={saving} className="ec-btn ec-btn--sky">
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            )}

            {/* ONGLET SÉCURITÉ */}
            {activeTab === 'security' && (
              <>
                <form onSubmit={handlePasswordSubmit} className="ec-box ec-form">
                  <h3>🔑 Modification du mot de passe</h3>

                  <div className="ec-fields">
                    {!hasLocalPassword ? (
                      <p className="ec-alert">
                        Ce compte a été créé avec Google ou Facebook. Il n’a pas de mot de passe à modifier ici.
                      </p>
                    ) : null}
                    <div className="ec-field ec-field--full">
                      <label htmlFor="ec-cur">Mot de passe actuel</label>
                      <input
                        id="ec-cur"
                        className="ec-input"
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={!hasLocalPassword}
                        required={hasLocalPassword}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="ec-field">
                      <label htmlFor="ec-new">Nouveau mot de passe</label>
                      <input
                        id="ec-new"
                        className="ec-input"
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="ec-field">
                      <label htmlFor="ec-conf">Confirmer le mot de passe</label>
                      <input
                        id="ec-conf"
                        className="ec-input"
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="ec-actions">
                    <button
                      type="submit"
                      disabled={passwordSaving || !hasLocalPassword}
                      className="ec-btn ec-btn--sky"
                    >
                      {passwordSaving ? 'Mise à jour…' : 'Changer le mot de passe'}
                    </button>
                  </div>
                </form>

                <div className="ec-box ec-form">
                  <h3>Sessions &amp; Appareils connectés</h3>

                  {sessionsLoading ? (
                    <div className="ec-loading" style={{ minHeight: 90 }}>
                      <div className="ec-spinner" style={{ width: 28, height: 28 }} />
                    </div>
                  ) : sessions.length === 0 ? (
                    <p className="ec-form-sub" style={{ marginTop: 14 }}>
                      Cet appareil est connecté. Déconnectez-vous puis reconnectez-vous pour voir la liste complète des appareils.
                    </p>
                  ) : (
                    sessions.map((session) => {
                      const mobile = session.device_type === 'mobile' || session.device_type === 'tablet'
                      return (
                        <div key={session.id} className="ec-session">
                          <div className="ec-session-main">
                            <span aria-hidden="true">{mobile ? '▯' : '▣'}</span>
                            <div>
                              <b>{session.device_label || 'Navigateur'}</b>
                              <small>
                                <span aria-hidden="true">● </span>
                                {formatLastSeen(session.last_seen_at)}
                                {session.current ? ' · Cet appareil' : ''}
                                {session.ip ? ` · ${session.ip}` : ''}
                              </small>
                            </div>
                          </div>
                          {!session.current ? <span className="ec-tagline">En ligne</span> : null}
                        </div>
                      )
                    })
                  )}

                  {otherSessions > 0 ? (
                    <div className="ec-actions">
                      <button
                        type="button"
                        onClick={handleLogoutOtherSessions}
                        disabled={revokingSessions}
                        className="ec-btn ec-btn--dark"
                      >
                        {revokingSessions ? 'Déconnexion…' : 'Se déconnecter des autres appareils'}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="ec-danger">
                  <div>
                    <small>⚠ Zone de danger</small>
                    <p>La suppression de votre compte effacera définitivement vos données.</p>
                  </div>
                  <button
                    type="button"
                    className="ec-btn ec-btn--danger"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deletingAccount ? 'Suppression…' : 'Supprimer mon compte'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

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
