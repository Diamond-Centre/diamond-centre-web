'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const response = await api.get('/notifications')
      setNotifications(response.data)
      setUnreadCount(response.data.filter(n => !n.read).length)
    } catch (err) {
      console.error('Erreur notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Erreur marquage lu:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('Toutes les notifications ont été marquées comme lues')
    } catch (err) {
      console.error('Erreur marquage tout lu:', err)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // toutes les 30s
      return () => clearInterval(interval)
    }
  }, [user, fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}