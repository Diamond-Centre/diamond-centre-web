'use client'

import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'

const POLL_MS = 2000

function kickOff(message) {
  auth.logout()
  toast.error(message)
  const path = window.location.pathname || ''
  if (!path.startsWith('/auth')) {
    window.location.replace('/auth/login')
  }
}

export default function SessionGuard() {
  const kickingRef = useRef(false)

  useEffect(() => {
    let timer = null

    const check = async () => {
      if (kickingRef.current) return
      const token = auth.getToken()
      if (!token) return

      try {
        await api.pingSession(token)
      } catch (error) {
        if (error?.status !== 401) return
        kickingRef.current = true
        kickOff('Vous avez été déconnecté de cet appareil.')
      }
    }

    const start = () => {
      if (timer) return
      check()
      timer = setInterval(check, POLL_MS)
    }

    const stop = () => {
      if (!timer) return
      clearInterval(timer)
      timer = null
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }

    if (document.visibilityState !== 'hidden') start()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', check)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', check)
    }
  }, [])

  return null
}
