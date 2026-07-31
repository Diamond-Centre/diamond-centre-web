/**
 * Local index of ticket IDs for the signed-in user.
 * DICE backend has no GET /tickets list — same pattern as the mobile app.
 */
import { auth } from '@/lib/auth'

const PREFIX = 'dice_ticket_ids_'

function storageKey() {
  const user = auth.getUser()
  const email = String(user?.email || '').trim().toLowerCase()
  return `${PREFIX}${email || 'guest'}`
}

function readRaw() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey())
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function writeRaw(list) {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(), JSON.stringify(list))
}

export const ticketStore = {
  load() {
    return readRaw()
  },

  /**
   * @param {object} meta
   * @param {number|string} meta.ticket_id
   * @param {number|string} meta.event_id
   * @param {string} [meta.event_title]
   * @param {string} [meta.location]
   * @param {string} [meta.date] ISO date
   * @param {string} [meta.time]
   * @param {string} [meta.customer_name]
   * @param {string} [meta.qr_code]
   * @param {string} [meta.entry_code]
   */
  upsert(meta) {
    const ticketId = Number(meta.ticket_id ?? meta.id)
    if (!ticketId) return
    const current = readRaw().filter((t) => Number(t.ticket_id) !== ticketId)
    current.unshift({
      ticket_id: ticketId,
      event_id: Number(meta.event_id) || null,
      event_title: meta.event_title || '',
      location: meta.location || meta.event_location || '',
      date: meta.date || meta.event_start_date || new Date().toISOString(),
      time: meta.time || null,
      customer_name: meta.customer_name || '',
      qr_code: meta.qr_code || meta.primary_qr || null,
      entry_code: meta.entry_code || null,
    })
    writeRaw(current)
  },

  remove(ticketId) {
    writeRaw(readRaw().filter((t) => Number(t.ticket_id) !== Number(ticketId)))
  },

  clear() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(storageKey())
  },
}
