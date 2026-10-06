/**
 * Réponse client à une modification d'événement — refonte « verre sombre »
 * (logique inchangée)
 */
'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { FaCheckCircle, FaExchangeAlt, FaUndo } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { ticketStore } from '@/lib/ticketStore'
import LoadError from '@/components/ui/LoadError'

function formatLabel(change, which = 'new') {
  if (!change) return '—'
  const start = which === 'new' ? change.new_start_date : change.old_start_date
  const end = which === 'new' ? change.new_end_date : change.old_end_date
  const startTime = which === 'new' ? change.new_start_time : change.old_start_time
  const endTime = which === 'new' ? change.new_end_time : change.old_end_time
  const location = which === 'new' ? change.new_location : change.old_location
  const datePart = start === end ? start : `${start} → ${end}`
  return `${datePart} · ${startTime}–${endTime} · ${location}`
}

function EventChangeInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const changeId = params?.changeId
  const ticketId = searchParams.get('ticket')

  const [change, setChange] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('decide')
  const [filter, setFilter] = useState('all')
  const [alternatives, setAlternatives] = useState([])
  const [doneMessage, setDoneMessage] = useState('')

  const load = useCallback(async () => {
    if (!changeId) return
    try {
      setLoading(true)
      setError(null)
      const data = await api.getEventChange(changeId, auth.getToken())
      setChange(data)
    } catch (err) {
      setError(err.message || 'Modification introuvable')
    } finally {
      setLoading(false)
    }
  }, [changeId])

  useEffect(() => {
    load()
  }, [load])

  async function accept() {
    if (!ticketId) {
      toast.error('Ticket manquant pour cette notification')
      return
    }
    try {
      setBusy(true)
      await api.acceptEventChange(changeId, ticketId, auth.getToken())
      setDoneMessage(
        'Modification acceptée. Votre agenda est à jour avec la nouvelle date et heure.'
      )
      setStep('done')
      toast.success('Modification acceptée')
    } catch (err) {
      toast.error(err.message || 'Impossible d’accepter')
    } finally {
      setBusy(false)
    }
  }

  async function loadAlternatives(nextFilter = filter) {
    if (!ticketId) {
      toast.error('Ticket manquant pour cette notification')
      return
    }
    try {
      setBusy(true)
      setFilter(nextFilter)
      setStep('alternatives')
      const data = await api.getEventChangeAlternatives(
        changeId,
        ticketId,
        auth.getToken(),
        nextFilter
      )
      setAlternatives(Array.isArray(data?.alternatives) ? data.alternatives : [])
    } catch (err) {
      toast.error(err.message || 'Impossible de charger les alternatives')
    } finally {
      setBusy(false)
    }
  }

  async function swap(alternativeEventId) {
    try {
      setBusy(true)
      const result = await api.swapEventChange(
        changeId,
        ticketId,
        alternativeEventId,
        auth.getToken()
      )
      if (result?.new_event_id) {
        ticketStore.upsert({
          ticket_id: ticketId,
          event_id: result.new_event_id,
          event_title: result.new_event_title || '',
        })
      }
      setDoneMessage(
        result?.new_event_title
          ? `Vous avez été réaffecté à « ${result.new_event_title} ».`
          : 'Vous avez été réaffecté à un autre événement.'
      )
      setStep('done')
      toast.success('Changement enregistré')
    } catch (err) {
      toast.error(err.message || 'Impossible de changer d’événement')
    } finally {
      setBusy(false)
    }
  }

  async function refund() {
    try {
      setBusy(true)
      await api.refundEventChange(changeId, ticketId, auth.getToken())
      ticketStore.remove(ticketId)
      setDoneMessage(
        'Remboursement initié. Votre billet a été annulé et ne sera plus valable.'
      )
      setStep('done')
      toast.success('Remboursement initié')
    } catch (err) {
      toast.error(err.message || 'Impossible de rembourser')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <section className="ec-dark ec-card-pad">
        <div className="ec-state">
          <span className="ec-spin" aria-hidden="true">◌</span>
          Chargement de la modification…
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="ec-dark ec-card-pad">
        <LoadError onRetry={load} />
        <Link
          href="/espace-client/notifications"
          className="ec-btn ec-btn--line"
          style={{ marginTop: 20 }}
        >
          ← Retour aux notifications
        </Link>
      </section>
    )
  }

  if (step === 'done') {
    return (
      <section className="ec-dark ec-card-pad" style={{ textAlign: 'center' }}>
        <div className="ec-empty__ico" aria-hidden="true" style={{ color: '#4ade80' }}>
          <FaCheckCircle />
        </div>
        <h1 className="ec-h1" style={{ marginTop: 0, fontSize: 30 }}>C’est noté</h1>
        <p className="ec-lead" style={{ maxWidth: 440, margin: '12px auto 0' }}>
          {doneMessage}
        </p>
        <div className="ec-form__actions" style={{ justifyContent: 'center', marginTop: 28 }}>
          <button
            type="button"
            onClick={() => router.push('/espace-client/notifications')}
            className="ec-btn ec-btn--line"
          >
            Notifications
          </button>
          <button
            type="button"
            onClick={() => router.push('/espace-client/tickets')}
            className="ec-btn ec-btn--grad"
          >
            Mes tickets
          </button>
        </div>
      </section>
    )
  }

  if (step === 'alternatives') {
    return (
      <section className="ec-dark ec-card-pad">
        <button type="button" onClick={() => setStep('decide')} className="ec-back" style={{ color: '#cfe3f7' }}>
          ← Retour
        </button>
        <h1 className="ec-h1" style={{ marginTop: 0 }}>Choisir une alternative</h1>
        <p className="ec-lead">
          Ou demandez un remboursement si aucune option ne vous convient.
        </p>

        <div className="ec-chips">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'category', label: 'Même catégorie' },
            { id: 'date', label: 'Dates proches' },
            { id: 'price', label: 'Prix similaire' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => loadAlternatives(f.id)}
              className={filter === f.id ? 'is-active' : ''}
            >
              {f.label}
            </button>
          ))}
        </div>

        {busy ? (
          <div className="ec-state">
            <span className="ec-spin" aria-hidden="true">◌</span>
            Chargement…
          </div>
        ) : alternatives.length === 0 ? (
          <p className="ec-note-dash">Aucune alternative pour ce filtre.</p>
        ) : (
          <ul className="ec-stack" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 14 }}>
            {alternatives.map((event) => (
              <li key={event.id} className="ec-row" style={{ minHeight: 0 }}>
                <div className="ec-row__body" style={{ padding: '18px 22px' }}>
                  <p className="ec-row__title ec-row__title--reg">{event.title}</p>
                  <div className="ec-row__meta">
                    <span>
                      {event.start_date}
                      {event.start_time ? ` · ${event.start_time}` : ''}
                      {event.location ? ` · ${event.location}` : ''}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600, color: '#4fb3ff' }}>
                    {Number(event.price || 0).toLocaleString('fr-FR')} {event.currency || 'XAF'}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => swap(event.id)}
                    className="ec-btn ec-btn--grad ec-btn--sm"
                    style={{ marginTop: 12, alignSelf: 'flex-start' }}
                  >
                    <FaExchangeAlt style={{ fontSize: 12 }} />
                    Choisir cet événement
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={refund}
          className="ec-btn ec-btn--soft-danger ec-btn--block"
          style={{ marginTop: 24 }}
        >
          <FaUndo style={{ fontSize: 12 }} />
          Demander un remboursement
        </button>
      </section>
    )
  }

  return (
    <section className="ec-dark ec-card-pad">
      <Link href="/espace-client/notifications" className="ec-back" style={{ color: '#cfe3f7' }}>
        ← Notifications
      </Link>
      <p className="ec-eyebrow" style={{ color: '#ffb020' }}>Modification</p>
      <h1 className="ec-h1">{change?.event_title || 'Événement modifié'}</h1>
      <p className="ec-lead">
        Si vous acceptez, votre agenda sera mis à jour avec la nouvelle date et heure.
      </p>

      <div className="ec-ba">
        <div>
          <small>Avant</small>
          <p style={{ color: '#cfe3f7' }}>{formatLabel(change, 'old')}</p>
        </div>
        <div>
          <small className="is-new">Après</small>
          <p style={{ fontWeight: 600 }}>{formatLabel(change, 'new')}</p>
        </div>
      </div>

      <div className="ec-stack" style={{ gap: 12, marginTop: 24 }}>
        <button
          type="button"
          disabled={busy || !ticketId}
          onClick={accept}
          className="ec-btn ec-btn--ok ec-btn--block"
        >
          {busy ? <span className="ec-spin" aria-hidden="true">◌</span> : <FaCheckCircle />}
          Accepter la modification
        </button>
        <button
          type="button"
          disabled={busy || !ticketId}
          onClick={() => loadAlternatives('all')}
          className="ec-btn ec-btn--line ec-btn--block"
        >
          <FaExchangeAlt />
          Refuser et voir les alternatives
        </button>
      </div>
    </section>
  )
}

export default function EventChangeResponsePage() {
  return (
    <Suspense
      fallback={
        <section className="ec-dark ec-card-pad">
          <div className="ec-state">
            <span className="ec-spin" aria-hidden="true">◌</span>
            Chargement…
          </div>
        </section>
      }
    >
      <EventChangeInner />
    </Suspense>
  )
}
