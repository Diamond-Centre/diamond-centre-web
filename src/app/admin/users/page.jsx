/**
 * Gestion des utilisateurs — liste + création d'admins
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import {
  FaUsers, FaSearch, FaSync, FaUserPlus, FaUserShield,
  FaEnvelope, FaPhone, FaUser, FaTimes, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

const EMPTY_FORM = {
  name: '',
  email: '',
  telephone: '',
  sexe: 'homme',
  password: '',
  confirmPassword: '',
}

function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)
  const pages = []
  const window = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/80">
      <p className="text-sm text-gray-500">
        Affichage <span className="font-semibold text-gray-800">{from}–{to}</span> sur{' '}
        <span className="font-semibold text-gray-800">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          aria-label="Page précédente"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`ellipsis-${idx}`} className="w-7 text-center text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${
                p === page
                  ? 'bg-dice-blue text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          aria-label="Page suivante"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    if (!token || !storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    loadUsers()
  }, [router])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getUsers(token)
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs')
      toast.error(err.message || 'Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const counts = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length
    const clients = users.filter((u) => u.role === 'client' || (!u.role || u.role === 'user')).length
    return { total: users.length, admins, clients }
  }, [users])

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const role = user.role || ''
      const isAdmin = role === 'admin' || role === 'super_admin'
      if (roleFilter === 'admin' && !isAdmin) return false
      if (roleFilter === 'client' && isAdmin) return false

      if (!q) return true
      return (
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.telephone?.toLowerCase().includes(q) ||
        String(user.id).includes(q)
      )
    })
  }, [users, searchTerm, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [searchTerm, roleFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, page])

  const roleBadge = (role) => {
    if (role === 'super_admin') return { label: 'Super admin', variant: 'purple' }
    if (role === 'admin') return { label: 'Admin', variant: 'default' }
    return { label: 'Client', variant: 'success' }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.telephone.trim() || !form.password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (form.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    try {
      setSubmitting(true)
      const token = auth.getToken()
      await api.createAdmin(
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          telephone: form.telephone.trim(),
          sexe: form.sexe,
          password: form.password,
        },
        token
      )
      toast.success('Administrateur créé avec succès')
      setForm(EMPTY_FORM)
      setShowForm(false)
      await loadUsers()
    } catch (err) {
      toast.error(err.message || 'Impossible de créer l’administrateur')
    } finally {
      setSubmitting(false)
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
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-dice-blue" />
            Utilisateurs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {counts.total} utilisateur{counts.total > 1 ? 's' : ''} · {counts.admins} admin
            {counts.admins > 1 ? 's' : ''} · {counts.clients} client{counts.clients > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
          >
            <FaSync />
            Rafraîchir
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm flex items-center gap-2"
          >
            {showForm ? <FaTimes /> : <FaUserPlus />}
            {showForm ? 'Fermer' : 'Nouvel admin'}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateAdmin}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserShield className="text-dice-blue" />
            Ajouter un administrateur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="admin@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="+237670000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
              <select
                name="sexe"
                value={form.sexe}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="Min. 6 caractères"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Création…' : 'Créer l’administrateur'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher (nom, email, téléphone, ID)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent bg-white"
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Admins</option>
          <option value="client">Clients</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun utilisateur</h3>
          <p className="text-gray-400">Aucun résultat pour ces filtres</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Utilisateur</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Rôle</th>
                  <th className="px-4 py-3 font-medium">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {pageUsers.map((user) => {
                  const badge = roleBadge(user.role)
                  return (
                    <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.picture}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-dice-blue/10 flex items-center justify-center">
                              <FaUser className="text-dice-blue text-sm" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{user.name || '—'}</p>
                            <p className="text-xs text-gray-400">#{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center gap-2">
                            <FaEnvelope className="text-dice-blue text-xs" />
                            {user.email || '—'}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaPhone className="text-dice-blue text-xs" />
                            {user.telephone || '—'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('fr-FR')
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            totalItems={filteredUsers.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </div>
  )
}
