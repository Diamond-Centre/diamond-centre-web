/**
 * Certificats admin — aligné sur l’app mobile DiCe
 * Formations passées → participants → délivrance
 */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import {
  FaCertificate, FaSync, FaCheck, FaEye, FaSearch,
  FaGraduationCap, FaMapMarkerAlt, FaExclamationTriangle,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

function parseDay(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isFormationEnded(event) {
  const end = parseDay(event?.end_date || event?.start_date)
  if (!end) return false
  const today = parseDay(new Date())
  return end.getTime() <= today.getTime()
}

function formatFrDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function initialOf(name) {
  const t = (name || '').trim()
  return t ? t[0].toUpperCase() : '?'
}

export default function AdminCertificatesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loadingEligible, setLoadingEligible] = useState(false)
  const [issuing, setIssuing] = useState(false)
  const [formations, setFormations] = useState([])
  const [pendingByEvent, setPendingByEvent] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [eligible, setEligible] = useState([])
  const [alreadyIssued, setAlreadyIssued] = useState([])
  const [eventMeta, setEventMeta] = useState(null)
  const [selectedTickets, setSelectedTickets] = useState(new Set())
  const [tab, setTab] = useState('pending') // pending | issued
  const [scope, setScope] = useState('past') // past | all
  const [formationQuery, setFormationQuery] = useState('')
  const [participantQuery, setParticipantQuery] = useState('')
  const [error, setError] = useState(null)
  const [previewHtml, setPreviewHtml] = useState(null)
  const [previewCode, setPreviewCode] = useState(null)
  const [issueConfirmOpen, setIssueConfirmOpen] = useState(false)
  const [issueConfirmMessage, setIssueConfirmMessage] = useState('')

  const selectedFormation = useMemo(
    () => formations.find((f) => f.id === selectedId) || null,
    [formations, selectedId]
  )

  const formationEnded = useMemo(() => {
    if (eventMeta) {
      return isFormationEnded({
        start_date: eventMeta.start_date,
        end_date: eventMeta.end_date,
      })
    }
    return selectedFormation ? isFormationEnded(selectedFormation) : false
  }, [eventMeta, selectedFormation])

  const scopedFormations = useMemo(() => {
    let list = formations
    if (scope === 'past') {
      list = list.filter(isFormationEnded)
    }
    const q = formationQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (f) =>
          f.title?.toLowerCase().includes(q) ||
          f.location?.toLowerCase().includes(q)
      )
    }
    return list
  }, [formations, scope, formationQuery])

  const filteredEligible = useMemo(() => {
    const q = participantQuery.trim().toLowerCase()
    if (!q) return eligible
    return eligible.filter(
      (p) =>
        p.customer_name?.toLowerCase().includes(q) ||
        p.customer_email?.toLowerCase().includes(q)
    )
  }, [eligible, participantQuery])

  const filteredIssued = useMemo(() => {
    const q = participantQuery.trim().toLowerCase()
    if (!q) return alreadyIssued
    return alreadyIssued.filter(
      (c) =>
        c.recipient_name?.toLowerCase().includes(q) ||
        c.recipient_email?.toLowerCase().includes(q) ||
        c.code?.toLowerCase().includes(q)
    )
  }, [alreadyIssued, participantQuery])

  const totalParticipants = eligible.length + alreadyIssued.length
  const completionRatio =
    totalParticipants === 0 ? 0 : alreadyIssued.length / totalParticipants

  const loadEligible = useCallback(async (id, { preserveSelection = false, previousSelection = null } = {}) => {
    if (!id) {
      setEligible([])
      setAlreadyIssued([])
      setEventMeta(null)
      setSelectedTickets(new Set())
      return
    }
    try {
      setLoadingEligible(true)
      const token = auth.getToken()
      const data = await api.getCertificateEligible(id, token)
      const nextEligible = Array.isArray(data.eligible) ? data.eligible : []
      const nextIssued = Array.isArray(data.already_issued) ? data.already_issued : []
      const eligibleIds = new Set(nextEligible.map((p) => p.ticket_id))

      let nextSelected = new Set()
      if (preserveSelection && previousSelection) {
        nextSelected = new Set([...previousSelection].filter((tid) => eligibleIds.has(tid)))
        if (nextSelected.size === 0 && eligibleIds.size > 0) {
          nextSelected = eligibleIds
        }
      } else {
        nextSelected = eligibleIds
      }

      setEventMeta(data.event || null)
      setEligible(nextEligible)
      setAlreadyIssued(nextIssued)
      setSelectedTickets(nextSelected)
      setPendingByEvent((prev) => ({ ...prev, [id]: nextEligible.length }))
      setTab(
        nextEligible.length === 0 && nextIssued.length > 0 ? 'issued' : 'pending'
      )
      setParticipantQuery('')
    } catch (err) {
      setEligible([])
      setAlreadyIssued([])
      setEventMeta(null)
      setSelectedTickets(new Set())
      toast.error(err.message || 'Impossible de charger les participants')
    } finally {
      setLoadingEligible(false)
    }
  }, [])

  const loadFormations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const events = await api.getEvents(token)
      const list = (Array.isArray(events) ? events : events?.data || [])
        .filter((e) => String(e.category || '').toLowerCase() === 'formation')
        .sort((a, b) => new Date(b.end_date || b.start_date || 0) - new Date(a.end_date || a.start_date || 0))

      const pendingMap = {}
      await Promise.all(
        list.map(async (f) => {
          try {
            const data = await api.getCertificateEligible(f.id, token)
            pendingMap[f.id] = Array.isArray(data.eligible) ? data.eligible.length : 0
          } catch {
            pendingMap[f.id] = 0
          }
        })
      )

      list.sort((a, b) => {
        const pa = pendingMap[a.id] || 0
        const pb = pendingMap[b.id] || 0
        if (pa !== pb) return pb - pa
        return (
          new Date(b.end_date || b.start_date || 0) -
          new Date(a.end_date || a.start_date || 0)
        )
      })

      setFormations(list)
      setPendingByEvent(pendingMap)

      const past = list.filter(isFormationEnded)
      const preferredPool = scope === 'past' && past.length ? past : list
      const stillValid =
        selectedId != null && preferredPool.some((f) => f.id === selectedId)
      const nextId = stillValid
        ? selectedId
        : preferredPool[0]?.id ?? list[0]?.id ?? null

      setSelectedId(nextId)
      if (nextId) await loadEligible(nextId, { preserveSelection: false })
      else {
        setEligible([])
        setAlreadyIssued([])
        setEventMeta(null)
      }
    } catch (err) {
      setError(err.message || 'Impossible de charger les formations')
      toast.error(err.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial/refresh load; avoid loop on selectedTickets
  }, [])

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    if (!token || !storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    loadFormations()
  }, [router, loadFormations])

  // When scope changes, pick first visible formation if current is out of scope
  useEffect(() => {
    if (!formations.length) return
    const visible = scope === 'past' ? formations.filter(isFormationEnded) : formations
    if (!visible.length) {
      setSelectedId(null)
      setEligible([])
      setAlreadyIssued([])
      setEventMeta(null)
      return
    }
    if (selectedId == null || !visible.some((f) => f.id === selectedId)) {
      const nextId = visible[0].id
      setSelectedId(nextId)
      loadEligible(nextId, { preserveSelection: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope])

  const selectFormation = (id) => {
    if (id === selectedId) return
    setSelectedId(id)
    loadEligible(id, { preserveSelection: false })
  }

  const toggleTicket = (ticketId) => {
    setSelectedTickets((prev) => {
      const next = new Set(prev)
      if (next.has(ticketId)) next.delete(ticketId)
      else next.add(ticketId)
      return next
    })
  }

  const toggleAllFiltered = () => {
    const ids = filteredEligible.map((p) => p.ticket_id)
    const allOn = ids.length > 0 && ids.every((id) => selectedTickets.has(id))
    setSelectedTickets((prev) => {
      const next = new Set(prev)
      if (allOn) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      return next
    })
  }

  const confirmAndIssue = () => {
    if (!selectedId || selectedTickets.size === 0) return
    const count = selectedTickets.size
    const title = selectedFormation?.title || eventMeta?.title || 'cette formation'
    let message = `Délivrer ${count} certificat${count > 1 ? 's' : ''} pour « ${title} » ?\nLes participants seront notifiés.`
    if (!formationEnded) {
      message += '\n\nAttention : la formation n’est pas encore terminée.'
    }
    setIssueConfirmMessage(message)
    setIssueConfirmOpen(true)
  }

  const executeIssue = async () => {
    if (!selectedId || selectedTickets.size === 0) return

    try {
      setIssuing(true)
      const token = auth.getToken()
      const result = await api.issueCertificates(
        {
          event_id: Number(selectedId),
          ticket_ids: [...selectedTickets],
        },
        token
      )
      const issuedCount = result.issued_count ?? result.certificates?.length ?? 0
      toast.success(
        issuedCount === 0
          ? 'Aucun nouveau certificat (déjà délivrés).'
          : `${issuedCount} certificat(s) délivré(s). Les participants sont notifiés.`
      )
      setIssueConfirmOpen(false)
      await loadEligible(selectedId, { preserveSelection: false })
      if (issuedCount > 0) setTab('issued')
    } catch (err) {
      toast.error(err.message || 'Échec de la délivrance')
    } finally {
      setIssuing(false)
    }
  }

  const openPreview = async (code) => {
    try {
      const token = auth.getToken()
      const response = await fetch(api.getCertificateHtmlUrl(code, false), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) throw new Error('Aperçu indisponible')
      setPreviewCode(code)
      setPreviewHtml(await response.text())
    } catch (err) {
      toast.error(err.message || 'Impossible d’ouvrir le certificat')
    }
  }

  const pastCount = formations.filter(isFormationEnded).length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="pb-28">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCertificate className="text-dice-blue" />
            Certificats
          </h1>
        </div>
        <button
          type="button"
          onClick={loadFormations}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
        >
          <FaSync className={loadingEligible ? 'animate-spin' : ''} />
          Rafraîchir
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
          <button type="button" onClick={loadFormations} className="ml-3 underline text-sm">
            Réessayer
          </button>
        </div>
      )}

      {formations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FaGraduationCap className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune formation</h3>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            Créez un événement de catégorie « formation » pour pouvoir délivrer des certificats.
          </p>
          <Link
            href="/admin/events/create"
            className="inline-flex px-4 py-2 bg-dice-blue text-white rounded-lg text-sm hover:bg-dice-blue-dark"
          >
            Créer une formation
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 self-start">
              <button
                type="button"
                onClick={() => setScope('past')}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${scope === 'past' ? 'bg-dice-blue text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Passées ({pastCount})
              </button>
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${scope === 'all' ? 'bg-dice-blue text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Toutes ({formations.length})
              </button>
            </div>
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={formationQuery}
                onChange={(e) => setFormationQuery(e.target.value)}
                placeholder="Rechercher une formation…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              />
            </div>
          </div>

          {scopedFormations.length === 0 ? (
            <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-xl px-4 py-6 text-sm mb-6">
              {scope === 'past'
                ? 'Aucune formation terminée pour le moment. Passez sur « Toutes » ou attendez la fin d’une session.'
                : `Aucune formation pour « ${formationQuery} ».`}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
              {scopedFormations.map((f) => {
                const selected = f.id === selectedId
                const pending = pendingByEvent[f.id] ?? 0
                const ended = isFormationEnded(f)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => selectFormation(f.id)}
                    className={`shrink-0 w-56 text-left rounded-xl border p-3 transition-colors ${selected
                        ? 'bg-dice-blue border-dice-blue text-white'
                        : 'bg-white border-gray-200 hover:border-dice-blue/40'
                      }`}
                  >
                    <p className={`font-semibold text-sm line-clamp-2 ${selected ? 'text-white' : 'text-gray-800'}`}>
                      {f.title}
                    </p>
                    <p className={`text-xs mt-1 ${selected ? 'text-white/80' : 'text-gray-500'}`}>
                      {formatFrDate(f.end_date || f.start_date)}
                      {!ended ? ' · à venir' : ''}
                    </p>
                    <span
                      className={`inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${selected
                          ? 'bg-white/20 text-white'
                          : pending > 0
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                    >
                      {pending > 0 ? `${pending} à délivrer` : 'À jour'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {selectedId && (
            <>
              {/* Summary */}
              <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 text-white p-5 mb-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-amber-300 uppercase mb-2">
                      Diamond Centre
                    </p>
                    <h2 className="text-xl font-bold leading-snug">
                      {selectedFormation?.title || eventMeta?.title}
                    </h2>
                    <p className="text-sm text-white/70 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{formatFrDate(eventMeta?.end_date || eventMeta?.start_date || selectedFormation?.end_date || selectedFormation?.start_date)}</span>
                      {(selectedFormation?.location || eventMeta?.location) && (
                        <span className="inline-flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" />
                          {selectedFormation?.location || eventMeta?.location}
                        </span>
                      )}
                    </p>
                  </div>
                  <FaCertificate className="text-2xl text-white/80 shrink-0" />
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.round(completionRatio * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-white/80 mt-2 font-medium">
                  {totalParticipants === 0
                    ? 'Aucun participant pour cette formation'
                    : `${Math.round(completionRatio * 100)}% délivrés · ${alreadyIssued.length}/${totalParticipants}`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'À délivrer', value: eligible.length, color: 'text-orange-600' },
                  { label: 'Délivrés', value: alreadyIssued.length, color: 'text-emerald-600' },
                  { label: 'Total', value: totalParticipants, color: 'text-dice-blue' },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {!formationEnded && (
                <div className="mb-4 flex gap-2 items-start bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-3 py-2.5 text-sm">
                  <FaExclamationTriangle className="mt-0.5 shrink-0 text-orange-500" />
                  <p>
                    La formation n’est pas encore terminée. Vous pouvez délivrer, mais vérifiez
                    d’abord la présence des participants.
                  </p>
                </div>
              )}

              <div className="inline-flex w-full sm:w-auto rounded-lg bg-gray-100 p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setTab('pending')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-md transition-colors ${tab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                >
                  À délivrer
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {eligible.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('issued')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-md transition-colors ${tab === 'issued' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                >
                  Délivrés
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {alreadyIssued.length}
                  </span>
                </button>
              </div>

              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={participantQuery}
                  onChange={(e) => setParticipantQuery(e.target.value)}
                  placeholder={
                    tab === 'pending'
                      ? 'Rechercher un participant…'
                      : 'Rechercher nom, email, code…'
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-dice-blue focus:border-transparent bg-white"
                />
              </div>

              {loadingEligible ? (
                <div className="py-16 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-dice-blue border-t-transparent" />
                </div>
              ) : tab === 'pending' ? (
                <div className="space-y-2">
                  {filteredEligible.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>{selectedTickets.size} sélectionné(s)</span>
                      <button
                        type="button"
                        onClick={toggleAllFiltered}
                        className="text-dice-blue font-medium hover:underline"
                      >
                        {filteredEligible.every((p) => selectedTickets.has(p.ticket_id))
                          ? 'Tout désélectionner'
                          : 'Tout sélectionner'}
                      </button>
                    </div>
                  )}

                  {filteredEligible.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-gray-700">
                        {eligible.length === 0 ? 'Plus personne en attente' : 'Aucun résultat'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {eligible.length === 0
                          ? 'Tous les certificats de cette formation sont délivrés.'
                          : 'Modifiez votre recherche.'}
                      </p>
                    </div>
                  ) : (
                    filteredEligible.map((p) => {
                      const on = selectedTickets.has(p.ticket_id)
                      return (
                        <button
                          key={p.ticket_id}
                          type="button"
                          onClick={() => toggleTicket(p.ticket_id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border bg-white text-left transition-colors ${on ? 'border-dice-blue/50 bg-dice-blue/5' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${on ? 'bg-dice-blue/15 text-dice-blue' : 'bg-gray-100 text-gray-500'
                              }`}
                          >
                            {initialOf(p.customer_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {p.customer_name || '—'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {p.customer_email || '—'}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggleTicket(p.ticket_id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 accent-[#0a89f2]"
                          />
                        </button>
                      )
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredIssued.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-gray-700">
                        {alreadyIssued.length === 0
                          ? 'Aucun certificat délivré'
                          : 'Aucun résultat'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {alreadyIssued.length === 0
                          ? 'Sélectionnez des participants dans « À délivrer ».'
                          : 'Modifiez votre recherche.'}
                      </p>
                    </div>
                  ) : (
                    filteredIssued.map((c) => (
                      <button
                        key={c.id || c.code}
                        type="button"
                        onClick={() => openPreview(c.code)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-dice-blue/40 text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <FaCheck />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {c.recipient_name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono truncate">
                            N° {c.code}
                          </p>
                          {c.issued_at && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Délivré le {formatFrDate(c.issued_at)}
                            </p>
                          )}
                        </div>
                        <FaEye className="text-dice-blue shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === 'pending' && eligible.length > 0 && (
        <div className="fixed bottom-0 right-0 left-0 md:left-64 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40">
          <button
            type="button"
            disabled={issuing || selectedTickets.size === 0}
            onClick={confirmAndIssue}
            className="w-full max-w-3xl mx-auto flex items-center justify-center gap-2 py-3 rounded-xl bg-dice-blue text-white font-semibold disabled:opacity-50 hover:bg-dice-blue-dark transition-colors"
          >
            <FaCertificate />
            {issuing
              ? 'Délivrance…'
              : selectedTickets.size === 0
                ? 'Sélectionnez des participants'
                : `Délivrer ${selectedTickets.size} certificat${selectedTickets.size > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {previewHtml && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => {
            setPreviewHtml(null)
            setPreviewCode(null)
          }}
          role="dialog"
          aria-label="Aperçu du certificat"
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-800 truncate">
                Certificat {previewCode}
              </p>
              <button
                type="button"
                onClick={() => {
                  setPreviewHtml(null)
                  setPreviewCode(null)
                }}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Fermer
              </button>
            </div>
            <iframe
              title="Aperçu certificat"
              srcDoc={previewHtml}
              className="w-full flex-1 min-h-[70vh] border-0"
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={issueConfirmOpen}
        title="Confirmer la délivrance"
        message={issueConfirmMessage}
        confirmLabel="Délivrer"
        cancelLabel="Annuler"
        tone="primary"
        loading={issuing}
        onConfirm={executeIssue}
        onCancel={() => {
          if (issuing) return
          setIssueConfirmOpen(false)
        }}
      />
    </div>
  )
}
