/**
 * Client response to an event schedule change — mirrors the mobile app.
 */
'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExchangeAlt,
  FaSpinner,
  FaUndo,
} from 'react-icons/fa'
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
      <div className="flex h-48 items-center justify-center text-[#667085]">
        <FaSpinner className="mr-2 animate-spin" />
        Chargement de la modification…
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <LoadError onRetry={load} />
        <Link
          href="/espace-client/notifications"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A89F2]"
        >
          <FaArrowLeft className="text-xs" />
          Retour aux notifications
        </Link>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#0B9B6B]">
          <FaCheckCircle />
        </div>
        <h1 className="text-xl font-extrabold text-[#0B1220]">C’est noté</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#667085]">{doneMessage}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/espace-client/notifications')}
            className="rounded-2xl border border-[#E8EEF5] px-4 py-2.5 text-sm font-semibold text-[#667085]"
          >
            Notifications
          </button>
          <button
            type="button"
            onClick={() => router.push('/espace-client/tickets')}
            className="rounded-2xl bg-[#0A89F2] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Mes tickets
          </button>
        </div>
      </div>
    )
  }

  if (step === 'alternatives') {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setStep('decide')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#667085]"
        >
          <FaArrowLeft className="text-xs" />
          Retour
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-[#0B1220]">
            Choisir une alternative
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            Ou demandez un remboursement si aucune option ne vous convient.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
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
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                filter === f.id
                  ? 'bg-[#0A89F2] text-white'
                  : 'bg-[#F3F6FA] text-[#667085]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {busy ? (
          <div className="flex h-32 items-center justify-center text-[#667085]">
            <FaSpinner className="mr-2 animate-spin" />
            Chargement…
          </div>
        ) : alternatives.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white p-8 text-center text-sm text-[#667085]">
            Aucune alternative pour ce filtre.
          </div>
        ) : (
          <ul className="space-y-3">
            {alternatives.map((event) => (
              <li
                key={event.id}
                className="rounded-[22px] border border-[#E8EEF5] bg-white p-4"
              >
                <h3 className="font-bold text-[#0B1220]">{event.title}</h3>
                <p className="mt-1 text-sm text-[#667085]">
                  {event.start_date}
                  {event.start_time ? ` · ${event.start_time}` : ''}
                  {event.location ? ` · ${event.location}` : ''}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0A89F2]">
                  {Number(event.price || 0).toLocaleString('fr-FR')}{' '}
                  {event.currency || 'XAF'}
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => swap(event.id)}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0A89F2] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <FaExchangeAlt className="text-xs" />
                  Choisir cet événement
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={refund}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 disabled:opacity-50"
        >
          <FaUndo className="text-xs" />
          Demander un remboursement
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link
        href="/espace-client/notifications"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#667085]"
      >
        <FaArrowLeft className="text-xs" />
        Notifications
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E67E22]">
          Modification
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-[#0B1220]">
          {change?.event_title || 'Événement modifié'}
        </h1>
        <p className="mt-1 text-sm text-[#667085]">
          Si vous acceptez, votre agenda sera mis à jour avec la nouvelle date et
          heure.
        </p>
      </div>

      <div className="space-y-3 rounded-[24px] border border-[#E8EEF5] bg-white p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Avant
          </p>
          <p className="mt-1 text-sm font-medium text-[#667085]">
            {formatLabel(change, 'old')}
          </p>
        </div>
        <div className="border-t border-dashed border-[#E8EEF5] pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0A89F2]">
            Après
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0B1220]">
            {formatLabel(change, 'new')}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={busy || !ticketId}
        onClick={accept}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B9B6B] py-3.5 text-sm font-bold text-white hover:bg-[#09865c] disabled:opacity-50"
      >
        {busy ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
        Accepter la modification
      </button>

      <button
        type="button"
        disabled={busy || !ticketId}
        onClick={() => loadAlternatives('all')}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E8EEF5] bg-white py-3.5 text-sm font-bold text-[#0B1220] hover:bg-[#F8FAFC] disabled:opacity-50"
      >
        <FaExchangeAlt />
        Refuser et voir les alternatives
      </button>
    </div>
  )
}

export default function EventChangeResponsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center text-[#667085]">
          <FaSpinner className="mr-2 animate-spin" />
          Chargement…
        </div>
      }
    >
      <EventChangeInner />
    </Suspense>
  )
}
