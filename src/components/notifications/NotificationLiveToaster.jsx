'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { loadNotifications } from '@/hooks/useNotifications'
import { subscribeNewNotifications } from '@/lib/notificationInbox'
import { notificationTargetHref } from '@/lib/notificationTargets'

const POLL_MS = 2500

function isClientSession() {
  const token = auth.getToken()
  const user = auth.getUser()
  if (!token || !user) return false
  return user.role !== 'admin' && user.role !== 'super_admin'
}

function showNotificationToast(notification, router) {
  const href = notificationTargetHref(notification)
  toast.custom(
    (t) => (
      <button
        type="button"
        onClick={() => {
          toast.dismiss(t.id)
          router.push(href)
        }}
        className="flex w-[min(22rem,calc(100vw-2rem))] gap-3 rounded-2xl border border-[#0A89F2]/25 bg-white p-4 text-left shadow-[0_12px_40px_rgba(11,18,32,0.16)]"
      >
        <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0A89F2]" />
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#0A89F2]">
            Nouvelle notification
          </span>
          <span className="mt-0.5 block font-bold text-[#0B1220]">
            {notification.title || 'Notification'}
          </span>
          {notification.message ? (
            <span className="mt-1 block line-clamp-3 text-sm text-[#667085]">
              {notification.message}
            </span>
          ) : null}
        </span>
      </button>
    ),
    { id: `notif-${notification.id}`, duration: 8000 }
  )
}

/**
 * Polls the signed-in client's own inbox and toasts each new row.
 * Existing unread items at first load are not replayed.
 */
export default function NotificationLiveToaster() {
  const router = useRouter()

  useEffect(
    () =>
      subscribeNewNotifications((rows) => {
        rows.forEach((n) => showNotificationToast(n, router))
      }),
    [router]
  )

  useEffect(() => {
    let timer = null

    const tick = () => {
      if (!isClientSession()) return
      loadNotifications({ silent: true })
    }

    const start = () => {
      if (timer) return
      tick()
      timer = setInterval(tick, POLL_MS)
    }

    const stop = () => {
      if (!timer) return
      clearInterval(timer)
      timer = null
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        start()
        tick()
      } else {
        stop()
      }
    }

    const onFocus = () => {
      if (isClientSession()) tick()
    }

    const onAuth = () => {
      stop()
      if (isClientSession()) start()
    }

    if (document.visibilityState !== 'hidden') start()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)
    window.addEventListener('dice-auth-changed', onAuth)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('dice-auth-changed', onAuth)
    }
  }, [])

  return null
}
