/**
 * Event timing: À venir (before start) → En cours (start today or passed, end not passed) → Passé (after end).
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

export function eventTimingPhase(event) {
  const today = todayKey()
  const start = eventDateKey(
    event?.start_date ||
      event?.event_start_date ||
      event?.date ||
      event?.end_date ||
      event?.event_end_date
  )
  const end = eventDateKey(
    event?.end_date || event?.event_end_date || start
  )
  if (end && end < today) return 'ended'
  if (start && start > today) return 'upcoming'
  return 'ongoing'
}

export function isEventEnded(event) {
  return eventTimingPhase(event) === 'ended'
}

export function isEventUpcoming(event) {
  return eventTimingPhase(event) === 'upcoming'
}

export function isEventOngoing(event) {
  return eventTimingPhase(event) === 'ongoing'
}

export const TIMING_LABELS = {
  upcoming: 'À venir',
  ongoing: 'En cours',
  ended: 'Passé',
}

export function eventTimingLabel(event) {
  const status = String(event?.status || '').toLowerCase()
  if (status === 'cancelled') return 'Annulé'
  return TIMING_LABELS[eventTimingPhase(event)]
}

export function eventTimingMeta(event) {
  const status = String(event?.status || '').toLowerCase()
  if (status === 'cancelled') {
    return { phase: 'cancelled', label: 'Annulé', className: 'bg-red-50 text-red-600' }
  }
  if (status === 'draft') {
    return { phase: 'draft', label: 'Brouillon', className: 'bg-[#FFF4DE] text-[#B78103]' }
  }
  const phase = eventTimingPhase(event)
  if (phase === 'ended') {
    return { phase, label: 'Passé', className: 'bg-slate-100 text-slate-600' }
  }
  if (phase === 'upcoming') {
    return { phase, label: 'À venir', className: 'bg-[#E8F3FE] text-[#0A89F2]' }
  }
  return { phase, label: 'En cours', className: 'bg-emerald-50 text-[#0B9B6B]' }
}

export function timingOverlayClass(phase) {
  if (phase === 'ended') return 'bg-slate-800/80'
  if (phase === 'upcoming') return 'bg-[#0A89F2]/90'
  return 'bg-emerald-500/90'
}
