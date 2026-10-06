/**
 * Notifications client — même flux que l'app mobile
 */
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import { useNotifications } from '@/hooks/useNotifications'
import {
  notificationOpenLabel,
  notificationTargetHref,
} from '@/lib/notificationTargets'
import LoadError from '@/components/ui/LoadError'

const TYPE_META = {
  reservation: { label: 'Réservation', glyph: '▣' },
  rappel: { label: 'Rappel', glyph: '●' },
  info: { label: 'Info', glyph: 'i' },
  annulation: { label: 'Annulation', glyph: '✕' },
  modification: { label: 'Modification', glyph: '▦' },
  remboursement: { label: 'Remboursement', glyph: '↺' },
  certificat: { label: 'Certificat', glyph: '✦' },
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
  } = useNotifications({ autoLoad: true, sync: true })
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
    const href = notificationTargetHref(notification, { fallback: false })
    if (href) router.push(href)
    setOpeningId(null)
  }

  return (
    <div>
      <section className="ec-card ec-card--pad">
        <div className="ec-card-head">
          <div>
            <p className="ec-eyebrow">Alertes</p>
            <h1 className="ec-card-title">Notifications</h1>
            <p className="ec-card-sub">
              Réservations, rappels et modifications d’événements.
            </p>
          </div>
          <button
            type="button"
            className="ec-btn ec-btn--outline"
            style={{ width: 111, padding: 0, marginTop: 0 }}
            onClick={() => (unreadCount > 0 ? markAllAsRead() : refresh({ sync: true }))}
            disabled={loading}
          >
            {unreadCount > 0 ? '✓ Tout lire' : '↻ Actualiser'}
          </button>
        </div>

        <div style={{ marginTop: 40 }}>
          {error ? <LoadError onRetry={() => refresh({ sync: true })} /> : null}

          {loading && sorted.length === 0 ? (
            <div className="ec-loading">
              <FaSpinner className="animate-spin" />
              Chargement…
            </div>
          ) : sorted.length === 0 ? (
            <div className="ec-empty ec-empty--in-card" style={{ marginTop: 0 }}>
              <div className="ec-empty-ico" aria-hidden="true">●</div>
              <h3>Aucune notification</h3>
              <p>Les changements d’événements et confirmations apparaîtront ici.</p>
            </div>
          ) : (
            <ul className="ec-list" style={{ gap: 14 }}>
              {sorted.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.info
                const href = notificationTargetHref(n, { fallback: false })
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => openNotification(n)}
                      disabled={openingId === n.id}
                      className="ec-item ec-notif"
                      data-unread={!n.is_read}
                    >
                      <span className="ec-notif-ico" aria-hidden="true">{meta.glyph}</span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span className="ec-notif-kicker">
                          {meta.label} · {formatWhen(n.created_at)}
                          {!n.is_read ? <i /> : null}
                        </span>
                        <h3>{n.title}</h3>
                        <p>{n.message}</p>
                        {href ? (
                          <span className="ec-notif-link">{notificationOpenLabel(n)}</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <p className="ec-foot-note">
        Besoin d’aide ? <Link href="/espace-client/tickets">Voir mes tickets</Link>
      </p>
    </div>
  )
}
