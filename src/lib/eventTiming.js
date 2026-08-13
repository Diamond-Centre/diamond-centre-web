/**
 * Event timing labels: Encore until the end date, Terminé/Passé only after it.
 */

export function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function eventDateKey(value) {
  if (!value) return ''
  const s = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** True only when the calendar end date is strictly before today. */
export function isEventEnded(event) {
  const end = eventDateKey(
    event?.end_date ||
      event?.event_end_date ||
      event?.start_date ||
      event?.event_start_date ||
      event?.date
  )
  if (!end) return false
  return end < todayKey()
}

export function eventTimingLabel(event) {
  const status = String(event?.status || '').toLowerCase()
  if (status === 'cancelled') return 'Annulé'
  if (isEventEnded(event)) return 'Terminé'
  return 'Encore'
}
