/**
 * Notifications client — same flow as the mobile app
 */
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaBell,
  FaCalendarAlt,
  FaCertificate,
  FaCheckDouble,
  FaInfoCircle,
  FaSpinner,
  FaTicketAlt,
  FaTimesCircle,
  FaUndo,
} from 'react-icons/fa'
import { useNotifications } from '@/hooks/useNotifications'
import LoadError from '@/components/ui/LoadError'

const TYPE_META = {
  reservation: {
    label: 'Réservation',
    className: 'bg-[#E8F3FE] text-[#0A89F2]',
    icon: FaTicketAlt,
  },
  rappel: {
    label: 'Rappel',
    className: 'bg-[#FFF4DE] text-[#B78103]',
    icon: FaBell,
  },
  info: {
    label: 'Info',
    className: 'bg-emerald-50 text-[#0B9B6B]',
    icon: FaInfoCircle,
  },
  annulation: {
    label: 'Annulation',
    className: 'bg-red-50 text-red-600',
    icon: FaTimesCircle,
  },
  modification: {
    label: 'Modification',
    className: 'bg-orange-50 text-[#E67E22]',
    icon: FaCalendarAlt,
  },
  remboursement: {
    label: 'Remboursement',
    className: 'bg-emerald-50 text-[#0B9B6B]',
    icon: FaUndo,
  },
  certificat: {
    label: 'Certificat',
    className: 'bg-[#FFF8E8] text-[#B8892C]',
    icon: FaCertificate,
  },
}

function formatWhen(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function targetHref(notification) {
  if (
    notification.type === 'modification' &&
    notification.change_id &&
    notification.ticket_id
  ) {
    return `/espace-client/notifications/changement/${notification.change_id}?ticket=${notification.ticket_id}`
  }
  if (notification.type === 'certificat') return '/espace-client/certificats'
  if (notification.ticket_id) return '/espace-client/tickets'
  if (notification.event_id) return '/espace-client/agenda'
  return null
}

export default function NotificationsPage() {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotifications()
  const [openingId, setOpeningId] = useState(null)

  const sorted = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        const ta = new Date(a.created_at || 0).getTime()
        const tb = new Date(b.created_at || 0).getTime()
        return tb - ta
      }),
    [notifications]
  )

  async function openNotification(notification) {
    setOpeningId(notification.id)
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }
    const href = targetHref(notification)
    if (href) router.push(href)
    setOpeningId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
            Alertes
          </p>
          <h1 className="mt-1 text-[1.75rem] font-extrabold tracking-tight text-[#0B1220]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            Réservations, rappels et modifications d’événements — comme sur l’app.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => refresh({ sync: true })}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E8EEF5] bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] hover:bg-[#F3F6FA] disabled:opacity-50"
          >
            <FaSpinner className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0A89F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0770cc]"
            >
              <FaCheckDouble className="text-xs" />
              Tout lire
            </button>
          ) : null}
        </div>
      </div>

      {error ? <LoadError onRetry={() => refresh({ sync: true })} /> : null}

      {loading && sorted.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-[24px] border border-[#E8EEF5] bg-white text-[#667085]">
          <FaSpinner className="mr-2 animate-spin" />
          Chargement…
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3FE] text-[#0A89F2]">
            <FaBell />
          </div>
          <h2 className="text-lg font-bold text-[#0B1220]">Aucune notification</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Les changements d’événements et confirmations apparaîtront ici.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((n, index) => {
            const meta = TYPE_META[n.type] || TYPE_META.info
            const Icon = meta.icon
            const href = targetHref(n)
            return (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.2) }}
              >
                <button
                  type="button"
                  onClick={() => openNotification(n)}
                  disabled={openingId === n.id}
                  className={`w-full rounded-[22px] border p-4 text-left transition ${
                    n.is_read
                      ? 'border-[#E8EEF5] bg-white'
                      : 'border-[#0A89F2]/25 bg-[#F5FAFF] shadow-[0_8px_24px_rgba(10,137,242,0.08)]'
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meta.className}`}
                    >
                      <Icon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                        {!n.is_read ? (
                          <span className="h-2 w-2 rounded-full bg-[#0A89F2]" />
                        ) : null}
                        <span className="text-[11px] text-[#98A2B3]">
                          {formatWhen(n.created_at)}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0B1220]">{n.title}</h3>
                      <p className="mt-1 whitespace-pre-line text-sm text-[#667085]">
                        {n.message}
                      </p>
                      {href ? (
                        <p className="mt-2 text-xs font-semibold text-[#0A89F2]">
                          {n.type === 'modification'
                            ? 'Voir la modification →'
                            : 'Ouvrir →'}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </button>
              </motion.li>
            )
          })}
        </ul>
      )}

      <p className="text-center text-xs text-[#98A2B3]">
        Besoin d’aide ?{' '}
        <Link href="/espace-client/tickets" className="font-semibold text-[#0A89F2]">
          Voir mes tickets
        </Link>
      </p>
    </div>
  )
}
